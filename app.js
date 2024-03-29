const express = require("express");
const app = express();
const router = require("./router");


app.use(express.static("public"));
app.set("views", "viewFiles");
app.set("view engine", "ejs");

app.use("/", router);
app.use("/about", router);

app.listen(3001, () => {
    console.log("Server is running on port 3001");
});
