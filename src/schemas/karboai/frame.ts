import z from 'zod';

export const FrameSchema = z
  .object({
    frame_id: z.string(),
    file: z.string(),
  })
  .transform((frame) => {
    return {
      frameId: frame.frame_id,
      file: frame.file,
    };
  });

export type Frame = z.infer<typeof FrameSchema>;
