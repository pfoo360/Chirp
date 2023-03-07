import loggedInProcedure from "@/trpc/middleware/isLoggedIn";
import { z } from "zod";
import Schema from "@/schema/";
import { TRPCError } from "@trpc/server";

const updateUsersDescription = loggedInProcedure
  .input(
    z.object({
      userId: z.string().cuid(),
      newDescription: Schema.DescriptionSchema,
    })
  )
  .mutation(
    async ({
      ctx: { req, res, prisma, user, session },
      input: { userId, newDescription },
    }) => {
      try {
        if (userId !== user.id)
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "You can only update your own description.",
          });
        return await prisma.user.update({
          where: { id: userId },
          data: { description: newDescription },
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

export default updateUsersDescription;
