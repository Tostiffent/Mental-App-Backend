import { Schema, model } from "mongoose";

const token = new Schema({
  user_id: { type: String, required: true },
  auth_token: { type: String, required: true },
});

const Token = model("auth_token", token);

export default Token;
