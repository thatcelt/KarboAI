import z from 'zod';

export const ReactionSchema = z.object({
  reaction: z.string(),
  isSticker: z.boolean(),
  count: z.number(),
  me: z.boolean(),
});

export type Reaction = z.infer<typeof ReactionSchema>;
