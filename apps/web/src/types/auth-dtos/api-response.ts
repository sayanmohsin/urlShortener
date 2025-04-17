import { User } from '@url-shortener/db/generated';

export interface AuthResponse extends User {
  accessToken: string;
}
