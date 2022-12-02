import { Context } from "hono";
import { nanoid } from "nanoid";
import bcryptjs from "bcryptjs";
import jwt from "@tsndr/cloudflare-worker-jwt";
import { SignInDTO, SignUpDTO } from "../dtos";
import { HttpError } from "../utils/HttpError";
import { StatusCodes } from "http-status-codes";

export class UserController {
  async signUp(c: Context) {
    const { email, password, name } = await c.req.json<SignUpDTO>();

    const isEmailAlreadyRegistered = await c.env.DB.prepare(
      "select * from User where email = ?"
    )
      .bind(email)
      .first();

    if (isEmailAlreadyRegistered) {
      throw new HttpError("User already exists", StatusCodes.CONFLICT);
    }

    const id = nanoid();
    const hashedPassword = await bcryptjs.hash(password, 8);

    await c.env.DB.prepare(
      "insert into User (id, email, password, name) values (?, ?, ?, ?)"
    )
      .bind(id, email, hashedPassword, name)
      .run();

    return c.json({ id, email });
  }

  async signIn(c: Context) {
    const { email, password } = await c.req.json<SignInDTO>();

    const user = await c.env.DB.prepare("select * from User where email = ?")
      .bind(email)
      .first();

    const isValidPassword = await bcryptjs.compare(
      password,
      user?.password || ""
    );

    if (!user || !isValidPassword) {
      throw new HttpError("Invalid credentials", StatusCodes.UNAUTHORIZED);
    }

    const accessToken = await jwt.sign(
      {
        id: user.id,
        email: user.email,
        exp:
          Math.floor(Date.now() / 1000) +
          60 * 60 * 24 * Number(c.env.JWT_EXPIRES_IN), // days
      },
      c.env.JWT_SECRET
    );

    return c.json({ accessToken });
  }

  async me(c: Context) {
    const { id } = c.req.user;

    const user = await c.env.DB.prepare("select * from User where id = ?")
      .bind(id)
      .first();

    if (!user) {
      throw new HttpError("User not found", StatusCodes.NOT_FOUND);
    }

    delete user.password;

    return c.json(user);
  }
}
