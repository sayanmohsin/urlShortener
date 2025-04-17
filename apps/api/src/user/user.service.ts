import { Injectable } from '@nestjs/common';
import { CreateUser } from './def/create-user.def';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository) {}

  async getByEmail(email: string) {
    return this.userRepository.findOne({
      email,
    });
  }

  async getById(id: string) {
    return this.userRepository.findOne({
      id,
    });
  }

  async create(user: CreateUser) {
    return this.userRepository.create(user);
  }
}
