import z from "zod";

const UsernameSchema = z
  .string()
  .min(5, { message: "Must be five(5) or more characters long." })
  .max(15, { message: "Must be at most fifteen(15) characters long." })
  .regex(new RegExp("^[a-zA-Z0-9_-]+$"), {
    message: "Cannot contain special characters.",
  });

export default UsernameSchema;
