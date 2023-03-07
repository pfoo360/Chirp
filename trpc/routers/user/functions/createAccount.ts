import loggedOutProcedure from "../../../middleware/isLoggedOut";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import bcrypt from "bcrypt";
import Schema from "../../../../schema/";

const createAccount = loggedOutProcedure
  .input(
    z.object({
      username: Schema.UsernameSchema,
      email: Schema.EmailSchema,
      password: Schema.PasswordSchema,
    })
  )
  .output(z.object({ success: z.boolean() }))
  .mutation(
    async ({
      ctx: { req, res, prisma },
      input: { username, email, password },
    }) => {
      try {
        //query db to see if username or email already in use
        const [isUsername, isEmail] = await Promise.allSettled([
          prisma.user.findFirst({ where: { username } }),
          prisma.user.findFirst({ where: { email } }),
        ]);
        if (isUsername.status === "rejected" || isEmail.status === "rejected") {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "An unexpected error occurred, please try again later.",
          });
        }
        if (isUsername.value !== null || isEmail.value !== null)
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Username and/or email already in use.",
          });

        //if neither taken, hash pw and save details to user table
        const hashedPwd = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
          data: { username, email, password: hashedPwd, displayName: username },
        });

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
    }
  );

export default createAccount;
