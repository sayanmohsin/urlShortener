import { Link as BaseLink } from '@url-shortener/db/generated';

export interface Link extends BaseLink {
  shortUrl: string;
}

export * from './types/api';

export * from './types/auth';

export * from './types/link';
