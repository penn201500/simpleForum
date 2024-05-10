const express = require("express");
const router = express.Router();
const userController = require("./controllers/userController");
const postController = require("./controllers/postController");

// user related routes
router.get("/", userController.home);
router.post("/registration", userController.registration);
router.post("/login", userController.login);
router.post("/logout", userController.logout);

router.get(
  "/create-post",
  userController.mustBeLoggedIn,
  postController.viewCreateScreen
);
router.post(
  "/create-post",
  userController.mustBeLoggedIn,
  postController.createPost
);

router.get("/about", (req, res) => {
  res.send("This is an about page");
});
module.exports = router;
