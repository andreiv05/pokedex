export type PokemonInformation = {
  name: string;
  description: string;
  habitat: string;
  isLegendary: boolean;
};

export enum TranslationEnum {
  SHAKEPEARE = 'shakespeare',
  YODA = 'yoda',
}

export type TranslationType = 'shakespeare' | 'yoda';
