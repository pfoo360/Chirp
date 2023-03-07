import { initTRPC, inferAsyncReturnType } from "@trpc/server";
import createContext from "./context";

const t = initTRPC
  .context<inferAsyncReturnType<typeof createContext>>()
  .create();

export const router = t.router;
export const procedure = t.procedure;
export const middleware = t.middleware;
