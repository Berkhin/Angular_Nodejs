const express = require('express');
const router = express.Router();
const Post = require('../../../beckend/Models/post')


router.post('', (req, res, next)=>{
  const posts = new Post({
    title: req.body.title,
    content: req.body.content
  })
  console.log(posts)
  posts.save().then((response)=>{
    const postId = response._id
    res.status(201, ).json({message: 'post added successfully', postId});
  });
})

router.get('', (req, res, next)  => {
  Post.find().then((documents) => {
    res.status(200).json({message: 'Posts fetched Successfully!', posts: documents})
    next();
  })
})

router.get('/:id', (req, res, next)=>{
  Post.findById(req.params.id).then(post => {
    if(post){
      res.status(200).json(post)
    }else{
      res.status(404).json({message: 'Post not found'})
    }
  })
})

router.put('/:id', (req, res, next) => {

  const updatedPost = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content
  })
  Post.updateOne({_id: req.params.id}, updatedPost).then((response)=>{
    res.status(200).json({message: "updated successfully!"})
  })
})

router.delete('/:id', (req, res, next) =>{
  Post.deleteOne({_id: req.params.id}).then((result) =>{
    console.log(result)
    res.status(200).json({message: 'deleted successfully!'})
  })
})


module.exports = router;
