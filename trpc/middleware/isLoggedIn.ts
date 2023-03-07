import CHIRP_SESSION from "@/utils/chirpSession";
import { middleware, procedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import getServerSessionAndUser from "../../utils/getServerSessionAndUser";

const isLoggedIn = middleware(async ({ ctx, next }) => {
  const sessionAndUser = await getServerSessionAndUser({
    req: ctx.req,
    res: ctx.res,
  });
  if (!sessionAndUser)
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Could not complete request, please sign in first.",
    });

  return next({
    ctx: { ...ctx, session: sessionAndUser.session, user: sessionAndUser.user },
  });
});

const loggedInProcedure = procedure.use(isLoggedIn);

export default loggedInProcedure;
