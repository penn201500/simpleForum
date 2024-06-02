const User = require("../models/User")
const Post = require("../models/Post")
const Follow = require("../models/Follow")

const home = async (req, res) => {
  if (req.session.user) {
    // fetch feed of posts for current user
    let posts = await Post.getFeed(req.session.user._id)
    res.render("home-dashboard", {
      posts: posts,
      title: posts.length ? `(${posts.length})` : "", // posts count
    })
  } else {
    res.render("home-guest", {
      errors: req.flash("errors"),
      regErrors: req.flash("regErrors"),
    }) // access the flash object from the request object and delete it from the session
  }
}

async function sharedProfileData(req, res, next) {
  let isVisitorsProfile = false
  let isFollowing = false
  if (req.session.user) {
    isVisitorsProfile = req.profileUser._id.equals(req.session.user._id)
    isFollowing = await Follow.isVisitorFollowing(req.profileUser._id, req.visitorId)
  }
  req.isVisitorsProfile = isVisitorsProfile
  req.isFollowing = isFollowing
  // retrieve post count and follower/following count
  let postCountPromise = Post.countPostsByAuthor(req.profileUser._id)
  let followerCountPromise = Follow.countFollowersById(req.profileUser._id)
  let followingCountPromise = Follow.countFollowingById(req.profileUser._id)
  let [postCount, followerCount, followingCount] = await Promise.all([postCountPromise, followerCountPromise, followingCountPromise]) // start all promises at the same time

  req.postCount = postCount
  req.followerCount = followerCount
  req.followingCount = followingCount

  next()
}

function mustBeLoggedIn(req, res, next) {
  if (req.session.user) {
    next()
  } else {
    req.flash("errors", "You must be logged in to perform that action.")
    req.session.save(() => {
      res.redirect("/")
    })
  }
}

function login(req, res) {
  // http requests are stateless, we use sessions to store user data
  // session is a way to store data on the server temporarily
  // our server will remember the user's data until the session expires
  // so we can use this session data from any of our URLs or routes
  let user = new User(req.body)
  user
    .login()
    .then(result => {
      req.session.user = {
        avatar: user.avatar,
        username: user.data.username,
        _id: user.data._id,
      } // to make the session object unique to per user
      req.session.save(() => {
        // use fallback function to wait for the session to be saved
        res.redirect("/")
      })
    })
    .catch(e => {
      req.flash("errors", e) // add a flash object onto the request object and session
      req.session.save(() => {
        // use fallback function to wait for the session to be saved
        res.redirect("/")
      })
    })
}

function logout(req, res) {
  req.session.destroy(() => {
    res.redirect("/") // use callback function to wait for the session to be destroyed
  })
}

function registration(req, res) {
  let user = new User(req.body)
  user
    .registration()
    .then(() => {
      req.session.user = {
        avatar: user.avatar,
        username: user.data.username,
        _id: user.data._id,
      }
      req.session.save(() => {
        res.redirect("/")
      })
    })
    .catch(regErrors => {
      regErrors.forEach(error => {
        req.flash("regErrors", error)
      })
      req.session.save(() => {
        res.redirect("/")
      })
    })
}

function ifUserExists(req, res, next) {
  User.findByUsername(req.params.username, {
    projection: { username: 1, _id: 1 },
  })
    .then(userDocument => {
      req.profileUser = userDocument
      next()
    })
    .catch(() => {
      res.render("404")
    })
}

function profilePostsScreen(req, res) {
  Post.findByAuthorId(req.profileUser._id)
    .then(posts => {
      res.render("profile", {
        currentPage: "posts",
        posts: posts,
        profileUsername: req.profileUser.username,
        profileAvatar: req.profileUser.avatar,
        isFollowing: req.isFollowing,
        isVisitorsProfile: req.isVisitorsProfile,
        counts: { postCount: req.postCount, followerCount: req.followerCount, followingCount: req.followingCount },
      })
    })
    .catch(() => {
      res.render("404")
    })
}

async function profileFollowersScreen(req, res) {
  try {
    let followers = await Follow.getFollowersById(req.profileUser._id)
    res.render("profile-followers", {
      currentPage: "followers",
      followers: followers,
      profileUsername: req.profileUser.username,
      profileAvatar: req.profileUser.avatar,
      isFollowing: req.isFollowing,
      isVisitorsProfile: req.isVisitorsProfile,
      counts: { postCount: req.postCount, followerCount: req.followerCount, followingCount: req.followingCount },
    })
  } catch (error) {
    res.render("404")
  }
}

async function profileFollowingScreen(req, res) {
  try {
    let following = await Follow.getFollowingById(req.profileUser._id)
    res.render("profile-following", {
      currentPage: "following",
      following: following,
      profileUsername: req.profileUser.username,
      profileAvatar: req.profileUser.avatar,
      isFollowing: req.isFollowing,
      isVisitorsProfile: req.isVisitorsProfile,
      counts: { postCount: req.postCount, followerCount: req.followerCount, followingCount: req.followingCount },
    })
  } catch (error) {
    res.render("404")
  }
}

function doesUsernameExist(req, res) {
  User.findByUsername(req.body.username)
    .then(user => {
      if (user) {
        res.json(true)
      } else {
        res.json(false)
      }
    })
    .catch(() => {
      res.json(false)
    })
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
  profileFollowingScreen,
  doesUsernameExist,
}
