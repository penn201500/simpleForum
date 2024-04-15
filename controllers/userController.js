const User = require("../models/User");

const home = (req, res) => {
  res.render("home-guest");
};

function login(req, res) {
  let user = new User(req.body);
  user
    .login()
    .then((result) => {
      res.send(result);
    })
    .catch((e) => {
      res.send(e);
    });
}

function registration(req, res) {
  let user = new User(req.body);
  user.registration();
  if (user.errors.length) {
    res.send(user.errors);
  } else {
    res.send("Congrats, there are no errors.");
  }
}

module.exports = {
  home,
  registration,
  login,
};
