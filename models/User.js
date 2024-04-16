const validator = require("validator");
const { isConnected, getCollection } = require("../db");
const logger = require("../logger");
const bcrypt = require("bcryptjs");

let userCollection;

(async () => {
  try {
    userCollection = await getCollection();
  } catch (error) {
    console.error("Failed to get the user collection: ", error);
  }
})();

function User(data) {
  this.data = data;
  this.errors = [];
  this.errors = [];
}

User.prototype.cleanUp = function () {
  // check if the data is of type string
  if (typeof this.data.username !== "string") {
    this.data.username = "";
  }
  if (typeof this.data.email !== "string") {
    this.data.email = "";
  }
  if (typeof this.data.password !== "string") {
    this.data.password = "";
  }

  // get rid of any bogus properties
  this.data = {
    username: this.data.username.trim().toLowerCase(),
    email: this.data.email.trim().toLowerCase(),
    password: this.data.password,
  };
};

User.prototype.validate = function () {
  if (this.data.username === "") {
    this.errors.push("You must provide a username.");
  }
  if (this.data.password === "") {
    this.errors.push("You must provide a password.");
  }
  if (this.data.password.length > 0 && this.data.password.length < 12) {
    this.errors.push("Password must be at least 12 characters.");
  }
  if (this.data.password.length > 100) {
    // limit password length to 100 characters
    this.errors.push("Password cannot exceed 100 characters.");
  }
  if (this.data.username.length > 0 && this.data.username.length < 3) {
    this.errors.push("Username must be at least 3 characters.");
  }
  if (this.data.username.length > 30) {
    // limit username length to 30 characters
    this.errors.push("Username cannot exceed 30 characters.");
  }
  if (
    this.data.username.length > 0 &&
    !validator.isAlphanumeric(this.data.username)
  ) {
    this.errors.push("Username can only contain letters and numbers.");
  }
  if (!validator.isEmail(this.data.email)) {
    this.errors.push("You must provide a valid email address.");
  }
};

User.prototype.registration = function () {
  // validate user data
  this.cleanUp();
  this.validate();

  // save user data if there are no errors
  if (!this.errors.length && isConnected) {
    // hash user password
    const salt = bcrypt.genSaltSync(10);
    this.data.password = bcrypt.hashSync(this.data.password, salt);
    // save user data to the database
    userCollection.insertOne(this.data);
  }
};

User.prototype.login = function () {
  return new Promise(async (resolve, reject) => {
    this.cleanUp();
    // check if the username exists in the database
    const attemptUser = await userCollection.findOne({
      username: this.data.username,
    });
    if (attemptUser && bcrypt.compareSync(this.data.password, attemptUser.password)) {
      resolve("Congrats, you are logged in.");
    } else {
      reject("Invalid username or password.");
    }
  });
};

module.exports = User;
