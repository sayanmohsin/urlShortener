import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const UpdateLinkSchema = z.object({
  slug: z
    .string()
    .min(5)
    .max(50)
    .regex(/^[a-zA-Z0-9_-]+$/),
});

export class UpdateLinkDto extends createZodDto(UpdateLinkSchema) {}

export type UpdateLinkSchema = z.infer<typeof UpdateLinkSchema>;
