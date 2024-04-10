const bcrypt = require("bcrypt");
const webToken = require("jsonwebtoken");
const User = require("../Models/user");

exports.createUser = (req, res, next) => {
    bcrypt.hash(req.body.password, 10).then(hash => {
        const user = new User({
            email: req.body.email,
            password: hash,
        });
        user.save().then(result => {
            res.status(201).json({
                message: "User added successfully",
                result: result
            });
        }).catch(result => {
            res.status(500).json({
                    message: 'Invalid authentication credentials!'
            });
        })
    })

}

exports.userLogin = (req, res, next) => {
    User.findOne({ email: req.body.email }).then(user => {
        let fetchedUser;
        if (!user) {
            return res.status(401).json({
                message: "Auth failed"
            })
        }
        fetchedUser = user;
        return bcrypt.compare(req.body.password, user.password).then(result => {
            if (!result) {
                return res.status(401).json({
                    message: "Auth failed"
                })
            }
            const token = webToken.sign({ email: fetchedUser.email, userId: fetchedUser._id }, process.env.JWT_KEY, { expiresIn: "1h" });
            res.status(200).json({
                token: token,
                expiresIn: 3600,
                userId: fetchedUser._id,
            });
        }).catch(err => {
            return res.status(401).json({
                message: "Invalid authentications credentials!"
            })
        })
    });
} 