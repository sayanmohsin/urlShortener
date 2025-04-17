import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Redirect,
  Res,
} from '@nestjs/common';
import { LinkService } from './link/link.service';

@Controller('/')
export class RedirectController {
  constructor(private readonly linkService: LinkService) {}

  @Get(':slug')
  @Redirect()
  async redirect(@Param('slug') slug: string, @Res() response: Response) {
    try {
      const link = await this.linkService.getBySlug(slug);

      let url = link.originalUrl;
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = `https://${url}`;
      }
      await this.linkService.incrementVisits(link.id);

      return { url };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new NotFoundException('Link not found');
    }
  }
}
