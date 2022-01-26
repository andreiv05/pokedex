import { HttpModule } from '@nestjs/axios';
import { CacheModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PokemonController } from './controllers';
import { PokeApiService, TranslatorService } from './services';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    HttpModule,
    CacheModule.register(),
  ],
  controllers: [PokemonController],
  providers: [PokeApiService, TranslatorService],
})
export class AppModule {}
