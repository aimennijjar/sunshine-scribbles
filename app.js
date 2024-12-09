//app.js
const express = require("express");
const app = express();
const dotenv = require("dotenv").config();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const methodOverride = require("method-override");
const User = require("./models/user");
const hbs = require("hbs");
const fs = require("fs");  // To read the journal prompts file
const path = require("path");  // To handle file paths

// Register Handlebars helpers with `hbs`
const helpers = require("handlebars-helpers")();
hbs.registerHelper(helpers);

// Register custom 'includes' helper to check if a value exists in an array
hbs.registerHelper("includes", function (array, value) {
  return array.some(item => String(item) === String(value)); // Compare values as strings to ensure proper matching
});

// Register custom 'eq' helper for comparison in templates
hbs.registerHelper("eq", function (a, b) {
  return String(a) === String(b); // Ensure type coercion for IDs (convert both to strings)
});

// Connect to MongoDB
const mongo_uri = process.env.mongo_uri;

mongoose
  .connect(mongo_uri, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("Database Connected Successfully");
  })
  .catch((err) => {
    console.log("Error occur while connecting ", err);
  });

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "hbs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));

// Session Handling (In-Memory)
app.use(
  require("express-session")({
    secret: "I am the best", // Secret for signing the session ID cookie
    resave: false,
    saveUninitialized: false,
  })
);

// Passport Configuration
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Make current user available to all views
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});

// Routes
const commentRoutes = require("./routes/comments");
const postRoutes = require("./routes/posts");
const indexRoutes = require("./routes/index");
const userRoutes = require("./routes/user");

// Route to serve journal prompts
app.get("/prompts", (req, res) => {
  fs.readFile(path.join(__dirname, "data", "journal_prompts.json"), "utf8", (err, data) => {
    if (err) {
      console.error("Error reading the file:", err);
      return res.status(500).send("Error reading journal prompts.");
    }
    const prompts = JSON.parse(data); // Parse the JSON data
    const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)]; // Get a random prompt
    res.render("prompts", { prompt: randomPrompt }); // Render a single random prompt
  });
});

// Other routes for posts, comments, and users
app.use("/", indexRoutes);
app.use("/posts", postRoutes);
app.use("/posts/:id/comments", commentRoutes);
app.use("/user", userRoutes);

// Start the server
let port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server Listening at http://localhost:${port}`);
});
