import { z } from "zod";

const DescriptionSchema = z
  .string()
  .max(240, { message: "Messages cannot exceed 240 characters." });

export default DescriptionSchema;
