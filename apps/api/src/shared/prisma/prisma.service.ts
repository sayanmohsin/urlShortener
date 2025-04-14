import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@url-shortener/db';
import { AppLoggerService } from '../../lib/logger/app-logger.service';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor(
    private configService: ConfigService,
    private logger: AppLoggerService
  ) {
    super({
      datasources: {
        db: {
          url: configService.get<string>('DATABASE_URL'),
        },
      },
    });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  async createClientWithUrl(): Promise<PrismaClient> {
    const databaseUrl = this.configService.get<string>('DATABASE_URL');
    if (!databaseUrl) {
      throw new Error('DATABASE_URL is not defined in environment variables');
    }

    const prismaClient = new PrismaClient({
      datasources: {
        db: {
          url: databaseUrl,
        },
      },
    });

    try {
      await prismaClient.$connect();
      return prismaClient;
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error('Failed to connect to the database:', error.message);
      } else {
        this.logger.error('Failed to connect to the database:', String(error));
      }
      throw new Error('Failed to connect to the database');
    }
  }
}
