const express = require("express");
const session = require("express-session");
const mongoStore = require("connect-mongo");
const router = require("./router");
const { client, dbName } = require("./db");
const flash = require("connect-flash");
const app = express();

let sessionOptions = session({
  secret: "JavaScript is so cool", // a secret key used to sign the session ID cookie
  store: mongoStore.create({ client: client, dbName: dbName }), // store the session in the database
  resave: false, // forces the session to be saved back to the session store
  saveUninitialized: false, // forces a session that is "uninitialized" to be saved to the store
  cookie: { maxAge: 1000 * 60 * 60 * 24, httpOnly: true }, // 24 hours
});

// middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(sessionOptions);
app.use(flash());
app.use((req, res, next) => {
  if (req.session.user) {
    req.visitorId = req.session.user._id;
  } else {
    req.visitorId = 0;
  }
  res.locals.user = req.session.user;
  next();
});

app.use(express.static("public"));
app.set("views", "viewFiles");
app.set("view engine", "ejs");

app.use("/", router);
app.use("/login", router);
app.use("/registration", router);
app.use("/about", router);

module.exports = app;
