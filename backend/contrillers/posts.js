const Post = require("../Models/post");


exports.createPost = (req, res, next) => {
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


  exports.getPosts = (req, res, next) => {
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
  }

  exports.getPost = (req, res, next) => {
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
  }

  exports.updatePost = (req, res, next) => {
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
      if (response.matchedCount  > 0) {
        res.status(200).json({ message: "updated successfully!" });
      } else {
        res.status(401).json({ message: "Nor Authorized!" });
      }
    }).catch(error => {
      res.status(500).json({
        message: "Couldn't update post"
      })
    });
  }


  exports.deletePost = (req, res, next) => {
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
  }