import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { of } from 'rxjs';
import { TranslatorService } from '../../src/services';
import {
  mockTranslatorResponseShakespeare,
  mockTranslatorResponseYoda,
} from './translator.mock';

describe('TranslatorService', () => {
  const mockedPokeApiEndpoint = 'http://mocked-pokeapi';
  let translatorService: TranslatorService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [],
      providers: [
        TranslatorService,
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
            post: (url, data) => {
              if (data.text === 'similated_rate_limit_exceeded') {
                throw new Error('429 Too Many Requests');
              }

              if (url.includes('translate/shakespeare')) {
                return of({ data: { ...mockTranslatorResponseShakespeare } });
              }

              if (url.includes('translate/yoda')) {
                return of({ data: { ...mockTranslatorResponseYoda } });
              }
            },
          },
        },
      ],
    }).compile();

    translatorService = moduleRef.get<TranslatorService>(TranslatorService);
  });

  describe('shakespeareTranslate', () => {
    it('should return the shakespeare translation of the given text', async () => {
      const text =
        'Drifts in shallow\nseas. Anglers who\nhook them by\faccident are\noften punished by\nits stinging acid.';
      const expectedTranslation =
        mockTranslatorResponseShakespeare.contents.translated;

      expect(await translatorService.shakespeareTranslate(text)).toEqual(
        expectedTranslation,
      );
    });

    it('should throw an error if translator API returns 429', async () => {
      const text = 'similated_rate_limit_exceeded';

      expect(translatorService.shakespeareTranslate(text)).rejects.toThrowError(
        '429 Too Many Requests',
      );
    });
  });

  describe('yodaTranslate', () => {
    it('should return the shakespeare translation of the given text', async () => {
      const text =
        'It was created by\na scientist after\nyears of horrific\fgene splicing and\nDNA engineering\nexperiments.';
      const expectedTranslation =
        mockTranslatorResponseYoda.contents.translated;

      expect(await translatorService.yodaTranslate(text)).toEqual(
        expectedTranslation,
      );
    });

    it('should throw an error if translator API returns 429', async () => {
      const text = 'similated_rate_limit_exceeded';

      expect(translatorService.yodaTranslate(text)).rejects.toThrowError(
        '429 Too Many Requests',
      );
    });
  });
});
