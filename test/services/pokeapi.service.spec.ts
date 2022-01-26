import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { of } from 'rxjs';
import { PokeApiService } from '../../src/services/index';
import { mockPokeApiResponse } from './pokeapi.mock';

describe('PokeAPIService', () => {
  const mockedPokeApiEndpoint = 'http://mocked-pokeapi';
  let pokeApiService: PokeApiService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [],
      providers: [
        PokeApiService,
        {
          provide: ConfigService,
          useValue: {
            get: (key: string) => {
              key === 'POKEAPI_BASE_URL' ? mockedPokeApiEndpoint : '';
            },
          },
        },
        {
          provide: HttpService,
          useValue: {
            get: (url) => {
              if (url.includes('mewtwo')) {
                return of({ data: { ...mockPokeApiResponse } });
              } else {
                throw new Error('404 Not Found');
              }
            },
          },
        },
      ],
    }).compile();

    pokeApiService = moduleRef.get<PokeApiService>(PokeApiService);
  });

  describe('getBasicInfo', () => {
    it('should call PokeAPI and return parsed PokemonInformation', async () => {
      const pokemonName = 'mewtwo';
      const expectedPokemonInformation = {
        name: 'mewtwo',
        description:
          'It was created by\na scientist after\nyears of horrific\fgene splicing and\nDNA engineering\nexperiments.',
        habitat: 'rare',
        isLegendary: true,
      };

      expect(await pokeApiService.getBasicInfo(pokemonName)).toEqual(
        expectedPokemonInformation,
      );
    });

    it('should throw an error if PokeAPI returns 404', async () => {
      const pokemonName = 'unknown-pokemon-namcoe';

      expect(pokeApiService.getBasicInfo(pokemonName)).rejects.toThrowError(
        '404 Not Found',
      );
    });
  });
});
