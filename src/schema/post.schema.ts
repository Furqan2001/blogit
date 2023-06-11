import z from "zod";

export const createPostSchema = z.object({
  title: z.string().max(256, "Title cannot be greater than 256 characters"),
  body: z.string().min(10),
});

export type CreatePostInput = z.TypeOf<typeof createPostSchema>;

export const singlePostSchema = z.object({
  postId: z.string().uuid(),
});
