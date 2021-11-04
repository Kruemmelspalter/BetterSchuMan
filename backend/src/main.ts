import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LoggerInterceptor } from './logging/logger.interceptor';
import { SchuManLogger } from './logging/logger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new SchuManLogger(),
  });

  app.useGlobalInterceptors(new LoggerInterceptor());

  await app.listen(process.env.PORT || 80);
}

bootstrap();
