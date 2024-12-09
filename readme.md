# Sunshines Scribbles.

A cute and positive blogging web app built using Node.js, Express.js, and MongoDB. The app has a sunshiney, uplifting vibe designed to inspire self-love, creativity, and kindness. It features authentication and authorization with PassportJS to allow users to create and manage their posts, comment on others' posts, and share their thoughts with a loving community. The app also includes random journal prompts to keep the positive energy flowing and encourage self-care and reflection.


## Functions

- SignIn - Log in to your existing account.
- SignUp - Sign up using a username and password.
- Add Post - Add a new post with text, similar to Twitter.
- Edit Post - Edit an existing post.
- Remove Post - Delete a post.
- Like/Unlike Posts - Like or unlike posts to show support.
- Comment on Posts - Add comments to posts and view comments left by others or delete.
- Search users and view their posts

## Custom Features
- User Authentication & Authorization: Implemented with PassportJS to ensure users can only add/edit/remove posts when logged in.
- Journal Entry Prompts: Random journal prompts available to encourage positive vibes and self-care.

## Routes

- GET /posts - View all posts.
- GET /user/:username - View all posts by a specific user.
- POST /posts/publish - Add a new post (accessible when the user is authenticated).
- GET /posts/:id - View a specific post by its ID.
- PUT /posts/:id - Update an existing post with a unique ID.
- DELETE /posts/:id - Delete a post by its unique ID.
- GET /search - Search for users and view their posts.
- GET /prompts - Get a random journal entry prompt to inspire your next post.
- POST /posts/:id/comments - Add a comment to a post.
- DELETE /posts/:id/comments/:commentId - Delete a specific comment on a post.
- GET /posts/:id/comments - View all comments on a post.

## Technologies Used

Node.js - JavaScript runtime for the backend.
Express.js - Web framework for building RESTful APIs and handling routing.
MongoDB - Database for storing user data and posts.
Passport.js - Authentication middleware for user login and signup.
Handlebars - Templating engine for rendering dynamic views.
CSS - For styling the web app with a cute, girly, and positive theme

## Project Archietecture

```tree
├── app.js
├── middleware
    └── index.js
├── models
    ├── comment.js
    ├── post.js
    └── user.js
├── node_modules
├── package.json
├── package-lock.json
├── public
├── journal_prompts.json   
├── readme.md
├── routes
    ├── comments.js
    ├── index.js
    ├── posts.js
    └── user.js
└── views
    ├── comments
    ├── landing.hbs
    ├── login.hbs
    ├── posts
    └── register.hbs

```

# How to run

- git clone repository link / download zip file
- npm install
- npm start
