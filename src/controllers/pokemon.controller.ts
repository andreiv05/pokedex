import {
  Controller,
  Get,
  Param,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Pokemon, ServiceUnavailable } from '../entities';
import { PokemonInformation } from '../app.types';
import { PokeApiService, TranslatorService } from '../services';

@ApiTags('pokemon')
@Controller('/pokemon')
export class PokemonController {
  private readonly logger = new Logger('AppController');

  constructor(
    private readonly pokeapiService: PokeApiService,
    private readonly translateService: TranslatorService,
  ) {}

  @ApiResponse({
    status: 200,
    description: 'Get basic pokemon information',
    type: Pokemon,
  })
  @ApiResponse({
    status: 503,
    description: 'Service unavailable',
    type: ServiceUnavailable,
  })
  @Get('/:pokemonName')
  async getBasicInfo(
    @Param('pokemonName') pokemonName: string,
  ): Promise<PokemonInformation> {
    let pokeInfo;
    try {
      pokeInfo = await this.pokeapiService.getBasicInfo(pokemonName);
    } catch (error) {
      this.logger.error('PokeAPI' + error);
      throw new ServiceUnavailableException('PokeAPI is not available');
    }

    return pokeInfo;
  }

  @ApiResponse({
    status: 200,
    description: 'Get basic pokemon information',
    type: Pokemon,
  })
  @Get('/translated/:pokemonName')
  async get(
    @Param('pokemonName') pokemonName: string,
  ): Promise<PokemonInformation> {
    const pokeInfo = await this.getBasicInfo(pokemonName);

    let translatedDescription = null;
    try {
      const { description, habitat, isLegendary } = pokeInfo;

      if (isLegendary || habitat === 'cave') {
        translatedDescription = await this.translateService.yodaTranslate(
          description,
        );
      } else {
        translatedDescription =
          await this.translateService.shakespeareTranslate(
            pokeInfo.description,
          );
      }
    } catch (error) {
      this.logger.error('TranslatorService' + error);
    }

    return {
      ...pokeInfo,
      description: translatedDescription
        ? translatedDescription
        : pokeInfo.description,
    };
  }
}
