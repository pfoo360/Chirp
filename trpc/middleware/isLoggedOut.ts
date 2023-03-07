import { TRPCError } from "@trpc/server";
import { middleware, procedure } from "../trpc";
import CHIRP_SESSION from "@/utils/chirpSession";

const isLoggedOut = middleware(({ ctx, next }) => {
  if (ctx.req.cookies[CHIRP_SESSION])
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Could not complete request, please sign out first.",
    });

  return next();
});

const loggedOutProcedure = procedure.use(isLoggedOut);

export default loggedOutProcedure;
