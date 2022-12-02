import { Hono } from "hono";
import { UserController } from "../controllers/UserController";
import { signInSchema, signUpSchema } from "../dtos";
import { isAuthenticated } from "../middlewares/isAuthenticated";
import { validateSchema } from "../middlewares/validateSchema";

const userController = new UserController();

export const routes = new Hono();

routes.post("/signup", validateSchema(signUpSchema), userController.signUp);
routes.post("/signin", validateSchema(signInSchema), userController.signIn);
routes.get("/me", isAuthenticated, userController.me);
