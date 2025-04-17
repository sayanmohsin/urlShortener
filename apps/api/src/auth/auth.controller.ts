import { Body, Controller, Post } from '@nestjs/common';
import { LoginDto } from '../types/auth-dtos/login.dto';
import { RegisterDto } from '../types/auth-dtos/register.dto';
import { AuthService } from './auth.service';

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('/login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
}
