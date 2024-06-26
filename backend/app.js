const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const mongoose = require("mongoose");
const postRoutes = require("./routes/posts");
const userRoutes = require("./routes/user");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/images', express.static(path.join('backend/images')))
mongoose
  .connect(
    "mongodb+srv://yauhen:" + process.env.MONGO_ATLAS_PW + "@cluster0.a4fmaxt.mongodb.net/?retryWrites=true&w=majority",
  )
  .then(() => {
    console.log("connected to database!");
  })
  .catch((err) => {
    console.log(err);
  });

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization",
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, OPTIONS, DELETE, PATCH",
  );
  next();
});

app.use("/api/posts", postRoutes);
app.use("/api/user", userRoutes);
module.exports = app;
