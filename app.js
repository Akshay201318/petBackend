var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const cors = require("cors");
const fileUpload = require("express-fileupload");
var router = express.Router();
// var indexRouter = require("./routes/index");
// var usersRouter = require("./routes/users");
var db = require("./config/mongoose");
var app = express();
const User = require("./models/user");
const Posts = require("./models/posts");
const { response } = require("express");

const multer = require("multer");

// var storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, path.join(__dirname, "uploads"));
//   },
//   filename: function (req, file, cb) {
//     cb(null, "mypost" + Date.now() + ".png");
//   },
// });
const storage = multer.diskStorage({
  destination: "uploads",
  filename: function (req, file, cb) {
    cb(null, file.name + "-" + Date.now() + path.extname(file.originalname));
  },
});

var upload = multer({ storage: storage }).single("mypost");
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use(cors());
// app.use(fileUpload());
// catch 404 and forward to error handler
// app.use(function (req, res, next) {
//   next(createError(404));
// });

// var storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, path.join(__dirname + ".." + PostPath));
//   },
//   filename: function (req, file, cb) {
//     cb(null, file.fieldname + "-" + Date.now());
//   },
// });

// var upload = multer({ storage: storage });

app.post("/register", async function (req, res) {
  let user = await User.create(req.body.data);
  console.log("this is my user", user);
  return res.send(user);
});
app.post("/login", async function (req, res) {
  console.log(req.body.data.email);
  try {
    let user = await User.find({ email: req.body.data.email });
    if (user.length > 0) {
      console.log(user[0].password);
      if (user[0].password === req.body.data.password) {
        return res.send(user);
      }

      return res.send(false);
    } else {
      console.log("this is my user elseeee", user);
      return res.send(false);
    }
  } catch (e) {
    console.log("Error in user login");
  }
});

app.post("/post", async (req, res) => {
  // try
  // Posts.uploadedPost(req, res, (err) => {
  //   if (err) {
  //     console.log("multer error", err);
  //     return res.send(false);
  //   }
  //   console.log(req.body.data.avatar);
  // });
  console.log(req.files);

  //   let post = await Posts.create({
  //     content: req.body.data.content,
  //     user: req.body.data.userId,
  //   });
  //   if (post) {
  //     console.log(post);
  //     return res.send(post);
  //   } else {
  //     return res.send(false);
  //   }
  // } catch (err) {
  //   console.log("error in creating post");
  // }
});
app.post("/postImage", async (req, res) => {
  // try
  // Posts.uploadedPost(req, res, (err) => {
  //   if (err) {
  //     console.log("multer error", err);
  //     return res.send(false);
  //   }
  //   console.log(req.body.data.avatar);
  // });

  upload(req, res, (err) => {
    if (err) {
      console.log("error in uploading the image");
    } else {
      console.log(req.file);
      console.log(req.body);
      return res.send(false);
    }
  });

  console.log(__dirname + "/uploads");
  //   let post = await Posts.create({
  //     content: req.body.data.content,
  //     user: req.body.data.userId,
  //   });
  //   if (post) {
  //     console.log(post);
  //     return res.send(post);
  //   } else {
  //     return res.send(false);
  //   }
  // } catch (err) {
  //   console.log("error in creating post");
  // }
});

app.use("/", require("./routes/index"));
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
