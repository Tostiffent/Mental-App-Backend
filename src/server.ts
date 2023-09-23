import express from "express";
import { createServer } from "http";
import cors from "cors";
import apiRouter from "./api";
import bodyParser from "body-parser";

const PORT = 800;

const app = express();
const httpServer = createServer(app);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://jojochat.vercel.app",
      "https://jojochat-git-dev-jojochat.vercel.app",
      "https://jojochat-git-dev-jojochat.vercel.app/",
    ],
    optionsSuccessStatus: 200,
  })
); //change origin when deployed

// mount api router onto /api
app.use("/api", apiRouter);

export function startServer() {
  httpServer.listen(PORT).on("listening", () => {
    console.log(`🖧  Server is up and ready on port ${PORT}`);
  });
  app.get("/ping", async (req, res) => {
    res.status(200).send("pong");
  });
}

export { httpServer, app };
