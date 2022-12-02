import { Hono } from "hono";
import { cors } from "hono/cors";
import { handleError } from "./middlewares/handleError";
import { routes } from "./routes";

const app = new Hono();

app.use(
  "*",
  cors({
    origin: "*",
    allowHeaders: ["X-Custom-Header", "Upgrade-Insecure-Requests"],
    allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Type", "Authorization", "Content-Length"],
  })
);

app.onError(handleError);

app.route("/api/v1", routes);

export default app;
