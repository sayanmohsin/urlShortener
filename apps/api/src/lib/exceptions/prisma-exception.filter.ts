import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Prisma } from '@url-shortener/db/generated';
import { AppLoggerService } from '../logger/app-logger.service';
import { BaseExceptionFilter } from './base-exception.filter';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter
  extends BaseExceptionFilter
  implements ExceptionFilter
{
  constructor(protected readonly logger: AppLoggerService) {
    super(logger);
  }

  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const status = this.mapPrismaErrorToHttpStatus(exception);
    const message = this.createErrorMessage(exception);

    this.createErrorResponse(exception, host, status, message, exception.code);
  }

  private mapPrismaErrorToHttpStatus(
    exception: Prisma.PrismaClientKnownRequestError
  ): HttpStatus {
    switch (exception.code) {
      case 'P2001': // Record not found
      case 'P2025': // Record not found
        return HttpStatus.NOT_FOUND;
      case 'P2002': // Unique constraint violation
        return HttpStatus.CONFLICT;
      case 'P2000': // Value too long
      case 'P2003': // Foreign key constraint failed
      case 'P2005': // Invalid value
      case 'P2006': // Invalid value provided
        return HttpStatus.BAD_REQUEST;
      default:
        return HttpStatus.INTERNAL_SERVER_ERROR;
    }
  }

  private createErrorMessage(
    exception: Prisma.PrismaClientKnownRequestError
  ): string {
    switch (exception.code) {
      case 'P2001':
      case 'P2025':
        return 'Record not found';
      case 'P2002': {
        const target = exception.meta?.target as string[] | undefined;
        return `Duplicate entry for ${target ? target.join(', ') : 'field'}`;
      }
      case 'P2003':
        return 'Related record not found';
      case 'P2000':
        return 'The provided value is too long';
      default:
        return `Database error (${exception.code})`;
    }
  }
}
