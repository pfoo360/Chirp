import loggedInProcedure from "../../../middleware/isLoggedIn";
import { z } from "zod";
import CHIRP_SESSION from "@/utils/chirpSession";
import { serialize } from "cookie";
import { TRPCError } from "@trpc/server";

const signOut = loggedInProcedure
  .output(z.object({ success: z.boolean() }))
  .mutation(async ({ ctx: { req, res, prisma, session, user }, input }) => {
    try {
      //delete session from db
      await prisma.session.delete({
        where: { session },
      });

      //delete session key from req.cookies obj
      delete req.cookies[CHIRP_SESSION];

      //delete client-side session token
      const cookie = serialize(CHIRP_SESSION, session, {
        expires: new Date(+0), //"The exact moment of midnight at the beginning of 01 January, 1970 UTC is represented by the value +0"
        path: "/",
        httpOnly: true,
        sameSite: true,
        secure: true,
      });
      res.setHeader("Set-Cookie", cookie);

      return { success: true };
    } catch (error) {
      if (error instanceof TRPCError) {
        throw new TRPCError({ code: error.code, message: error.message });
      } else
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "An unexpected error occurred, please try again later.",
        });
    }
  });

export default signOut;
