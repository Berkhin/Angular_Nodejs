const express = require("express");
const router = express.Router();

const UserController = require("../contrillers/user")

router.post("/signup", UserController.createUser);


router.post("/login", UserController.userLogin);

module.exports = router;