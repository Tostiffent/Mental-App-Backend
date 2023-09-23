import { Schema, model } from "mongoose";

const postSchema = new Schema({
  post_id: { type: String, required: true },
  author: { type: Schema.Types.Mixed, ref: "user", required: true },
  title: { type: String, required: true },
  content: { type: String, require: true },
  thumbnail: { type: String, require: false },
  desc: { type: String, required: true },
  type: { type: String, required: true },
});

const Posts = model("posts", postSchema);

export default Posts;
