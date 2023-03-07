import loggedInProcedure from "@/trpc/middleware/isLoggedIn";
import Schema from "@/schema/";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

const updateUsersDisplayName = loggedInProcedure
  .input(
    z.object({
      updatedDisplayName: Schema.DisplayNameSchema,
      userId: z.string().cuid(),
    })
  )
  .mutation(
    async ({
      ctx: { req, res, prisma, session, user },
      input: { updatedDisplayName, userId },
    }) => {
      try {
        if (user.id !== userId)
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "You can only update your own display name.",
          });
        return await prisma.user.update({
          where: { id: userId },
          data: { displayName: updatedDisplayName },
          select: {
            id: true,
            username: true,
            displayName: true,
            description: true,
            createdAt: true,
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

export default updateUsersDisplayName;
