import express from "express";
import postRouter from "./routes/posts";
import { userAuth } from "./routes/userAuth";
import forumRouter from "./routes/forum";
import quizRouter from "./routes/quizzes";

const apiRouter = express.Router();

apiRouter.use("/posts", postRouter);
apiRouter.use("/forum", forumRouter);
apiRouter.use("/quizzes", quizRouter)

userAuth(apiRouter);

export default apiRouter;
