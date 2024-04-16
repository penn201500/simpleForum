const express = require("express");
const session = require("express-session");
const app = express();
const router = require("./router");

let sessionOptions = session({
    secret: "JavaScript is so cool", // a secret key used to sign the session ID cookie
    resave: false, // forces the session to be saved back to the session store
    saveUninitialized: false, // forces a session that is "uninitialized" to be saved to the store
    cookie: { maxAge: 1000 * 60 * 60 * 24, httpOnly: true }, // 24 hours
})

// middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(sessionOptions);

app.use(express.static("public"));
app.set("views", "viewFiles");
app.set("view engine", "ejs");

app.use("/", router);
app.use("/login", router);
app.use("/registration", router);
app.use("/about", router);

module.exports = app;
