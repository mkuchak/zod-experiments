import { Context, Next } from "hono";
import { AnyZodObject } from "zod";

interface ZodError {
  errors?: ErrorsEntity[];
}

interface ErrorsEntity {
  validation?: string;
  code: string;
  message: string;
  path?: string[];
  minimum?: number;
  type?: string;
  inclusive?: boolean;
}

function getErrorMessages(error: ZodError) {
  return error.errors.map((err: ErrorsEntity) => {
    return `${err.path.join(".")}: ${err.message}`;
  });
}

export const validateSchema =
  (schema: AnyZodObject) => async (c: Context, next: Next) => {
    try {
      await schema.parseAsync({
        body: await c.req.json(),
        query: c.req.query(),
        params: c.req.param(),
        cookies: c.req.cookie(),
        headers: c.req.header(),
      });

      return await next();
    } catch (error) {
      c.status(400);

      return c.json({
        statusCode: 400,
        message: getErrorMessages(error),
        error: "Bad Request",
      });
    }
  };
