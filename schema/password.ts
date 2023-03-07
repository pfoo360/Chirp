import { z } from "zod";

const PasswordSchema = z
  .string()
  .min(6, { message: "Must be six(6) or more characters long." })
  .max(20, { message: "Must be at most twenty(20) characters long." });

export default PasswordSchema;
