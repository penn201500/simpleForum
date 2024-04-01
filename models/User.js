function User(data) {
    this.data = data;
};

User.prototype.registration = function () {
    console.log("registration");
};

module.exports = User;