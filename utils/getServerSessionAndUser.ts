import { serialize } from "cookie";
import { IncomingMessage, ServerResponse } from "http";
import CHIRP_SESSION from "./chirpSession";
import prisma from "../lib/prisma";
import { User } from "../types/";

interface GetServerSessionAndUserArgs {
  req: IncomingMessage & {
    cookies: Partial<{
      [key: string]: string;
    }>;
  };
  res: ServerResponse<IncomingMessage>;
}

const getServerSessionAndUser = async ({
  req,
  res,
}: GetServerSessionAndUserArgs): Promise<{
  session: string;
  user: User;
} | null> => {
  try {
    if (!req.cookies) return null;
    if (!req.cookies[CHIRP_SESSION]) return null;

    const sessionAndUser = await prisma.session.findUnique({
      where: { session: req.cookies[CHIRP_SESSION] },
      select: {
        session: true,
        expires: true,
        user: { select: { id: true, username: true, email: true } },
      },
    });
    if (!sessionAndUser) {
      const cookie = serialize(CHIRP_SESSION, req.cookies[CHIRP_SESSION], {
        expires: new Date(+0), //"The exact moment of midnight at the beginning of 01 January, 1970 UTC is represented by the value +0"
        path: "/",
        httpOnly: true,
        sameSite: true,
        secure: true,
      });
      res.setHeader("Set-Cookie", cookie);
      delete req.cookies[CHIRP_SESSION];
      return null;
    }

    if (sessionAndUser.expires <= new Date()) {
      await prisma.session.delete({
        where: { session: sessionAndUser.session },
      });

      delete req.cookies[CHIRP_SESSION];

      const cookie = serialize(CHIRP_SESSION, sessionAndUser.session, {
        expires: new Date(+0), //"The exact moment of midnight at the beginning of 01 January, 1970 UTC is represented by the value +0"
        path: "/",
        httpOnly: true,
        sameSite: true,
        secure: true,
      });
      res.setHeader("Set-Cookie", cookie);

      return null;
    }

    return { session: sessionAndUser.session, user: sessionAndUser.user };
  } catch (error) {
    return null;
  }
};

export default getServerSessionAndUser;
