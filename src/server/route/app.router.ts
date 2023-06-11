import { mergeRouters } from "../trpc";
import { postRouter } from "./post.router";
import { userRouter } from "./user.router";

export const appRouter = mergeRouters(userRouter, postRouter);

export type AppRouter = typeof appRouter;
