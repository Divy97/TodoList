import { z } from "zod";

export const userInput = z.object({
  username: z.string().min(1).max(10),
  password: z.string().min(6).max(20),
});

export type inputParams = z.infer<typeof userInput>;
