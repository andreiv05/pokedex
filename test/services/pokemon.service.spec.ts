import { ConfigModule } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { HttpModule } from '@nestjs/axios';
import {
  PokeApiService,
  PokemonService,
  TranslatorService,
} from '../../src/services/index';

describe('PokemonService', () => {
  let pokemonService: PokemonService;
  let pokeApiService: PokeApiService;
  let translatorService: TranslatorService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [HttpModule, ConfigModule],
      providers: [PokemonService, PokeApiService, TranslatorService],
    }).compile();

    pokemonService = moduleRef.get<PokemonService>(PokemonService);
    pokeApiService = moduleRef.get<PokeApiService>(PokeApiService);
    translatorService = moduleRef.get<TranslatorService>(TranslatorService);
  });

  describe('getBasicInfo', () => {
    it('should return a PokemonInformation object', async () => {
      const pokemonName = 'pikachu';
      const expected = {
        name: 'pikachu',
        description:
          'When several of\nthese POKéMON\ngather, their\felectricity could\nbuild and cause\nlightning storms.',
        habitat: 'forest',
        isLegendary: false,
      };

      const getBasicInfoPokeApiSpy = jest
        .spyOn(pokeApiService, 'getBasicInfo')
        .mockImplementation(async () => expected);

      expect(await pokemonService.getBasicInfo(pokemonName)).toEqual(expected);
      expect(getBasicInfoPokeApiSpy).toHaveBeenCalledWith(pokemonName);
      expect(getBasicInfoPokeApiSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('translate', () => {
    it('should use yoda translation if pokemon is legendary', async () => {
      const pokemonInfo = {
        name: 'mewtwo',
        description:
          'It was created by\na scientist after\nyears of horrific\fgene splicing and\nDNA engineering\nexperiments.',
        habitat: 'rare',
        isLegendary: true,
      };
      const expectedDescription =
        'Created by a scientist after years of horrific gene splicing and dna engineering experiments,  it was.';

      const translateYodaSpy = jest
        .spyOn(translatorService, 'yodaTranslate')
        .mockImplementation(async () => expectedDescription);

      expect(await pokemonService.translate(pokemonInfo)).toEqual({
        ...pokemonInfo,
        description: expectedDescription,
      });
      expect(translateYodaSpy).toHaveBeenCalledWith(pokemonInfo.description);
      expect(translateYodaSpy).toHaveBeenCalledTimes(1);
    });

    it('should use yoda translation if pokemon habitat is cave', async () => {
      const pokemonInfo = {
        name: 'zubat',
        description:
          'Forms colonies in\nperpetually dark\nplaces. Uses\fultrasonic waves\nto identify and\napproach targets.',
        habitat: 'cave',
        isLegendary: false,
      };
      const expectedDescription =
        'Forms colonies in perpetually dark places.And approach targets,  uses ultrasonic waves to identify.';

      const translateYodaSpy = jest
        .spyOn(translatorService, 'yodaTranslate')
        .mockImplementation(async () => expectedDescription);

      expect(await pokemonService.translate(pokemonInfo)).toEqual({
        ...pokemonInfo,
        description: expectedDescription,
      });
      expect(translateYodaSpy).toHaveBeenCalledWith(pokemonInfo.description);
      expect(translateYodaSpy).toHaveBeenCalledTimes(1);
    });

    it('should use shakespeare translation for all others pokemons', async () => {
      const pokemonInfo = {
        name: 'tentacool',
        description:
          'Drifts in shallow\nseas. Anglers who\nhook them by\faccident are\noften punished by\nits stinging acid.',
        habitat: 'sea',
        isLegendary: false,
      };
      const expectedDescription =
        "Drifts in shallow flotes. Anglers who is't hook those folk by accident art oft did amerce by its stinging acid.";

      const translateshakespeareSpy = jest
        .spyOn(translatorService, 'shakespeareTranslate')
        .mockImplementation(async () => expectedDescription);

      expect(await pokemonService.translate(pokemonInfo)).toEqual({
        ...pokemonInfo,
        description: expectedDescription,
      });
      expect(translateshakespeareSpy).toHaveBeenCalledWith(
        pokemonInfo.description,
      );
      expect(translateshakespeareSpy).toHaveBeenCalledTimes(1);
    });
  });
});
