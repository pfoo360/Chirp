import type { AppRouter } from "@/trpc/routers/_app";
import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";

export type RouterOutputs = inferRouterOutputs<AppRouter>;
export type RouterInputs = inferRouterInputs<AppRouter>;

export interface User {
  id: string;
  username: string;
  email: string;
}
