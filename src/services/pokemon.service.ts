import { Injectable } from '@nestjs/common';
import { TranslatorService } from './translator.service';
import { PokeApiService } from './pokeapi.service';
import { PokemonInformation } from '../app.types';

@Injectable()
export class PokemonService {
  constructor(
    private readonly translationService: TranslatorService,
    private readonly pokeApiService: PokeApiService,
  ) {}

  async getBasicInfo(pokemonName: string): Promise<PokemonInformation> {
    return this.pokeApiService.getBasicInfo(pokemonName);
  }

  async translate(pokeInfo: PokemonInformation): Promise<PokemonInformation> {
    const { description, habitat, isLegendary } = pokeInfo;
    let translatedDescription;

    if (isLegendary || habitat === 'cave') {
      translatedDescription = await this.translationService.yodaTranslate(
        description,
      );
    } else {
      translatedDescription =
        await this.translationService.shakespeareTranslate(
          pokeInfo.description,
        );
    }

    return {
      ...pokeInfo,
      description: translatedDescription,
    };
  }
}
