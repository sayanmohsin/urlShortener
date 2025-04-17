import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const CreateLinkSchema = z.object({
  originalUrl: z.string().url('Please provide a valid url'),
  slug: z
    .string()
    .min(5)
    .max(50)
    .regex(/^[a-zA-Z0-9_-]+$/)
    .optional(),
});

export class CreateLinkDto extends createZodDto(CreateLinkSchema) {}

export type CreateLinkSchema = z.infer<typeof CreateLinkSchema>;
