import { Controller, Get, UseGuards } from '@nestjs/common';
import { User } from '@url-shortener/db/generated';
import { AuthGuard } from '../auth/auth.guard';
import { GetCurrentUser } from '../auth/decorators/get-current-user.decorator';
import { UserService } from './user.service';

@Controller('api/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AuthGuard)
  @Get('/')
  getUser(@GetCurrentUser() user: User) {
    return user;
  }
}
