const { isConnected, getCollection } = require("../db");
const { ObjectId } = require("mongodb");
const User = require("../models/User");

let usersCollection;
let followCollection;

(async () => {
  try {
    usersCollection = await getCollection("users");
  } catch (error) {
    console.error("Failed to get the user collection: ", error);
  }
})();

(async () => {
  try {
    followCollection = await getCollection("follows");
  } catch (error) {
    console.error("Failed to get the user collection: ", error);
  }
})();

let Follow = function (followedUsername, authorId) {
  this.followedUsername = followedUsername;
  this.authorId = authorId;
  this.errors = [];
};

Follow.prototype.create = function () {
  return new Promise(async (resolve, reject) => {
    this.cleanUp();
    await this.validate("create");
    if (!this.errors.length) {
      await followCollection.insertOne({
        followedId: this.followedId,
        authorId: new ObjectId(this.authorId),
      });
      resolve();
    } else {
      reject(this.errors);
    }
  });
};

Follow.prototype.delete = function () {
  return new Promise(async (resolve, reject) => {
    this.cleanUp();
    await this.validate("delete");
    if (!this.errors.length) {
      await followCollection.deleteOne({
        followedId: this.followedId,
        authorId: new ObjectId(this.authorId),
      });
      resolve();
    } else {
      reject(this.errors);
    }
  });
};
Follow.prototype.cleanUp = function () {
  if (typeof this.followedUsername !== "string") {
    this.followedUsername = "";
  }
};

Follow.prototype.validate = async function (action) {
  let followedAccount = await usersCollection.findOne({ username: this.followedUsername });
  if (followedAccount) {
    this.followedId = followedAccount._id;
  } else {
    this.errors.push("You cannot follow a user that does not exist.");
  }

  let doesFollowAlreadyExist = await followCollection.findOne({
    followedId: this.followedId,
    authorId: new ObjectId(this.authorId),
  });
  if (action === "create") {
    if (doesFollowAlreadyExist) {
      this.errors.push("You are already following this user.");
    }
  }
  if (action === "delete") {
    if (!doesFollowAlreadyExist) {
      this.errors.push("You are not following this user.");
    }
  }

  // should not be able to follow yourself
  if (this.followedId.equals(this.authorId)) {
    this.errors.push("You cannot follow yourself.");
  }
};

Follow.isVisitorFollowing = async function (followedId, visitorId) {
  let follow = await followCollection.findOne({
    followedId: followedId,
    authorId: new ObjectId(visitorId),
  });
  if (follow) {
    return true;
  } else {
    return false;
  }
};

Follow.getFollowersById = function (id) {
  return new Promise(async (resolve, reject) => {
    try {
      let followers = await followCollection
        .aggregate([
          { $match: { followedId: id } },
          {
            $lookup: {
              from: "users",
              localField: "authorId",
              foreignField: "_id",
              as: "authorDocument",
            },
          },
          {
            $project: {
              username: { $arrayElemAt: ["$authorDocument.username", 0] },
              email: { $arrayElemAt: ["$authorDocument.email", 0] },
            },
          },
        ])
        .toArray();
      followers = followers.map(function (follower) {
        let user = new User(follower, true);
        return {
          username: follower.username,
          avatar: user.avatar,
        };
      });
      resolve(followers);
    } catch (error) {
      reject();
    }
  });
};

module.exports = Follow;
