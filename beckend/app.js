const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use((req, res, next)=>{
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, OPTIONS, DELETE, PATCH");
  next();
})

app.post('/api/posts', (req, res, next)=>{
const posts = req.body
  console.log(posts)
  res.status(201, ).json({message: 'post added successfully'});
})

app.get('/api/posts', (req, res, next)  => {
  const posts = [{
    id: 'wefrq3fwq3',
    title: 'First post',
    content: 'this is my first content '
  },
    {
      id: '34tergewrgw',
      title: 'Second post',
      content: 'this is my second content '
    }]
  res.status(200).json({message: 'Posts fetched Successfully!', posts})
  next();
})

module.exports = app;
