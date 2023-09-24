import express from "express";
import Quiz from "src/db/schemas/quiz";

const quizRouter = express.Router();

quizRouter.get("/", async (req, res) => {
	const data = await Quiz.find();
	if (data) res.status(200).send(data);
	else res.status(400).send({ data: "not found" });
});

quizRouter.get("/:quiz_slug", async (req, res) => {
	const data = await Quiz.findOne({ quiz_slug: req.params.quiz_slug });
	if (data) res.status(200).send(data);
	else res.status(400).send({ data: "not found" });
});

export default quizRouter;
