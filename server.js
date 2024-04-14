const app = require("./app");
const logger = require("./logger");
const { ObjectId } = require("mongodb");
const { connectToDB, getCollection, closeDBConnection } = require("./db");

app.listen(3001, () => {
  console.log("Server is running on port 3001");
});
