import { z } from "zod";

const ChirpSchema = z
  .string()
  .min(1, { message: "Messages cannot be empty." })
  .max(240, { message: "Messages cannot exceed 240 characters." });

export default ChirpSchema;
