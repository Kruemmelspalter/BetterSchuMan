import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SchuManLogger } from './logging/logger';
import { LoggerInterceptor } from './logging/logger.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new SchuManLogger(),
  });

  app.useGlobalInterceptors(new LoggerInterceptor());

  await app.listen(process.env.PORT || 80);
}

bootstrap();
