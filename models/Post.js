const e = require("connect-flash");
const { isConnected, getCollection, ObjectId } = require("../db");
const User = require("./User");

let postCollection;

(async () => {
  try {
    postCollection = await getCollection("posts");
  } catch (error) {
    console.error("Failed to get the user collection: ", error);
  }
})();

let Post = function (data, userid, requestedPostId) {
  this.data = data;
  this.errors = [];
  this.userid = userid;
  this.requestedPostId = requestedPostId;
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
        .then(info => {
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

Post.prototype.update = function () {
  return new Promise(async (resolve, reject) => {
    try {
      let post = await Post.findSingleById(this.requestedPostId, this.userid);
      if (post.isVisitorOwner) {
        // actually update the db
        let status = await this.actuallyUpdate();
        resolve(status);
      } else {
        reject();
      }
    } catch {
      reject();
    }
  });
};

Post.prototype.actuallyUpdate = function () {
  return new Promise(async (resolve, reject) => {
    this.cleanUp();
    this.validate();
    if (!this.errors.length) {
      await postCollection.findOneAndUpdate({ _id: new ObjectId(this.requestedPostId) }, { $set: { title: this.data.title, body: this.data.body } });
      resolve("success");
    } else {
      resolve("failure");
    }
  });
};

Post.reusableQuery = function (uniqueOperations, visitorId) {
  return new Promise(async (resolve, reject) => {
    let aggOperations = uniqueOperations.concat([
      {
        $lookup: {
          from: "users",
          localField: "author",
          foreignField: "_id",
          as: "authorDocument",
        },
      },
      {
        $project: {
          title: 1,
          body: 1,
          createdDate: 1,
          author: { $arrayElemAt: ["$authorDocument", 0] },
        },
      },
    ]);

    let posts = await postCollection.aggregate(aggOperations).toArray();
    // clean up author property in each post object
    posts = posts.map(function (post) {
      post.isVisitorOwner = post.author._id.equals(visitorId);
      post.author = {
        username: post.author.username,
        avatar: new User(post.author, true).avatar,
      };
      return post;
    });
    resolve(posts);
  });
};

Post.findSingleById = function (id, visitorId) {
  return new Promise(async (resolve, reject) => {
    if (typeof id !== "string" || !ObjectId.isValid(id)) {
      reject();
      return;
    }

    let posts = await Post.reusableQuery([{ $match: { _id: new ObjectId(id) } }], visitorId);

    if (posts.length) {
      resolve(posts[0]); // resolve the 1st post
    } else {
      reject();
    }
  });
};

Post.findByAuthorId = function (authorId) {
  return Post.reusableQuery([{ $match: { author: authorId } }, { $sort: { createdDate: -1 } }]);
};

module.exports = Post;
