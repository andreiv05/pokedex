import { HttpModule } from '@nestjs/axios';
import { CacheModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PokemonController } from './controllers';
import { PokeApiService, TranslatorService, PokemonService } from './services';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    HttpModule,
    CacheModule.register(),
  ],
  controllers: [PokemonController],
  providers: [PokeApiService, TranslatorService, PokemonService],
})
export class AppModule {}
