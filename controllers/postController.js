const Post = require("../models/Post");

exports.viewCreateScreen = function (req, res) {
  res.render("create-post");
};

exports.createPost = function (req, res) {
  let post = new Post(req.body, req.session.user._id);
  post
    .create()
    .then(function (newId) {
      req.flash("success", "New post successfully created.");
      req.session.save(() => res.redirect(`/post/${newId}`));
    })
    .catch(function (errors) {
      post.errors.forEach((error) => req.flash("errors", error));
      req.session.save(() => res.redirect("/create-post"));
    });
};
