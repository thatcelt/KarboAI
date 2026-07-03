import z from 'zod';

export const FrameSchema = z.object({
  frameId: z.string().optional(),
  file: z.string().optional(),
});

export type Frame = z.infer<typeof FrameSchema>;
