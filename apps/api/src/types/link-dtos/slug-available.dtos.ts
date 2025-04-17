import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { UpdateLinkSchema } from './update-link.dtos';

export const SlugAvailabilitySchema = UpdateLinkSchema.extend({});

export class SlugAvailabilityDto extends createZodDto(SlugAvailabilitySchema) {}

export type SlugAvailabilitySchema = z.infer<typeof SlugAvailabilitySchema>;
