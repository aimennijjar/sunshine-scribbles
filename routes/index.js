// routes/index.js
const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/user");
const Post = require("../models/post");

// Route to render the landing page
router.get("/", (req, res) => {
  res.render("landing");
});

// Route for user registration
router.get("/register", (req, res) => {
  res.render("register");
});

router.post("/register", (req, res) => {
  var newUser = new User({ username: req.body.username });
  User.register(newUser, req.body.password, (err) => {
    if (err) {
      console.log(err);
      return res.render("register");
    }
    passport.authenticate("local")(req, res, () => {
      res.redirect("/posts");
    });
  });
});

// Route for login
router.get("/login", (req, res) => {
  res.render("login");
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/posts",
    failureRedirect: "/login",
  })
);

// Route for logout
router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/posts");
});

// Search route to search users and their posts
router.get("/search", async (req, res) => {
  const { username } = req.query;
  try {
    if (username) {
      const user = await User.findOne({ username });
      if (user) {
        // Find posts by the user
        const posts = await Post.find({ "author.id": user._id }).exec();
        res.render("search_results", { user, posts });
      } else {
        // If no user found
        res.render("search_results", { message: "User not found" });
      }
    } else {
      res.render("search", { message: "" });
    }
  } catch (err) {
    console.log("Error searching for user:", err);
    res.redirect("/search");
  }
});

module.exports = router;
