const User = require("../models/User");

const home = (req, res) => {
  res.render('home-guest');
}

function registration(req, res) {
    let user = new User(req.body);
    user.registration();
}

module.exports = {
    home,
    registration
};