const User = require("../models/User");

const home = (req, res) => {
  if (req.session.user) {
    res.render("home-dashboard", { username: req.session.user.username });
  } else {
    res.render("home-guest");
  }
};

function login(req, res) {
  // http requests are stateless, we use sessions to store user data
  // session is a way to store data on the server temporarily
  // our server will remember the user's data until the session expires
  // so we can use this session data from any of our URLs or routes
  let user = new User(req.body);
  user
    .login()
    .then((result) => {
      req.session.user = { username: user.data.username }; // to make the session object unique to per user
      res.send(result);
    })
    .catch((e) => {
      res.send(e);
    });
}

function logout(req, res){
  req.session.destroy(() => {
    res.redirect("/"); // use callback function to wait for the session to be destroyed
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
  logout
};
