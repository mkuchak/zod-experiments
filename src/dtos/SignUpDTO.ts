import { z } from "zod";

const signUpDto = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(128),
  name: z.string().min(1).max(128).optional(),
});

export const signUpSchema = z.object({
  body: signUpDto,
});

export type SignUpDTO = z.infer<typeof signUpDto>;
