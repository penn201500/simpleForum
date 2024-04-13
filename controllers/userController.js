const User = require("../models/User");

const home = (req, res) => {
  res.render('home-guest');
}


function registration(req, res) {
    let user = new User(req.body);
    user.registration();
    if (user.errors.length) {
      res.send(user.errors);
    } else {
      res.send("Congrats, there are no errors.")
    }
}

module.exports = {
    home,
    registration
};
