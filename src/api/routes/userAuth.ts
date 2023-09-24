import {
  register,
  login,
  verify_identity,
  user_info,
  signout,
} from "../modules/userAuth";
import User from "../../db/schemas/user";
import { Router } from "express";
import Forum from "../../db/schemas/forum";

export function userAuth(apiRouter: Router) {
  apiRouter.post("/register", async (req, res) => {
    //route for /register redirect
    console.log(req.body);
    const data = await register(
      req.body.username,
      req.body.email,
      req.body.password
    );
    res.status(data.status).send(data.data);
  });

  apiRouter.post("/login", async (req, res) => {
    //route for /login redirect
    console.log(req.body);
    await login(req.body.email, req.body.password, res);
  });

  apiRouter.get("/identity", async (req, res) => {
    //route for checking authorization
    if (!req.headers.authorization) return res.status(400).send("NO AUTH");
    const data = await verify_identity(req.headers.authorization);
    res.status(data.status).send(data.data);
  });

  apiRouter.get("/users/:user_id", async (req, res) => {
    //get information of a user
    if (!req.headers.authorization) return res.status(400).send("NO AUTH");
    const data = await user_info(req.headers.authorization, req.params.user_id);
    res.status(data.status).send(data.data);
  });

  apiRouter.delete("/signout", async (req, res) => {
    if (!req.headers.authorization) return res.status(400).send("NO AUTH");
    const data = await signout(req.headers.authorization);
    res.status(data.status).send(data.data);
  });

  apiRouter.get("/users", async (req, res) => {
    const users = await User.find({}).select(["username", "user_id"]);
    const posts = await Forum.find({});
    res.status(200).send({ users, posts });
  });

  apiRouter.post("/:user_id/settings/username", async (req, res) => {
    await User.findOneAndUpdate(
      { user_id: req.params.user_id },
      { username: req.body.username }
    );
    res.status(200).send("updated");
  });
}
