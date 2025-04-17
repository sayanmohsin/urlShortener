import { Body, Controller, Post } from '@nestjs/common';
import { SlugAvailabilityDto } from '@url-shortener/shared-types';
import { LinkService } from './link.service';

@Controller('api/slugs')
export class SlugController {
  constructor(private readonly linkService: LinkService) {}

  @Post('/availability')
  async checkSlugAvailability(
    @Body() slugAvailabilityDto: SlugAvailabilityDto
  ) {
    const { slug } = slugAvailabilityDto;
    const isAvailable = await this.linkService.isSlugAvailable(slug);
    return {
      slug,
      available: isAvailable,
    };
  }
}
