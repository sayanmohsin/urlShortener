import { User } from '@url-shortener/db/generated';

export interface AuthResponse extends User {
  accessToken: string;
}

export interface SlugAvailabilityResponse {
  slug: string;
  available: boolean;
}
