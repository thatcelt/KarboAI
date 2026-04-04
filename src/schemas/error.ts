import { z } from 'zod';

export const ErrorDataSchema = z.object({
  name: z.string().optional(),
  message: z.string(),
});

export type ErrorData = z.infer<typeof ErrorDataSchema>;
