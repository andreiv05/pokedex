import { Controller, Get, Param } from '@nestjs/common';
import { PokemonInformation } from './app.types';
import { PokeApiService, TranslatorService } from './services';

@Controller('/pokemon')
export class AppController {
  constructor(
    private readonly pokeapiService: PokeApiService,
    private readonly translateService: TranslatorService,
  ) {}

  @Get('/:pokemonName')
  async getBasicInfo(
    @Param('pokemonName') pokemonName: string,
  ): Promise<PokemonInformation> {
    return {
      name: pokemonName,
      description: 'This is a description',
      habitat: 'This is a habitat',
      isLegendary: false,
    };
  }

  @Get('/translated/:pokemonName')
  get(@Param('pokemonName') pokemonName: string): PokemonInformation {
    return {
      name: pokemonName,
      description: 'This is a description',
      habitat: 'This is a habitat',
      isLegendary: false,
    };
  }
}
