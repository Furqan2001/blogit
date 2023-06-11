import { router, publicProcedure } from "../trpc";
import * as trpc from "@trpc/server";
import {
  createUserSchema,
  requestOtpSchema,
  verifyOtpSchema,
} from "@/schema/user.schema";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { sendLoginEmail } from "@/utils/mailer";
import { baseUrl } from "@/pages/constants";
import { decode, encode } from "@/utils/base64";
import { signJwt } from "@/utils/jwt";
import { serialize } from "cookie";

export const userRouter = router({
  "register-user": publicProcedure
    .input(createUserSchema)
    .mutation(async (opts) => {
      const { name, email } = opts.input;

      try {
        const user = opts.ctx.prisma.user.create({
          data: {
            name,
            email,
          },
        });

        return user;
      } catch (e) {
        if (e instanceof PrismaClientKnownRequestError) {
          if (e.code === "P2002") {
            throw new trpc.TRPCError({
              code: "CONFLICT",
              message: "User already exists!",
            });
          }
        } else {
          throw new trpc.TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Something went wrong",
          });
        }
      }
    }),
  "request-otp": publicProcedure
    .input(requestOtpSchema)
    .mutation(async (opts) => {
      const { email, redirect } = opts.input;

      const user = await opts.ctx.prisma.user.findUnique({
        where: {
          email,
        },
      });

      if (!user) {
        throw new trpc.TRPCError({
          code: "NOT_FOUND",
          message: "User Not Found",
        });
      }

      const token = await opts.ctx.prisma.loginToken.create({
        data: {
          redirect,
          user: {
            connect: {
              id: user.id,
            },
          },
        },
      });

      //send email
      await sendLoginEmail({
        email: user.email,
        url: baseUrl,
        token: encode(`${token.id}:${user.email}`),
      });

      return true;
    }),
  "verify-otp": publicProcedure.input(verifyOtpSchema).query(async (opts) => {
    const decoded = decode(opts.input.hash).split(":");

    const [id, email] = decoded;

    const token = await opts.ctx.prisma.loginToken.findFirst({
      where: {
        id,
        user: {
          email,
        },
      },
      include: {
        user: true,
      },
    });

    if (!token) {
      throw new trpc.TRPCError({
        code: "FORBIDDEN",
        message: "Invalid Token",
      });
    }

    const jwt = signJwt({
      id: token?.user.id,
      email: token?.user.email,
    });

    opts.ctx.res.setHeader(
      "Set-Cookie",
      serialize("token", jwt, { path: "/" })
    );

    return {
      redirect: token.redirect,
    };
  }),
  me: publicProcedure.query((opts) => {
    return opts.ctx.user;
  }),
});
