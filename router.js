const express = require("express");
const router = express.Router();
const userController = require("./controllers/userController");

router.get("/", userController.home);

router.get("/about", (req, res) => {
    res.send("This is an about page");
});

module.exports = router;

