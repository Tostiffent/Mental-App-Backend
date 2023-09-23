import express from "express";
import postRouter from "./routes/posts";
import { userAuth } from "./routes/userAuth";

const apiRouter = express.Router();

apiRouter.use("/posts", postRouter);
userAuth(apiRouter);

export default apiRouter;
