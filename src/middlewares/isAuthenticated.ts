import jwt from "@tsndr/cloudflare-worker-jwt";
import { Context, Next } from "hono";
import { HttpError } from "../utils/HttpError";

export const isAuthenticated = async (c: Context, next: Next) => {
  const accessToken = c.req.headers.get("Authorization")?.split(" ")[1];

  const isValid = await jwt.verify(accessToken, c.env.JWT_SECRET);

  if (!isValid) {
    throw new HttpError("Invalid access token", 401);
  }

  const { payload } = jwt.decode(accessToken);

  c.req.user = payload;

  await next();
};
