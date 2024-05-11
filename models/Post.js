const e = require("connect-flash");
const { isConnected, getCollection, ObjectId } = require("../db");

let postCollection;

(async () => {
  try {
    postCollection = await getCollection("posts");
  } catch (error) {
    console.error("Failed to get the user collection: ", error);
  }
})();

let Post = function (data, userid) {
  this.data = data;
  this.errors = [];
  this.userid = userid;
};

Post.prototype.cleanUp = function () {
  if (typeof this.data.title !== "string") {
    this.data.title = "";
  }
  if (typeof this.data.body !== "string") {
    this.data.body = "";
  }

  // get rid of any bogus properties
  this.data = {
    title: this.data.title.trim(),
    body: this.data.body.trim(),
    createdDate: new Date(),
    author: new ObjectId(this.userid),
  };
};

Post.prototype.validate = function () {
  if (this.data.title === "") {
    this.errors.push("You must provide a title.");
  }
  if (this.data.body === "") {
    this.errors.push("You must provide post content.");
  }
};

Post.prototype.create = function () {
  return new Promise(async (resolve, reject) => {
    this.cleanUp();
    this.validate();
    if (!this.errors.length) {
      // save post into the database
      postCollection
        .insertOne(this.data)
        .then((info) => {
          resolve();
        })
        .catch(() => {
          this.errors.push("Please try again later.");
          reject(this.errors);
        });
    } else {
      reject(this.errors);
    }
  });
};

Post.findSingleById = function (id) {
  return new Promise(async (resolve, reject) => {
    if (typeof id !== "string" || !ObjectId.isValid(id)) {
      reject();
      return;
    }
    let posts = await postCollection.findOne({ _id: new ObjectId(id) });
    if (posts) {
      resolve(posts);
    } else {
      reject();
    }
  });
};

module.exports = Post;