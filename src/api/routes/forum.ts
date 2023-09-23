import express from "express";
import Forum from "../../db/schemas/forum";
import Comments from "../../db/schemas/comments";

const forumRouter = express.Router();

forumRouter.get("/", async (req, res) => {
  // get dm info
  const data = await Forum.find({}).populate("author", ["username"]);
  if (data[0]) res.status(201).send(data);
  else res.status(400).send({ data: "not found" });
});

forumRouter.get("/:id", async (req, res) => {
  console.log(req.params.id);
  // get dm info
  const post = await Forum.findOne({ post_id: req.params.id }).populate(
    "author",
    ["username"]
  );
  const messages = await Comments.find({ post_id: req.params.id })
    .populate("author", ["user_id", "username"])
    .populate({
      path: "reply",
      populate: {
        path: "author",
        select: ["user_id"],
      },
      select: ["author", "content"],
    });
  const comments = messages.filter((message) => !message?.parent);
  console.log("post", post);
  console.log("comments", comments);
  comments.forEach((comment, index) => {
    messages.forEach((message) => {
      comments[index].reply = comments[index]?.reply ?? [];
      message.parent == comment.message_id
        ? comments[index].reply.push(message)
        : null;
    });
  });

  post.comments = comments;

  console.log("post", post);

  res.status(200).send({ post });
});

forumRouter.post("/create", async (req, res) => {
  // get dm info
  //const data = await Posts.findOne({ post_id: req.params.id });
  //if (data) res.status(201).send(data);
  //else res.status(400).send({ data: "not found" });
});

export default forumRouter;
