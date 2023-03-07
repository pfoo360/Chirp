import { CreateNextContextOptions } from "@trpc/server/adapters/next";
import prisma from "../lib/prisma";

const createContext = ({ req, res }: CreateNextContextOptions) => ({
  req,
  res,
  prisma,
});

export default createContext;
