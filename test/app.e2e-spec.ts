import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('PokemonController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/pokemon/:pokemonName (GET)', () => {
    return request(app.getHttpServer())
      .get('/pokemon/mewtwo')
      .expect(200)
      .expect({
        name: 'mewtwo',
        description:
          'It was created by\na scientist after\nyears of horrific\fgene splicing and\nDNA engineering\nexperiments.',
        habitat: 'rare',
        isLegendary: true,
      });
  });

  it('/pokemon/translated/:pokemonName (GET) - yoda translation', () => {
    return request(app.getHttpServer())
      .get('/pokemon/translated/mewtwo')
      .expect(200)
      .expect({
        name: 'mewtwo',
        description:
          'Created by a scientist after years of horrific gene splicing and dna engineering experiments,  it was.',
        habitat: 'rare',
        isLegendary: true,
      });
  });

  it('/pokemon/translated/:pokemonName (GET) - shakespeare translation', () => {
    return request(app.getHttpServer())
      .get('/pokemon/translated/tentacool')
      .expect(200)
      .expect({
        name: 'tentacool',
        description:
          "Drifts in shallow flotes. Anglers who is't hook those folk by accident art oft did amerce by its stinging acid.",
        habitat: 'sea',
        isLegendary: false,
      });
  });
});
