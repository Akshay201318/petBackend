const mongoose = require("mongoose");

const path = require("path");
const PostPath = path.join("/uploads");

const postSchema = new mongoose.Schema(
  {
    content: {
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
    email: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

postSchema.static.postPath = PostPath;

const Posts = mongoose.model("Posts", postSchema);
module.exports = Posts;
