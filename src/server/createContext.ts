import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/utils/prisma";
import { verifyJwt } from "@/utils/jwt";

interface CtxUser {
  id: string;
  email: string;
  name: string;
  iat: string;
  exp: number;
}

function getUserFromToken(req: NextApiRequest) {
  const token = req.cookies.token;

  if (token) {
    try {
      const user = verifyJwt<CtxUser>(token);
      return user;
    } catch (error) {
      return null;
    }
  }
}

export function createContext({
  req,
  res,
}: {
  req: NextApiRequest;
  res: NextApiResponse;
}) {
  const user = getUserFromToken(req);

  return { req, res, prisma, user };
}

export type Context = ReturnType<typeof createContext>;
