import { z } from "zod";
import { router, procedure } from "../trpc";
import userRouter from "./user";
import authRouter from "./auth";
import chirpRouter from "./chirp";

export const appRouter = router({
  user: userRouter,
  auth: authRouter,
  chirp: chirpRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
