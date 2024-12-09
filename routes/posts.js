// routes/posts.js
const express = require("express");
const router = express.Router({ mergeParams: true });
const Post = require("../models/post");
const middleware = require("../middleware");

// Route to display all posts
router.get("/", async (req, res) => {
  try {
    const allposts = await Post.find({}).exec();
    res.render("posts/index", {
      posts: allposts.reverse(), // Display posts in reverse order (latest first)
      currentUser: req.user,
    });
  } catch (err) {
    console.log("Error in finding posts:", err);
    res.redirect("/posts");
  }
});

// Route to create a new post
router.post("/", middleware.isLoggedIn, (req, res) => {
  const { name, image, description } = req.body;
  const author = {
    id: req.user._id,
    username: req.user.username,
  };

  const newPost = {
    name,
    image, // Save the image URL provided by the user
    description,
    author,
  };

  Post.create(newPost, (err) => {
    if (err) {
      console.log("Error in inserting post into DB:", err);
    } else {
      res.redirect("/posts");
    }
  });
});

// Route to render the form to publish a new post
router.get("/publish", middleware.isLoggedIn, (req, res) => {
  res.render("posts/new");
});

// Route to show a specific post
router.get("/:id", async (req, res) => {
  try {
    const foundPost = await Post.findById(req.params.id)
      .populate("comments")
      .populate("likes") // Populate likes to show user info if needed
      .exec();
    res.render("posts/show", { post: foundPost, currentUser: req.user });
  } catch (err) {
    console.log("Error occurred in finding the post by ID:", err);
    res.redirect("/posts");
  }
});

// Route to like/unlike a post
router.post("/:id/like", middleware.isLoggedIn, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    console.log("Current User ID: ", req.user._id);
    console.log("Post Likes: ", post.likes);

    const alreadyLiked = post.likes.includes(req.user._id);
    console.log("Already Liked?: ", alreadyLiked);  // Log if the user already liked the post

    if (alreadyLiked) {
      post.likes = post.likes.filter(userId => userId.toString() !== req.user._id.toString());
    } else {
      post.likes.push(req.user._id);
    }

    await post.save();
    res.redirect(`/posts/${post._id}`);
  } catch (err) {
    console.error("Error updating likes:", err);
    res.redirect("/posts");
  }
});






// Route to render the edit form for a post
router.get("/:id/edit", middleware.checkPostOwnership, (req, res) => {
  Post.findById(req.params.id, (err, foundPost) => {
    if (err) {
      console.log("Error finding post for editing:", err);
      return res.redirect("/posts");
    }
    res.render("posts/edit", { post: foundPost });
  });
});

// Route to update a post
router.put("/:id", middleware.checkPostOwnership, (req, res) => {
  Post.findByIdAndUpdate(req.params.id, req.body.post, (err) => {
    if (err) {
      console.log("Error updating the post:", err);
      return res.redirect("back");
    }
    res.redirect("/posts/" + req.params.id);
  });
});

// Route to delete a post
router.delete("/:id", middleware.checkPostOwnership, (req, res) => {
  Post.findByIdAndRemove(req.params.id, (err) => {
    if (err) {
      console.log("Error deleting the post:", err);
      return res.redirect("/posts");
    }
    res.redirect("/posts");
  });
});

module.exports = router;
