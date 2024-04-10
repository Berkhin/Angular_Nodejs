const express = require("express");
const router = express.Router();
const multer = require("multer");
const Post = require("../../../backend/Models/post");
const checkAuth = require("../../../backend/middleware/check-auth");

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

router.post(
  "",
  checkAuth,
  multer({ storage }).single("image"),
  (req, res, next) => {
    const url = req.protocol + "://" + req.get("host");
    const posts = new Post({
      title: req.body.title,
      content: req.body.content,
      imagePath: url + "/images/" + req.file.filename,
      creator: req.userData.userId,
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
    }).catch(error => {
      res.status(500).json({
        message: 'Creation new user Failed!'
      })
    })
  },
);

router.get("", (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const postQuery = Post.find();
  let fetchedPosts;
  if (pageSize && currentPage) {
    postQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }
  postQuery
    .then((documents) => {
      fetchedPosts = documents;
      return Post.countDocuments();
    })
    .then((count) => {
      res
        .status(200)
        .json({
          message: "Posts fetched Successfully!",
          posts: fetchedPosts,
          maxPosts: count,
        });
    }).catch(error => {
      res.status(500).json({
        message: "Fetching posts failed!"
      })
    })

});

router.get("/:id", (req, res, next) => {
  Post.findById(req.params.id).then((post) => {
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({ message: "Post not found" });
    }
  }).catch(error => {
    res.status(500).json({
      message: "Fetching post failed!"
    })
  })
});

router.put(
  "/:id",
  checkAuth,
  multer({ storage }).single("image"),
  (req, res, next) => {
    let imagePath = req.body.imagePath;
    if (req.file) {
      const url = req.protocol + "://" + req.get("host");
      imagePath = url + "/images/" + req.file.filename;
    }
    const updatedPost = new Post({
      _id: req.body.id,
      title: req.body.title,
      content: req.body.content,
      imagePath: imagePath,
      creator: req.creator,
    });
    Post.updateOne(
      { _id: req.params.id, creator: req.userData.userId },
      updatedPost,
    ).then((response) => {
      if (response.modifiedCount > 0) {
        res.status(200).json({ message: "updated successfully!" });
      } else {
        res.status(401).json({ message: "Nor Authorized!" });
      }
    }).catch(error => {
      res.status(500).json({
        message: "Couldn't update post"
      })
    });
  },
);

router.delete("/:id", (req, res, next) => {
  Post.deleteOne({ _id: req.params.id }).then((result) => {
    if (result.deletedCount > 0) {
      res.status(200).json({ message: "Delete successfully!" });
    } else {
      res.status(401).json({ message: "Nor Authorized!" });
    }
  }).catch(error => {
    res.status(500).json({
      message: "Fetching posts failed!"
    })
  })
});

module.exports = router;
