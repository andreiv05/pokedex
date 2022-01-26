import { HttpModule } from '@nestjs/axios';
import { CacheModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { PokeApiService, TranslatorService } from './services';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    HttpModule,
    CacheModule.register(),
  ],
  controllers: [AppController],
  providers: [PokeApiService, TranslatorService],
})
export class AppModule {}
