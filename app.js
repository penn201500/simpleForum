const express = require("express")
const session = require("express-session")
const mongoStore = require("connect-mongo")
const router = require("./router")
const { client, dbName } = require("./db")
const flash = require("connect-flash")
const markdown = require("marked")
const csrf = require("csurf")
const app = express()
const sanitizeHtml = require("sanitize-html")
const rateLimit = require("express-rate-limit")

app.use(express.urlencoded({ extended: false }))
app.use(express.json())

app.use(
  rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minutes
    max: 20,
    message: "Too many requests from this IP, please try again after 1 minute",
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  })
)

app.use("/api", require("./router-api"))

let sessionOptions = session({
  secret: "JavaScript is so cool", // a secret key used to sign the session ID cookie
  store: mongoStore.create({ client: client, dbName: dbName }), // store the session in the database
  resave: false, // forces the session to be saved back to the session store
  saveUninitialized: false, // forces a session that is "uninitialized" to be saved to the store
  cookie: { maxAge: 1000 * 60 * 60 * 24, httpOnly: true, sameSite: true }, // 24 hours
})

// middleware
app.use(sessionOptions)
app.use(flash())
app.use((req, res, next) => {
  // make our markdown function available from within ejs templates
  res.locals.filterUserHTML = function (content) {
    return sanitizeHtml(markdown.parse(content), { allowedTags: ["p", "br", "ul", "ol", "li", "strong", "bold", "i", "em", "h1", "h2", "h3", "h4"], allowedAttributes: {} })
  }
  // make all error and success flash messages available from all templates
  res.locals.errors = req.flash("errors")
  res.locals.success = req.flash("success")
  // make current user id available on the req object
  if (req.session.user) {
    req.visitorId = req.session.user._id
  } else {
    req.visitorId = 0
  }
  // make user session data available from within view templates
  res.locals.user = req.session.user
  next()
})

app.use(express.static("public"))
app.set("views", "viewFiles")
app.set("view engine", "ejs")

app.use(csrf()) // added before router, any requests that modify state will need to have a valid and matching csrf token

app.use(function (req, res, next) {
  // to use csrfToken within template
  res.locals.csrfToken = req.csrfToken()
  next()
})

app.use("/", router)

app.use(function (err, req, res, next) {
  // CSRF error handler, redirect to homepage
  if (err) {
    if (err.code == "EBADCSRFTOKEN") {
      req.flash("errors", "Cross-site request forgery detected.")
      req.session.save(() => res.redirect("/"))
    } else {
      res.render("404")
    }
  }
})

app.use("/login", router)
app.use("/registration", router)
app.use("/about", router)

const server = require("http").createServer(app)

const io = require("socket.io")(server)

io.use(function (socket, next) {
  sessionOptions(socket.request, socket.request.res || {}, next)
})

io.on("connection", function (socket) {
  if (socket.request.session.user) {
    let user = socket.request.session.user
    socket.emit("welcome", { username: user.username, avatar: user.avatar })
    socket.on("messageFromBrowser", function (data) {
      socket.broadcast.emit("messageToBrowser", { message: sanitizeHtml(data.message, { allowedTags: [], allowedAttributes: {} }), username: user.username, avatar: user.avatar })
    })
  }
})

module.exports = server
