const Mongoose = require("mongoose");
const userSchema = new Mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
const User = Mongoose.model("User", userSchema);

module.exports = User;
