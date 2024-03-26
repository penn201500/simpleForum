const express = require("express");
const app = express();

app.use(express.static("public"));
app.set("views", "viewFiles");
app.set("view engine", "ejs");

app.get("/", (req, res) => {
    res.render("home-guest");
});

app.listen(3001, () => {
    console.log("Server is running on port 3001");
});
