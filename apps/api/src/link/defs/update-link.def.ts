import { CreateLink } from './create-link.def';

export type UpdateLink = Partial<Omit<CreateLink, 'userId'>> & {
  slug?: string;
};
