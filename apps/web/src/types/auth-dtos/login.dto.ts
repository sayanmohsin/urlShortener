import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const LoginSchema = z.object({
  email: z.string().email('Please provide a valid email'),
  password: z.string().min(1, 'Password is required'),
});

export class LoginDto extends createZodDto(LoginSchema) {}

export type LoginSchema = z.infer<typeof LoginSchema>;
