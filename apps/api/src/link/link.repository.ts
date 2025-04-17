import { Injectable } from '@nestjs/common';
import { Prisma } from '@url-shortener/db/generated';
import { PrismaService } from '../shared/prisma/prisma.service';

@Injectable()
export class LinkRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async create(data: Prisma.LinkUncheckedCreateInput) {
    return this.prismaService.link.create({
      data,
    });
  }

  async find(where: Prisma.LinkWhereInput) {
    return this.prismaService.link.findMany({
      where,
    });
  }

  async findOne(where: Prisma.LinkWhereInput) {
    return this.prismaService.link.findFirstOrThrow({
      where,
    });
  }

  async findUnique(where: Prisma.LinkWhereUniqueInput) {
    return this.prismaService.link.findUnique({
      where,
    });
  }

  async get(id: string) {
    return this.prismaService.link.findUniqueOrThrow({
      where: {
        id,
      },
    });
  }

  async update(id: string, data: Prisma.LinkUncheckedUpdateInput) {
    return this.prismaService.link.update({
      where: {
        id,
      },
      data,
    });
  }
}
