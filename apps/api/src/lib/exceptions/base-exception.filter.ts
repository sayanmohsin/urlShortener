import { ArgumentsHost } from '@nestjs/common';
import { Response } from 'express';
import { AppLoggerService } from '../logger/app-logger.service';

export abstract class BaseExceptionFilter {
  constructor(protected readonly logger: AppLoggerService) {}

  protected createErrorResponse(
    exception: Error,
    host: ArgumentsHost,
    status: number,
    message: string,
    code?: string
  ): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();

    this.logger.error(
      `${request.method} ${request.url} - ${status} - ${message}`,
      exception.stack
    );

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
      ...(code && { code }),
    });
  }
}
