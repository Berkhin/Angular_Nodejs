const express = require("express");
const router = express.Router();
const multer = require("multer");
const Post = require("../../../backend/Models/post");

const MINE_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MINE_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid mime type");
    if (isValid) {
      error = null;
    }
    cb(error, "backend/images");
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(" ").join("_");
    const ext = MINE_TYPE_MAP[file.mimetype];
    cb(null, name + "-" + Date.now() + "." + ext);
  },
});

router.post("", multer({ storage }).single("image"), (req, res, next) => {
  const url = req.protocol + "://" + req.get("host");
  const posts = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + "/images/" + req.file.filename,
  });
  posts.save().then((response) => {
    const postId = response._id;
    res.status(201).json({
      message: "post added successfully",
      post: {
        ...response,
        id: response._id,
      },
    });
  });
});

router.get("", (req, res, next) => {
  Post.find().then((documents) => {
    res
      .status(200)
      .json({ message: "Posts fetched Successfully!", posts: documents });
    next();
  });
});

router.get("/:id", (req, res, next) => {
  Post.findById(req.params.id).then((post) => {
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({ message: "Post not found" });
    }
  });
});

router.put("/:id", multer({ storage }).single("image"), (req, res, next) => {
  let imagePath = req.body.imagePath;
  if(req.file){
    const url = req.protocol + "://" + req.get("host");
    imagePath = url + "/images/" + req.file.filename;
  }
  const updatedPost = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    imagePath: req.body.imagePath
  });
  Post.updateOne({ _id: req.params.id }, updatedPost).then((response) => {
    res.status(200).json({ message: "updated successfully!" });
  });
});

router.delete("/:id", (req, res, next) => {
  Post.deleteOne({ _id: req.params.id }).then((result) => {
    console.log(result);
    res.status(200).json({ message: "deleted successfully!" });
  });
});

module.exports = router;
