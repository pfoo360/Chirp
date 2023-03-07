import { procedure } from "../../../trpc";
import CHIRPS_PER_PAGE from "../../../../utils/chirpsPerPage";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

const readChirp = procedure
  .input(
    z.object({
      userId: z.string().cuid(),
      cursor: z.string().nullish(), // <-- "cursor" needs to exist, but can be any type
    })
  )
  .query(async ({ ctx: { req, res, prisma }, input: { userId, cursor } }) => {
    try {
      const chirps = await prisma.chirp.findMany({
        where: { userId },
        take: CHIRPS_PER_PAGE + 1, // get an extra item at the end which we'll use as next cursor
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          chirp: true,
          createdAt: true,
          updatedAt: true,
          user: { select: { id: true, username: true, displayName: true } },
        },
      });
      let nextCursor: typeof cursor | undefined = undefined;
      if (chirps.length > CHIRPS_PER_PAGE) {
        const nextChirp = chirps.pop();
        nextCursor = nextChirp!.id;
      }
      return { chirps, nextCursor };
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

export default readChirp;
