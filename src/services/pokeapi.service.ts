import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class PokeApiService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async getBasicInfo(pokemonName: string): Promise<any> {
    const pokeapiBaseUrl = this.configService.get<string>('POKEAPI_BASE_URL');
    const pokeapiResponse = await firstValueFrom(
      this.httpService.get(`${pokeapiBaseUrl}/pokemon-species/${pokemonName}`),
    );
    const description = pokeapiResponse.data.flavor_text_entries.find(
      (entry: any) => entry.language.name === 'en',
    );

    return {
      name: pokemonName,
      description: description.flavor_text,
      habitat: pokeapiResponse.data.habitat.name,
      isLegendary: pokeapiResponse.data.is_legendary,
    };
  }
}
