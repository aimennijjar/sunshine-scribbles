//middleware/index.js
const Post = require("../models/post");
const Comment = require("../models/comment");

const middlewareObj = {};

// Middleware to check post ownership
middlewareObj.checkPostOwnership = function (req, res, next) {
  if (req.isAuthenticated()) {
    console.log("Authenticated user:", req.user);
    Post.findById(req.params.id, (err, foundPost) => {
      if (err || !foundPost) {
        console.error("Error finding post:", err);
        return res.redirect("back");
      }
      console.log("Found Post:", foundPost);
      // Check if the logged-in user is the post's author
      if (foundPost.author.id.equals(req.user._id)) {
        console.log("User owns the post.");
        return next();
      } else {
        console.error("User does not have permission to edit this post.");
        return res.redirect("back");
      }
    });
  } else {
    console.error("User is not authenticated.");
    res.redirect("back");
  }
};

// Middleware to check comment ownership
middlewareObj.checkCommentOwnership = function (req, res, next) {
  if (req.isAuthenticated()) {
    console.log("Authenticated user:", req.user);
    Comment.findById(req.params.comment_id, (err, foundComment) => {
      if (err || !foundComment) {
        console.error("Error finding comment:", err);
        return res.redirect("back");
      }
      console.log("Found Comment:", foundComment);
      // Check if the logged-in user is the comment's author
      if (foundComment.author.id.equals(req.user._id)) {
        console.log("User owns the comment.");
        return next();
      } else {
        console.error("User does not have permission to edit this comment.");
        return res.redirect("back");
      }
    });
  } else {
    console.error("User is not authenticated.");
    res.redirect("back");
  }
};

// Middleware to check if user is logged in
middlewareObj.isLoggedIn = function (req, res, next) {
  if (req.isAuthenticated()) {
    console.log("User is logged in:", req.user);
    return next();
  }
  console.error("User must be logged in to access this resource.");
  res.redirect("/login");
};

module.exports = middlewareObj;
