import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto, RegisterDto } from '@url-shortener/shared-types';
import { UserService } from './../user/user.service';
import { hashPassword, verifyPassword } from './utils/hash.util';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService
  ) {}

  async register(registerDto: RegisterDto) {
    const { email, password, name } = registerDto;

    const existingUser = await this.userService.getByEmail(email);

    if (existingUser) {
      throw new UnauthorizedException('Email already in use');
    }

    const hashedPassword = await hashPassword(password);

    const user = await this.userService.create({
      email,
      password: hashedPassword,
      name,
    });

    const accessToken = this.generateToken(user.id);

    const { password: _, ...result } = user;

    return {
      ...result,
      accessToken,
    };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await this.userService.getByEmail(email);

    if (!user || !(await verifyPassword(user.password, password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const accessToken = this.generateToken(user.id);

    const { password: _, ...result } = user;

    return {
      ...result,
      accessToken,
    };
  }

  generateToken(userId: string): string {
    return this.jwtService.sign({ sub: userId });
  }

  verifyToken(token: string) {
    try {
      return this.jwtService.verify(token);
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
