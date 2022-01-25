import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const confiService = app.get<ConfigService>(ConfigService);
  await app.listen(confiService.get<string>('PORT'));
}
bootstrap();
