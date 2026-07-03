import z from 'zod';

export const ShapeSchema = z.union([
  z.literal('rectangle'),
  z.literal('circle'),
  z.literal('capsule'),
]);

export const GradientDirectionSchema = z.union([
  z.literal('horizontal'),
  z.literal('vertical'),
  z.literal('diagonal'),
  z.literal('radial'),
]);

export const InteractionTypeSchema = z.union([z.literal('tap'), z.literal('swipe')]);

export const AnimationKindSchema = z.union([
  z.literal('pulse'),
  z.literal('neon'),
  z.literal('glitch'),
  z.literal('outline'),
]);

export const ParticleTypeSchema = z.union([
  z.literal('spark'),
  z.literal('confetti'),
  z.literal('heart'),
  z.literal('pixel'),
  z.literal('smoke'),
]);

export const InlineButtonAnimationSchema = z.object({
  kind: AnimationKindSchema,
  speedMs: z.number().min(0).optional(),
  colorHex: z.string().optional(),
  blur: z.number().min(0).optional(),
  intensityPx: z.number().min(1).max(5).optional(),
  frequencyMs: z.number().min(0).optional(),
  thicknessPx: z.number().min(0).optional(),
  cornerRadius: z.number().min(0).optional(),
});

export const InlineButtonSchema = z.object({
  id: z.string().min(1).max(64),
  label: z.string().min(0).max(64),
  shape: ShapeSchema.default('rectangle').optional(),
  cornerRadius: z.number().min(0).max(64).optional(),
  color: z.object({
    hex: z.string(),
    textHex: z.string(),
    gradient: z
      .object({
        startHex: z.string(),
        endHex: z.string(),
        direction: GradientDirectionSchema,
      })
      .optional(),
  }),
  interaction: z
    .object({
      type: InteractionTypeSchema.default('tap'),
      swipe: z
        .object({
          text: z.string(),
          fillHex: z.string(),
        })
        .optional(),
    })
    .optional(),
  animations: z.array(InlineButtonAnimationSchema).optional(),
  particles: z
    .object({
      type: ParticleTypeSchema,
      colorHex: z.string(),
      intensity: z.number().min(1).max(5).optional(),
    })
    .optional(),
});

export type InlineButton = z.infer<typeof InlineButtonSchema>;
export type Shape = z.infer<typeof ShapeSchema>;
export type GradientDirection = z.infer<typeof GradientDirectionSchema>;
export type InteractionType = z.infer<typeof InteractionTypeSchema>;
export type AnimationKind = z.infer<typeof AnimationKindSchema>;
export type ParticleType = z.infer<typeof ParticleTypeSchema>;
