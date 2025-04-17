import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AppLoggerService } from '../logger/app-logger.service';
import { BaseExceptionFilter } from './base-exception.filter';

@Catch()
export class AppExceptionFilter
  extends BaseExceptionFilter
  implements ExceptionFilter
{
  constructor(protected readonly logger: AppLoggerService) {
    super(logger);
  }

  catch(exception: unknown, host: ArgumentsHost) {
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message = this.getErrorMessage(exception);

    let code: string | undefined;
    if (exception instanceof HttpException) {
      const exResponse = exception.getResponse();
      if (
        typeof exResponse === 'object' &&
        exResponse !== null &&
        'code' in exResponse
      ) {
        code = (exResponse as { code: string }).code;
      }
    }

    this.createErrorResponse(
      exception instanceof Error ? exception : new Error('Unknown error'),
      host,
      status,
      message,
      code
    );
  }

  private getErrorMessage(exception: unknown): string {
    if (exception instanceof HttpException) {
      const response = exception.getResponse();
      if (typeof response === 'string') {
        return response;
      }
      if (
        typeof response === 'object' &&
        response !== null &&
        'message' in response
      ) {
        const message = (response as { message: string | string[] }).message;
        return Array.isArray(message) ? message.join('; ') : message.toString();
      }
    }

    if (exception instanceof Error) {
      return exception.message || 'Internal server error';
    }

    return 'Internal server error';
  }
}
