import { procedure } from "../../../trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

const readUsersBio = procedure
  .input(z.object({ userId: z.string().cuid() }))
  .query(async ({ ctx: { prisma, req, res }, input: { userId } }) => {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          username: true,
          displayName: true,
          description: true,
          createdAt: true,
        },
      });
      if (!user)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User does not exist.",
        });
      return user;
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

export default readUsersBio;
