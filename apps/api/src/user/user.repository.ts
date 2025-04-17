import { Injectable } from '@nestjs/common';
import { Prisma } from '@url-shortener/db/generated';
import { PrismaService } from '../shared/prisma/prisma.service';

@Injectable()
export class UserRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async create(data: Prisma.UserUncheckedCreateInput) {
    return this.prismaService.user.create({
      data,
    });
  }

  async find(where: Prisma.UserWhereInput) {
    return this.prismaService.user.findMany({
      where,
    });
  }

  async findOne(where: Prisma.UserWhereInput) {
    return this.prismaService.user.findFirst({
      where,
    });
  }

  async get(id: string) {
    return this.prismaService.user.findUniqueOrThrow({
      where: {
        id,
      },
    });
  }

  async update(id: string, data: Prisma.UserUncheckedUpdateInput) {
    return this.prismaService.user.update({
      where: {
        id,
      },
      data,
    });
  }
}
