import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { TranslationType, TranslationEnum } from '../app.types';

@Injectable()
export class TranslatorService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  private async translate(
    text: string,
    translationType: TranslationType,
  ): Promise<string> {
    const translatorApiBaseUrl = this.configService.get<string>(
      'TRANSLATOR_BASE_URL',
    );

    const translatorApiResponse = await firstValueFrom(
      this.httpService.post(
        `${translatorApiBaseUrl}/translate/${translationType}.json`,
        { text },
      ),
    );

    return translatorApiResponse.data.contents.translated;
  }

  async shakespeareTranslate(text: string): Promise<string> {
    return this.translate(text, TranslationEnum.SHAKEPEARE);
  }

  async yodaTranslate(text: string): Promise<string> {
    return this.translate(text, TranslationEnum.YODA);
  }
}
