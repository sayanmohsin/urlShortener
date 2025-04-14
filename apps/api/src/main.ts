import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { EnvConfig } from './config/configuration';
import { AppLoggerService } from './lib/logger/app-logger.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });
  const logger = app.get(AppLoggerService);
  const config = app.get(ConfigService<EnvConfig>);
  const port = config.get('PORT');
  const env = config.get('NODE_ENV', 'development');

  app.useLogger(logger);
  app.enableCors();

  // Start the server first
  await app.listen(port);

  // Then get the URL
  const url = await app.getUrl();

  logger.log(`URL Shortener API running in ${env} mode`);
  logger.log(`Server running at: ${url}`);
}
bootstrap();
