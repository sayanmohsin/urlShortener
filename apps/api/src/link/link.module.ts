import { Module } from '@nestjs/common';
import { LinkController } from './link.controller';
import { LinkRepository } from './link.repository';
import { LinkService } from './link.service';
import { SlugController } from './slug.controller';

@Module({
  controllers: [LinkController, SlugController],
  providers: [LinkService, LinkRepository],
  exports: [LinkService],
})
export class LinkModule {}
