import { z } from 'zod';

export const envSchema = z.object({
  PORT: z.coerce.number().default(3000),
  JWT_SECRET: z.string().min(1, 'JWT_SECRET must be provided'),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  BASE_URL: z.string().url(),
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
