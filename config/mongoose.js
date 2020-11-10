let mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/petData");

let db = mongoose.connection;

db.on("error", console.error.bind(console, "MongoDB connection error:"));

db.once("open", function () {
  console.log("Successfully connected to the database");
});
