import { Schema, model } from "mongoose";

const quizSchema = new Schema({
	quiz_slug: { type: String, required: true },
	title: { type: String, required: true },
	desc: { type: String, require: true },
	questions: [{ type: String }],
	results: [{}],
	img: { type: String, require: false },
});

const Quiz = model("quiz", quizSchema);

export default Quiz;
