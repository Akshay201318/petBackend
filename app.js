var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const cors = require("cors");
const fileUpload = require("express-fileupload");
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var db = require("./config/mongoose");
var app = express();
const User = require("./models/user");

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use(cors());
app.use(fileUpload());
// catch 404 and forward to error handler
// app.use(function (req, res, next) {
//   next(createError(404));
// });

app.post("/register", async function (req, res) {
  let user = await User.create(req.body.data);
  console.log("this is my user", user);
  return res.send("hello");
});

// app.get("/data", function (req, res) {
//   console.log(req.body.data.name);
//   return res.send({ name: "Panchal", email: "akshay@daffodilsw.com" });
// });

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;