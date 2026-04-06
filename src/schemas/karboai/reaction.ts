import { z } from 'zod';

export const ReactionSchema = z
  .object({
    reaction: z.string(),
    is_sticker: z.boolean(),
    count: z.number(),
    me: z.boolean(),
  })
  .transform((data) => {
    return {
      reaction: data.reaction,
      isSticker: data.is_sticker,
      count: data.count,
      me: data.me,
    };
  });

export type Reaction = z.infer<typeof ReactionSchema>;
