import { createPostSchema, singlePostSchema } from "@/schema/post.schema";
import * as trpc from "@trpc/server";
import { router, publicProcedure } from "../trpc";

export const postRouter = router({
  "create-post": publicProcedure
    .input(createPostSchema)
    .mutation(async (opts) => {
      if (!opts.ctx.user) {
        new trpc.TRPCError({
          code: "FORBIDDEN",
          message: "Unauthorized",
        });
      }

      const post = await opts.ctx.prisma.post.create({
        data: {
          ...opts.input,
          user: {
            connect: {
              id: opts.ctx.user?.id,
            },
          },
        },
      });

      return post;
    }),
  posts: publicProcedure.query(async (opts) => {
    return opts.ctx.prisma.post.findMany();
  }),
  "single-post": publicProcedure.input(singlePostSchema).query(async (opts) => {
    return await opts.ctx.prisma.post.findUnique({
      where: {
        id: opts.input.postId,
      },
    });
  }),
});
