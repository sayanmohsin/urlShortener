import type { Link as BaseList } from '@url-shortener/db/generated';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export interface List extends BaseList {
  shortUrl: string;
}

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

export const UpdateLinkSchema = z.object({
  slug: z
    .string()
    .min(5)
    .max(50)
    .regex(/^[a-zA-Z0-9_-]+$/),
});

export class UpdateLinkDto extends createZodDto(UpdateLinkSchema) {}

export type UpdateLinkSchema = z.infer<typeof UpdateLinkSchema>;

export const SlugAvailabilitySchema = UpdateLinkSchema.extend({});

export class SlugAvailabilityDto extends createZodDto(SlugAvailabilitySchema) {}

export type SlugAvailabilitySchema = z.infer<typeof SlugAvailabilitySchema>;
