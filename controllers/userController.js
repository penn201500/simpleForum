const User = require("../models/User");

const home = (req, res) => {
  if (req.session.user) {
    res.render("home-dashboard", { username: req.session.user.username });
  } else {
    res.render("home-guest", {
      errors: req.flash("errors"),
      regErrors: req.flash("regErrors"),
    }); // access the flash object from the request object and delete it from the session
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
      req.session.save(() => {
        // use fallback function to wait for the session to be saved
        res.redirect("/");
      });
    })
    .catch((e) => {
      req.flash("errors", e); // add a flash object onto the request object and session
      req.session.save(() => {
        // use fallback function to wait for the session to be saved
        res.redirect("/");
      });
    });
}

function logout(req, res) {
  req.session.destroy(() => {
    res.redirect("/"); // use callback function to wait for the session to be destroyed
  });
}

function registration(req, res) {
  let user = new User(req.body);
  user.registration();
  if (user.errors.length) {
    user.errors.forEach((error) => {
      req.flash("errors", error);
    });
    req.session.save(() => {
      // req.flash will update the session object in db, so we need to manually save the session; then redirect
      res.redirect("/");
    });
  } else {
    res.send("Congrats, there are no errors.");
  }
}

module.exports = {
  home,
  registration,
  login,
  logout,
};
