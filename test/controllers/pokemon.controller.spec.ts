/* eslint-disable @typescript-eslint/no-empty-function */
import { Test } from '@nestjs/testing';
import { PokemonController } from '../../src/controllers';
import { PokemonService } from '../../src/services';
import {
  CacheModule,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';

describe('PokemonController', () => {
  let pokemonController: PokemonController;
  let pokemonService: PokemonService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [CacheModule.register()],
      controllers: [PokemonController],
      providers: [
        {
          provide: PokemonService,
          useValue: { getBasicInfo: () => {}, translate: () => {} },
        },
      ],
    }).compile();

    pokemonController = moduleRef.get<PokemonController>(PokemonController);
    pokemonService = moduleRef.get<PokemonService>(PokemonService);
  });

  describe('getBasicInfo', () => {
    it('should return basic pokemon information', async () => {
      const mockPokemon = {
        name: 'mewtwo',
        description:
          'It was created by\na scientist after\nyears of horrific\fgene splicing and\nDNA engineering\nexperiments.',
        habitat: 'rare',
        isLegendary: true,
      };

      const pokemonServiceSpy = jest
        .spyOn(pokemonService, 'getBasicInfo')
        .mockImplementation(async (pokemonName) => {
          if (pokemonName === mockPokemon.name) {
            return mockPokemon;
          }

          throw new Error('404 Not Found');
        });

      expect(await pokemonController.getBasicInfo(mockPokemon.name)).toEqual(
        mockPokemon,
      );
      expect(pokemonServiceSpy).toHaveBeenCalledWith(mockPokemon.name);
      expect(pokemonServiceSpy).toHaveBeenCalledTimes(1);
    });

    it('should throw an NotFoundException error if unkown pokemon name', async () => {
      const pokemonServiceSpy = jest
        .spyOn(pokemonService, 'getBasicInfo')
        .mockRejectedValueOnce({ response: { status: 404 } });

      expect(
        pokemonController.getBasicInfo('unknown-pokemon-name'),
      ).rejects.toThrow(NotFoundException);
      expect(pokemonServiceSpy).toHaveBeenCalledWith('unknown-pokemon-name');
      expect(pokemonServiceSpy).toHaveBeenCalledTimes(1);
    });

    it('should throw an ServiceUnavailableException error if pokeAPI is not available', async () => {
      const pokemonServiceSpy = jest
        .spyOn(pokemonService, 'getBasicInfo')
        .mockRejectedValueOnce({ response: { status: 429 } });

      expect(pokemonController.getBasicInfo('mewtwo')).rejects.toThrow(
        ServiceUnavailableException,
      );
      expect(pokemonServiceSpy).toHaveBeenCalledWith('mewtwo');
      expect(pokemonServiceSpy).toHaveBeenCalledTimes(1);
    });
  });
  describe('getBasicInfoTranslated', () => {
    it('should return basic pokemon information with description translated', async () => {
      const mockPokemon = {
        name: 'mewtwo',
        description:
          'It was created by\na scientist after\nyears of horrific\fgene splicing and\nDNA engineering\nexperiments.',
        habitat: 'rare',
        isLegendary: true,
      };

      const expectedResponse = {
        name: 'mewtwo',
        description:
          'Created by a scientist after years of horrific gene splicing and dna engineering experiments,  it was.',
        habitat: 'rare',
        isLegendary: true,
      };

      const pokemonServiceSpy = jest
        .spyOn(pokemonService, 'getBasicInfo')
        .mockImplementation(async (pokemonName) => {
          if (pokemonName === mockPokemon.name) {
            return mockPokemon;
          }

          throw new Error('404 Not Found');
        });

      const translateServiceSpy = jest
        .spyOn(pokemonService, 'translate')
        .mockImplementation(async (pokemon) => {
          console.log(pokemon);

          if (pokemon.name === mockPokemon.name) {
            return expectedResponse;
          }
        });

      expect(
        await pokemonController.getBasicInfoTranslated(mockPokemon.name),
      ).toEqual(expectedResponse);
      expect(pokemonServiceSpy).toHaveBeenCalledWith(mockPokemon.name);
      expect(pokemonServiceSpy).toHaveBeenCalledTimes(1);
      expect(translateServiceSpy).toHaveBeenCalledWith(mockPokemon);
    });

    it('should return basic pokemon information with original description if translatorAPI si not available', async () => {
      const mockPokemon = {
        name: 'mewtwo',
        description:
          'It was created by\na scientist after\nyears of horrific\fgene splicing and\nDNA engineering\nexperiments.',
        habitat: 'rare',
        isLegendary: true,
      };

      const pokemonServiceSpy = jest
        .spyOn(pokemonService, 'getBasicInfo')
        .mockImplementation(async (pokemonName) => {
          if (pokemonName === mockPokemon.name) {
            return mockPokemon;
          }

          throw new Error('404 Not Found');
        });

      const translateServiceSpy = jest
        .spyOn(pokemonService, 'translate')
        .mockRejectedValueOnce({ response: { status: 429 } });

      expect(
        await pokemonController.getBasicInfoTranslated(mockPokemon.name),
      ).toEqual(mockPokemon);
      expect(pokemonServiceSpy).toHaveBeenCalledWith(mockPokemon.name);
      expect(pokemonServiceSpy).toHaveBeenCalledTimes(1);
      expect(translateServiceSpy).toHaveBeenCalledWith(mockPokemon);
    });

    it('should throw an NotFoundException error if unkown pokemon name', async () => {
      const pokemonServiceSpy = jest
        .spyOn(pokemonService, 'getBasicInfo')
        .mockRejectedValueOnce({ response: { status: 404 } });

      expect(
        pokemonController.getBasicInfoTranslated('unknown-pokemon-name'),
      ).rejects.toThrow(NotFoundException);
      expect(pokemonServiceSpy).toHaveBeenCalledWith('unknown-pokemon-name');
      expect(pokemonServiceSpy).toHaveBeenCalledTimes(1);
    });
  });
});
