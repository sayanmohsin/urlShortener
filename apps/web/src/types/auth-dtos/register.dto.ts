import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { LoginSchema } from './login.dto';

export const RegisterSchema = LoginSchema.extend({
  name: z.string().min(1, 'Name is required'),
});

export class RegisterDto extends createZodDto(RegisterSchema) {}

export type RegisterSchema = z.infer<typeof RegisterSchema>;
