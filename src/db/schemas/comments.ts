import { Schema, model } from "mongoose";

const commentSchema = new Schema({
  _id: String,
  message_id: { type: String, required: true },
  post_id: { type: String, required: true },
  author: { type: Schema.Types.Mixed, ref: "user", required: true },
  content: { type: String, require: true },
  createdAt: { type: Date, require: true, default: new Date() },
  reply: { type: Schema.Types.Mixed, ref: "comments" },
  parent: { type: Schema.Types.Mixed, ref: "comments" },
});

const Comments = model("comments", commentSchema);

export default Comments;
