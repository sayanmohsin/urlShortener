import { Link as BaseList } from '@url-shortener/db/generated';

export interface List extends BaseList {
  shortUrl: string;
}
