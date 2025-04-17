import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Link } from '@url-shortener/shared-types';
import type { EnvConfig } from '../config/configuration';
import { CreateLink } from './defs/create-link.def';
import { UpdateLink } from './defs/update-link.def';
import { LinkRepository } from './link.repository';
import { nanoid } from './utils/nanoid.util';

@Injectable()
export class LinkService {
  constructor(
    private readonly configService: ConfigService<EnvConfig>,
    private readonly linkRepository: LinkRepository
  ) {}

  private generateShortUrl(slug: string): string {
    const baseUrl = this.configService.get('BASE_URL', 'http://localhost:3333');
    return `${baseUrl}/${slug}`;
  }

  async createUserLink(data: CreateLink) {
    const { userId, originalUrl, slug: customSlug } = data;

    const slug = customSlug ?? nanoid(5);

    const link = await this.linkRepository.create({
      userId,
      originalUrl,
      slug,
    });

    return {
      ...link,
      shortUrl: this.generateShortUrl(link.slug),
    };
  }

  async updateUserLink(id: string, data: UpdateLink) {
    const newLink = await this.linkRepository.update(id, data);

    return {
      ...newLink,
      shortUrl: this.generateShortUrl(newLink.slug),
    };
  }

  async getUserLinks(userId: string) {
    const links = await this.linkRepository.find({
      userId,
      isActive: true,
    });

    return links.map((link) => ({
      ...link,
      shortUrl: this.generateShortUrl(link.slug),
    }));
  }

  async isSlugAvailable(slug: string) {
    const link = await this.linkRepository.findUnique({
      slug,
    });

    return !link;
  }

  async getBySlug(slug: string) {
    return this.linkRepository.findOne({
      slug,
      isActive: true,
    });
  }

  async incrementVisits(id: string) {
    return this.linkRepository.update(id, {
      visits: {
        increment: 1,
      },
    });
  }

  async getUserMostVisited(userId: string) {
    const links = await this.linkRepository.find(
      {
        userId,
      },
      {
        visits: 'desc',
      },
      1
    );

    if (links.length > 0 && links[0].visits > 0) {
      const link = links[0];
      return {
        ...link,
        shortUrl: this.generateShortUrl(link.slug),
      } as Link;
    }

    return null;
  }
}
