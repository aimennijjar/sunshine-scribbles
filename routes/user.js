// routes/user.js
const express = require("express");
const router = express.Router({ mergeParams: true });
const Post = require("../models/post");
const middleware = require("../middleware");

router.get("/", (req, res) => {
  res.send("Welcome");
});

router.get("/:name", (req, res) => {
  Post.find({ "author.username": req.params.name }, (err, allposts) => {
    if (err) {
      console.log("Error in find");
      console.log(err);
    } else {
      res.render("posts/user", {
        posts: allposts.reverse(),
        currentUser: req.user,
      });
    }
  });
});

module.exports = router;
