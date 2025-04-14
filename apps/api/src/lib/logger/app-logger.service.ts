import { Global, Injectable, LoggerService } from '@nestjs/common';
import { createLogger, format, transports } from 'winston';

@Global()
@Injectable()
export class AppLoggerService implements LoggerService {
  private readonly logger = createLogger({
    level: process.env.NODE_ENV === 'production' ? 'warn' : 'verbose',
    format: format.combine(
      format.colorize({ all: true }),
      format.timestamp(),
      format.printf(({ timestamp, level, message, context }) => {
        const contextStr =
          typeof context === 'string' ? context : 'Application';
        return `${timestamp} [${contextStr}] ${level}: ${message}`;
      })
    ),
    transports: [new transports.Console()],
  });

  log(message: string, context?: string) {
    this.logger.info(message, { context });
  }

  error(message: string, trace?: string, context?: string) {
    this.logger.error(message, { trace, context });
  }

  warn(message: string, context?: string) {
    this.logger.warn(message, { context });
  }

  debug(message: string, context?: string) {
    this.logger.debug(message, { context });
  }

  verbose(message: string, context?: string) {
    this.logger.verbose(message, { context });
  }
}
