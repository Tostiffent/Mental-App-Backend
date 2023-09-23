import express from "express";
import postRouter from "./routes/posts";
import { userAuth } from "./routes/userAuth";
import forumRouter from "./routes/forum";

const apiRouter = express.Router();

apiRouter.use("/posts", postRouter);
apiRouter.use("/forum", forumRouter);
userAuth(apiRouter);

export default apiRouter;
