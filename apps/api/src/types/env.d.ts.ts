import { User } from '@url-shortener/db/generated';
import type { EnvConfig } from '../config/configuration';

declare global {
  namespace NodeJS {
    interface ProcessEnv extends EnvConfig {}
  }

  namespace Express {
    interface Request {
      user?: Omit<User, 'password'>;
    }
  }
}
