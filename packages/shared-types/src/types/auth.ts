import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const LoginSchema = z.object({
  email: z.string().email('Please provide a valid email'),
  password: z.string().min(1, 'Password is required'),
});

export class LoginDto extends createZodDto(LoginSchema) {}

export type LoginSchema = z.infer<typeof LoginSchema>;

export const RegisterSchema = LoginSchema.extend({
  name: z.string().min(1, 'Name is required'),
});

export class RegisterDto extends createZodDto(RegisterSchema) {}

export type RegisterSchema = z.infer<typeof RegisterSchema>;
