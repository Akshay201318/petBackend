const mongoose = require("mongoose");

const path = require("path");
const PostPath = path.join("/uploads");

const postSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
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
