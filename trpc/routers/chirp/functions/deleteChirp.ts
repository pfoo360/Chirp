import { TRPCError } from "@trpc/server";
import loggedInProcedure from "../../../middleware/isLoggedIn";
import { z } from "zod";
import Schema from "../../../../schema";

const deleteChirp = loggedInProcedure
  .input(z.object({ id: z.string().cuid() }))
  .mutation(
    async ({ ctx: { req, res, prisma, user, session }, input: { id } }) => {
      try {
        const chirpUserId = await prisma.chirp.findUnique({
          where: { id },
          select: { userId: true },
        });
        if (!chirpUserId)
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Could not find Chirp to delete.",
          });
        if (chirpUserId.userId !== user.id)
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "You are not allowed to delete this Chirp.",
          });

        return await prisma.chirp.delete({
          where: { id },
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

export default deleteChirp;
