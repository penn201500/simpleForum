const express = require("express");
const router = express.Router();
const userController = require("./controllers/userController");
const postController = require("./controllers/postController");

// user related routes
router.get("/", userController.home);
router.post("/registration", userController.registration);
router.post("/login", userController.login);
router.post("/logout", userController.logout);

// profile related routes
router.get("/profile/:username", userController.ifUserExists, userController.profilePostsScreen);

// post related routes
router.get("/create-post", userController.mustBeLoggedIn, postController.viewCreateScreen);
router.post("/create-post", userController.mustBeLoggedIn, postController.createPost);
router.get("/post/:id", postController.viewSingle);
router.get("/post/:id/edit", userController.mustBeLoggedIn, postController.viewEditScreen);
router.post("/post/:id/edit", userController.mustBeLoggedIn, postController.edit);
router.post("/post/:id/delete", userController.mustBeLoggedIn, postController.delete);

router.get("/about", (req, res) => {
  res.send("This is an about page");
});
module.exports = router;
