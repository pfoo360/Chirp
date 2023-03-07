import { TRPCError } from "@trpc/server";
import loggedInProcedure from "../../../middleware/isLoggedIn";
import { z } from "zod";
import Schema from "../../../../schema";

const createChirp = loggedInProcedure
  .input(z.object({ chirp: Schema.ChirpSchema }))
  .mutation(
    async ({ ctx: { req, res, prisma, session, user }, input: { chirp } }) => {
      try {
        return await prisma.chirp.create({
          data: { chirp, userId: user.id },
          select: {
            id: true,
            chirp: true,
            createdAt: true,
            updatedAt: true,
            user: { select: { id: true, username: true, displayName: true } },
          },
        });
      } catch (error) {
        if (error instanceof TRPCError) {
          throw new TRPCError({ code: error.code, message: error.message });
        } else
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "An unexpected error occurred, please try again later.",
          });
      }
    }
  );

export default createChirp;
