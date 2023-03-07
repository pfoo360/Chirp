import z from "zod";

const EmailSchema = z
  .string()
  .email({ message: "Please enter a valid email." });

export default EmailSchema;
