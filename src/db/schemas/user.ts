import { Schema, model } from "mongoose";

const user = new Schema({
  _id: String,
  username: { type: String, required: true },
  email: { type: String, required: true },
  user_id: { type: String, required: true, index: true },
  password: { type: String, required: true },
});

const User = model("user", user);

export default User;
