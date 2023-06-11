import { AppRouter } from "@/server/route/app.router";
import { createTRPCReact } from "@trpc/react-query";

export const trpc = createTRPCReact<AppRouter>();
