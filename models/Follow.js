const { isConnected, getCollection } = require("../db");
const { ObjectId } = require("mongodb");

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
    await this.validate();
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

Follow.prototype.cleanUp = function () {
  if (typeof this.followedUsername !== "string") {
    this.followedUsername = "";
  }
};

Follow.prototype.validate = async function () {
  let followedAccount = await usersCollection.findOne({ username: this.followedUsername });
  if (followedAccount) {
    this.followedId = followedAccount._id;
  } else {
    this.errors.push("You cannot follow a user that does not exist.");
  }
};

module.exports = Follow;
