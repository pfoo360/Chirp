import * as trpcNext from "@trpc/server/adapters/next";
import { appRouter } from "../../../trpc/routers/_app";
import createContext from "../../../trpc/context";

export default trpcNext.createNextApiHandler({
  router: appRouter,
  createContext,
});
