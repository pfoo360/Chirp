import z from "zod";

const DisplayNameSchema = z
  .string()
  .min(1, { message: "Must be one(1) or more characters long." })
  .max(20, { message: "Must be no more than twenty(20) characters long." });

export default DisplayNameSchema;
