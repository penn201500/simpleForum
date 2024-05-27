const User = require("../models/User");
const Post = require("../models/Post");
const Follow = require("../models/Follow");

const home = (req, res) => {
  if (req.session.user) {
    res.render("home-dashboard", {
      username: req.session.user.username,
      avatar: req.session.user.avatar,
    });
  } else {
    res.render("home-guest", {
      errors: req.flash("errors"),
      regErrors: req.flash("regErrors"),
    }); // access the flash object from the request object and delete it from the session
  }
};

async function sharedProfileData(req, res, next) {
  let isVisitorsProfile = false;
  let isFollowing = false;
  if (req.session.user) {
    isVisitorsProfile = req.profileUser._id.equals(req.session.user._id);
    isFollowing = await Follow.isVisitorFollowing(req.profileUser._id, req.visitorId);
  }
  req.isVisitorsProfile = isVisitorsProfile;
  req.isFollowing = isFollowing;
  next();
}

function mustBeLoggedIn(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    req.flash("errors", "You must be logged in to perform that action.");
    req.session.save(() => {
      res.redirect("/");
    });
  }
}

function login(req, res) {
  // http requests are stateless, we use sessions to store user data
  // session is a way to store data on the server temporarily
  // our server will remember the user's data until the session expires
  // so we can use this session data from any of our URLs or routes
  let user = new User(req.body);
  user
    .login()
    .then(result => {
      req.session.user = {
        avatar: user.avatar,
        username: user.data.username,
        _id: user.data._id,
      }; // to make the session object unique to per user
      req.session.save(() => {
        // use fallback function to wait for the session to be saved
        res.redirect("/");
      });
    })
    .catch(e => {
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
  user
    .registration()
    .then(() => {
      req.session.user = {
        avatar: user.avatar,
        username: user.data.username,
        _id: user.data._id,
      };
      req.session.save(() => {
        res.redirect("/");
      });
    })
    .catch(regErrors => {
      regErrors.forEach(error => {
        req.flash("regErrors", error);
      });
      req.session.save(() => {
        res.redirect("/");
      });
    });
}

function ifUserExists(req, res, next) {
  User.findByUsername(req.params.username, {
    projection: { username: 1, _id: 1 },
  })
    .then(userDocument => {
      req.profileUser = userDocument;
      next();
    })
    .catch(() => {
      res.render("404");
    });
}

function profilePostsScreen(req, res) {
  Post.findByAuthorId(req.profileUser._id)
    .then(posts => {
      res.render("profile", {
        posts: posts,
        profileUsername: req.profileUser.username,
        profileAvatar: req.profileUser.avatar,
        isFollowing: req.isFollowing,
        isVisitorsProfile: req.isVisitorsProfile,
      });
    })
    .catch(() => {
      res.render("404");
    });
}

async function profileFollowersScreen(req, res) {
  try {
    let followers = await Follow.getFollowersById(req.profileUser._id);
    res.render("profile-followers", {
      followers: followers,
      profileUsername: req.profileUser.username,
      profileAvatar: req.profileUser.avatar,
      isFollowing: req.isFollowing,
      isVisitorsProfile: req.isVisitorsProfile,
    });
  } catch (error) {
    res.render("404");
  }
}

module.exports = {
  home,
  registration,
  login,
  logout,
  mustBeLoggedIn,
  ifUserExists,
  profilePostsScreen,
  sharedProfileData,
  profileFollowersScreen,
};
