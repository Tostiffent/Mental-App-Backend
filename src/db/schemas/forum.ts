import { Schema, model } from "mongoose";

const forumSchema = new Schema({
  post_id: { type: String, required: true },
  author: { type: Schema.Types.Mixed, ref: "user", required: true },
  title: { type: String, required: true },
  content: { type: String, require: true },
  createdAt: { type: Date, require: true, default: new Date() },
  comments: { type: Array, required: true },
});

const Forum = model("forum posts", forumSchema);

export default Forum;
