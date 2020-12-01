var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const cors = require("cors");
const passport = require("passport");
const passportJwt = require("./config/passportJwt");
const jwt = require("jsonwebtoken");
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
let imagename = "";
const storage = multer.diskStorage({
  destination: "uploads",
  filename: function (req, file, cb) {
    imagename =
      file.fieldname + "-" + Date.now() + path.extname(file.originalname);
    cb(null, imagename);
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
app.use(express.static("uploads"));

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

app.post("/register", async (req, res) => {
  let user = await User.create(req.body.data);
  console.log("this is my user", user);
  return res.send(user);
});
app.post("/login", async (req, res) => {
  // console.log(req.body.data.email);
  // try {
  //   let user = await User.find({ email: req.body.data.email });
  //   if (user.length > 0) {
  //     console.log(user[0].password);
  //     if (user[0].password === req.body.data.password) {
  //       return res.send(user);
  //     }

  //     return res.send(false);
  //   } else {
  //     console.log("this is my user elseeee", user);
  //     return res.send(false);
  //   }
  // } catch (e) {
  //   console.log("Error in user login");
  // }

  try {
    let user = await User.findOne({ email: req.body.data.email });

    if (!user || user.password != req.body.data.password) {
      return res.status(422).json({
        message: "Invalid username or password",
      });
    }
    console.log(user);
    return res.status(200).json({
      message: "SignIn successfully!!",
      data: {
        token: jwt.sign(user.toJSON(), "petsocial"),
      },
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    });
  } catch (err) {
    console.log("*******", err);
    return res.status(200).json({
      message: "Internal Server Error",
    });
  }
});

app.get("/post", async (req, res) => {
  let posts = await Posts.find();
  console.log(posts);
  return res.send(posts);
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

  upload(req, res, async (err) => {
    if (err) {
      console.log("error in uploading the image");
    } else {
      // console.log(req.file);
      // console.log(req.body);
      try {
        req.body.avatar = imagename;
        let post = await Posts.create(req.body);
        if (post) {
          console.log(post);
          return res.send(true);
        } else {
          return res.send(false);
        }
      } catch (err) {
        res.send(false);
      }
    }
  });
});

app.post("/singlepost", async (req, res) => {
  let post = await Posts.findById(req.body.data);
  if (post) {
    res.status(200).json(post);
  } else {
    res.status(500).json({
      message: "Post ot found",
    });
  }
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
