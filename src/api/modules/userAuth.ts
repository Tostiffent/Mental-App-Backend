import jwt from "jsonwebtoken";
import Token from "../../db/schemas/auth_token";
import User from "../../db/schemas/user";
import generateUniqueId from "generate-unique-id";
import bcrypt from "bcrypt";

const privateKey = process.env.private_key;

export async function verify_auth(auth_token: string) {
  const user = await Token.findOne({ auth_token });
  if (!user) return user;
  return new Promise<{
    username: string;
    user_id: string;
    email: string;
    discriminator: string;
  }>((resolve) => {
    //@ts-ignore
    jwt.verify(
      auth_token,
      privateKey ?? "app",
      async (
        err,
        user: {
          username: string;
          user_id: string;
          email: string;
          discriminator: string;
          avatar_url: string;
        }
      ) => {
        if (err) {
          return resolve(user); //unable to verify auth token
        } else {
          return resolve(user); //sending user data and their auth token
        }
      }
    );
  });
}

async function gen_auth(user_id: string, username: string, email: string) {
  //generate an auth code using jwt, expires in 7 days and secured with private key
  const auth_token = jwt.sign(
    { username, user_id, email },
    privateKey ?? "app",
    { expiresIn: "7d" }
  );
  await Token.findOneAndUpdate(
    { user_id },
    { user_id, auth_token },
    { new: true, upsert: true }
  );
  return auth_token;
}

export async function verify_identity(auth_token: string) {
  const user = await verify_auth(auth_token);
  if (!user)
    return {
      status: 401,
      data: "Unauthorised: user auth could not be verified",
    }; //unauthorised
  const userData = await User.findOne({ user_id: user.user_id });

  if (!userData)
    return {
      status: 401,
      data: "Unauthorised: user auth could not be verified",
    }; //unauthorised

  return {
    status: 200,
    data: {
      auth_token,
      username: userData.username,
      user_id: userData.user_id,
      email: userData.email,
    },
  };
}

function generateDiscriminator(username: string) {
  let discriminator =
    "#" + generateUniqueId({ length: 5, useLetters: false }).toString();
  const data = User.findOne({ username, discriminator });
  if (!data) return discriminator;
  else {
    discriminator =
      "#" + generateUniqueId({ length: 5, useLetters: false }).toString();
    return discriminator;
  }
}

export async function register(
  username: string,
  email: string,
  password: string
) {
  const data = await User.findOne({ email }); //finding email in database
  if (data)
    return { status: 403, data: "Forbidden: Email ID already registered" };
  else {
    const discriminator = await generateDiscriminator(username);
    const user_id = generateUniqueId({ length: 16, useLetters: false }); //generating unique ID for new user
    bcrypt.hash(
      password,
      5,
      async function (err: Error | undefined, hash: string) {
        //generating a hashed password
        await new User({
          _id: user_id,
          username,
          email,
          user_id,
          password: hash,
        }).save();
      }
    );
    const auth_token = await gen_auth(user_id, username, email);
    return {
      status: 200,
      data: {
        auth_token,
        username,
        email,
        user_id,
      },
    }; //send some data from here depends on what the frontend needs
  }
}

export async function login(email: string, password: string, res: any) {
  const data = await User.findOne({ email }); //finding email in database since no auth header
  if (!data) return { status: 404, data: "Not Found: User not found" };
  await bcrypt.compare(password, data.password, async function (err, result) {
    if (!result) {
      //if database password and entered password don't match
      res.status(401).send("Unauthorised: Email or pass incorrect");
    } else {
      //generatin authorization header to upload in database
      const auth_token = await gen_auth(data.user_id, data.username, email);
      res.status(200).send({
        auth_token,
        username: data.username,
        email,
        user_id: data.user_id,
      });
    }
  });
}

export async function user_info(auth_token: string, user_id: string) {
  const user = await verify_auth(auth_token);
  if (!user)
    return {
      status: 401,
      data: "Unauthorised: The auth token provided is incorrect",
    };
  let data = await User.findOne({ user_id });
  if (!data)
    return {
      status: 401,
      data: "Unauthorised: The auth token provided is incorrect",
    };
  const { username } = data;
  return {
    status: 200,
    data: {
      user_id,
      username,
    },
  };
}

export async function signout(auth_token: string) {
  const data = await Token.findOneAndDelete({ auth_token });
  if (data) return { status: 200, data: "Signed out" };
  else return { status: 400, data: "Bad Request: Token does not exist" };
}
