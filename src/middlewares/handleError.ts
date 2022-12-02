import { Context } from "hono";
import { StatusCode } from "hono/utils/http-status";
import { getReasonPhrase } from "http-status-codes";
import { HttpError } from "../utils/HttpError";

export const handleError = (e: Error, c: Context) => {
  if (e instanceof HttpError) {
    c.status(e.status as StatusCode);
    return c.json({
      statusCode: e.status,
      message: e.message,
      error: getReasonPhrase(e.status),
    });
  }

  c.status(500);
  return c.json({ error: "Internal Server Error" });
};
