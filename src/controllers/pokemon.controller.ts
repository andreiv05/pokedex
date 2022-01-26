import {
  Controller,
  Get,
  Param,
  Logger,
  ServiceUnavailableException,
  UseInterceptors,
  CacheInterceptor,
  CacheTTL,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Pokemon, ServiceUnavailable } from '../entities';
import { PokemonInformation } from '../app.types';
import { PokemonService } from '../services';

@ApiTags('pokemon')
@Controller('/pokemon')
export class PokemonController {
  private readonly logger = new Logger('AppController');

  constructor(private readonly pokemonService: PokemonService) {}

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
  @CacheTTL(3600)
  @UseInterceptors(CacheInterceptor)
  @Get('/:pokemonName')
  async getBasicInfo(
    @Param('pokemonName') pokemonName: string,
  ): Promise<PokemonInformation> {
    let pokeInfo;
    try {
      pokeInfo = await this.pokemonService.getBasicInfo(pokemonName);
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
  @ApiResponse({
    status: 503,
    description: 'Service unavailable',
    type: ServiceUnavailable,
  })
  @Get('/translated/:pokemonName')
  async get(
    @Param('pokemonName') pokemonName: string,
  ): Promise<PokemonInformation> {
    let pokeInfo = await this.getBasicInfo(pokemonName);

    try {
      pokeInfo = await this.pokemonService.translate(pokeInfo);
    } catch (error) {
      this.logger.error('Translation' + error);
    }

    return pokeInfo;
  }
}
