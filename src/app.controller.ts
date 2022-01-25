import { Controller, Get, Param } from '@nestjs/common';
import { PokemonInformation } from './app.types';
import { AppService } from './app.service';

@Controller('/pokemon')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/:pokemonName')
  getBasicInfo(@Param('pokemonName') pokemonName: string): PokemonInformation {
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
