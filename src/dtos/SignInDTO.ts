import { z } from "zod";

const signInDto = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(128),
});

export const signInSchema = z.object({
  body: signInDto,
});

export type SignInDTO = z.infer<typeof signInDto>;
