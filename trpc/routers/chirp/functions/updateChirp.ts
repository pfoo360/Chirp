import { TRPCError } from "@trpc/server";
import loggedInProcedure from "../../../middleware/isLoggedIn";
import { z } from "zod";
import Schema from "../../../../schema";

const updateChirp = loggedInProcedure
  .input(z.object({ id: z.string().cuid(), updateText: Schema.ChirpSchema }))
  .mutation(
    async ({
      ctx: { req, res, session, user, prisma },
      input: { id, updateText },
    }) => {
      try {
        //see if currently logged in user is allowed to update the text
        const chirpUserId = await prisma.chirp.findUnique({
          where: { id },
          select: { userId: true },
        });
        if (!chirpUserId)
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Could not find Chirp to update.",
          });
        if (chirpUserId.userId !== user.id)
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "You are not allowed to update this Chirp.",
          });

        return await prisma.chirp.update({
          where: { id },
          data: { chirp: updateText, updatedAt: new Date() },
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

export default updateChirp;
