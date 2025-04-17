import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import type { User } from '@url-shortener/db/generated';
import type {
  CreateLinkDto,
  Link,
  UpdateLinkDto,
} from '@url-shortener/shared-types';
import { AuthGuard } from '../auth/auth.guard';
import { GetCurrentUser } from '../auth/decorators/get-current-user.decorator';
import { LinkService } from './link.service';

@Controller('api/links')
export class LinkController {
  constructor(private readonly linkService: LinkService) {}

  @UseGuards(AuthGuard)
  @Post('/')
  createUserLink(
    @GetCurrentUser() user: User,
    @Body() createLinkDto: CreateLinkDto
  ): Promise<Link> {
    return this.linkService.createUserLink({
      ...createLinkDto,
      userId: user.id,
    });
  }

  @UseGuards(AuthGuard)
  @Get('/')
  getUserLink(@GetCurrentUser() user: User) {
    return this.linkService.getUserLinks(user.id);
  }

  @UseGuards(AuthGuard)
  @Get('/most-visited')
  getUserMostVisited(@GetCurrentUser() user: User) {
    return this.linkService.getUserMostVisited(user.id);
  }

  @UseGuards(AuthGuard)
  @Patch('/:id')
  updateUserLink(
    @Param('id') id: string,
    @Body() updateLinkDto: UpdateLinkDto
  ) {
    return this.linkService.updateUserLink(id, updateLinkDto);
  }
}
