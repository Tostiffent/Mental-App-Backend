import express from "express";
import Posts from "../../db/schemas/posts";

const postRouter = express.Router();

postRouter.get("/:topic", async (req, res) => {
  // get dm info
  const data = await Posts.find({ type: req.params.topic });
  if (data[0]) res.status(201).send(data);
  else res.status(400).send({ data: "not found" });
});

postRouter.get("/post/:id", async (req, res) => {
  // get dm info
  const data = await Posts.findOne({ post_id: req.params.id });
  if (data) res.status(201).send(data);
  else res.status(400).send({ data: "not found" });
});

export default postRouter;
