// routes/comments.js
const express = require("express");
const router = express.Router({ mergeParams: true });
const Post = require("../models/post");
const Comment = require("../models/comment");
const middleware = require("../middleware");

// Route to show the form for creating a new comment
router.get("/new", middleware.isLoggedIn, (req, res) => {
  Post.findById(req.params.id, (err, post) => {
    if (err) {
      console.log("Error finding post for new comment:", err);
    } else {
      res.render("comments/new", { post: post });
    }
  });
});

// Route to create a new comment
router.post("/", middleware.isLoggedIn, (req, res) => {
  Post.findById(req.params.id, (err, post) => {
    if (err) {
      console.log("Error finding post for comment creation:", err);
      res.redirect("/posts");
    } else {
      Comment.create(req.body.comment, (err, comment) => {
        if (err) {
          console.log("Error creating comment:", err);
        } else {
          // Assign author info to the comment
          comment.author.id = req.user._id;
          comment.author.username = req.user.username;
          comment.save();

          // Associate the comment with the post
          post.comments.push(comment);
          post.save();

          res.redirect("/posts/" + post._id);
        }
      });
    }
  });
});

// Route to show the edit form for a comment
router.get("/:comment_id/edit", middleware.checkCommentOwnership, (req, res) => {
  Comment.findById(req.params.comment_id, (err, foundComment) => {
    if (err) {
      console.log("Error finding comment for editing:", err);
      res.redirect("back");
    } else {
      res.render("comments/edit", {
        post_id: req.params.id,
        comment: foundComment,
      });
    }
  });
});

// Route to update a comment
router.put("/:comment_id", middleware.checkCommentOwnership, (req, res) => {
  Comment.findByIdAndUpdate(
    req.params.comment_id,
    req.body.comment,
    (err) => {
      if (err) {
        console.log("Error updating comment:", err);
        res.redirect("back");
      } else {
        res.redirect("/posts/" + req.params.id);
      }
    }
  );
});

// Route to delete a comment
router.delete("/:comment_id", middleware.checkCommentOwnership, (req, res) => {
  Comment.findByIdAndDelete(req.params.comment_id, (err) => {
    if (err) {
      console.log("Error deleting comment:", err);
      res.redirect("/posts/" + req.params.id);
    } else {
      res.redirect("/posts/" + req.params.id);
    }
  });
});

module.exports = router;
