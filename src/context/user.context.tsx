import { inferProcedureOutput } from "@trpc/server";
import { AppRouter } from "@/server/route/app.router";
import { createContext, useContext } from "react";

interface CtxUser {
  id: string;
  email: string;
  name: string;
  iat: string;
  exp: number;
}

const UserContext = createContext<CtxUser | null>(null);

function UserContextProvider({
  children,
  value,
}: {
  children: React.ReactNode;
  value: CtxUser | null;
}) {
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

const useUserContext = () => useContext(UserContext);

export { useUserContext, UserContextProvider };
