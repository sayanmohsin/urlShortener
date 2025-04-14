import { z } from 'zod';

export const envSchema = z.object({
  PORT: z.coerce.number().default(3000),

  // Database
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),

  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
});

export type EnvConfig = Required<z.infer<typeof envSchema>>;

export function validateEnv(config: Record<string, unknown>): EnvConfig {
  const result = envSchema.safeParse(config);
  if (!result.success) {
    throw new Error(`Environment validation failed: ${result.error.message}`);
  }
  return result.data as EnvConfig;
}
