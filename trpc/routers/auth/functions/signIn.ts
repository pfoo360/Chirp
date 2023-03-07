import bcrypt from "bcrypt";
import { TRPCError } from "@trpc/server";
import loggedOutProcedure from "../../../middleware/isLoggedOut";
import { z } from "zod";
import { serialize } from "cookie";
import Schema from "../../../../schema/";
import { randomUUID } from "crypto";

const signIn = loggedOutProcedure
  .input(
    z.object({
      username: Schema.UsernameSchema,
      password: Schema.PasswordSchema,
    })
  )
  .output(z.object({ success: z.boolean(), username: z.string() }))
  .mutation(
    async ({ ctx: { req, res, prisma }, input: { username, password } }) => {
      try {
        //find user and see if pw is correct
        const user = await prisma.user.findUnique({ where: { username } });
        if (!user)
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "User not found.",
          });
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch)
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Incorrect password. Please try again.",
          });

        //user found and pw correct, save session to db and pass it to client
        const session = randomUUID();
        const MAX_AGE = 60 * 60 * 24 * 52; //52wks
        const expires = new Date();
        expires.setSeconds(expires.getSeconds() + MAX_AGE);
        await prisma.session.create({
          data: { session, expires, userId: user.id },
        });
        const cookie = serialize("CHIRP_SESSION", session, {
          expires,
          path: "/",
          httpOnly: true,
          sameSite: true,
          secure: true,
        });
        res.setHeader("Set-Cookie", cookie);
        return { success: true, username: user.username };
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

export default signIn;
