import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { User } from '@url-shortener/db/generated';
import { AuthGuard } from '../auth/auth.guard';
import { GetCurrentUser } from '../auth/decorators/get-current-user.decorator';
import { CreateLinkDto } from '../types/link-dtos/create-link.dtos';
import { UpdateLinkDto } from '../types/link-dtos/update-link.dtos';
import { LinkService } from './link.service';

@Controller('api/links')
export class LinkController {
  constructor(private readonly linkService: LinkService) {}

  @UseGuards(AuthGuard)
  @Post('/')
  createUserLink(
    @GetCurrentUser() user: User,
    @Body() createLinkDto: CreateLinkDto
  ) {
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
  @Patch('/:id')
  updateUserLink(
    @Param('id') id: string,
    @Body() updateLinkDto: UpdateLinkDto
  ) {
    return this.linkService.updateUserLink(id, updateLinkDto);
  }
}
