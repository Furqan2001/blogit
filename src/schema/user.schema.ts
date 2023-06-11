import z from "zod";

export const createUserSchema = z.object({
  email: z.string().email(),
  name: z.string(),
});

export type CreateUserInput = z.TypeOf<typeof createUserSchema>;

export const requestOtpSchema = z.object({
  email: z.string().email(),
  redirect: z.string().optional(),
});

export type RequestOtpInput = z.TypeOf<typeof requestOtpSchema>;

export const verifyOtpSchema = z.object({
  hash: z.string(),
});
