import { ApiProperty } from '@nestjs/swagger';

export class Pokemon {
  @ApiProperty({ example: 'tentacool' })
  name: string;

  @ApiProperty({
    example:
      'Drifts in shallow\nseas. Anglers who\nhook them by\faccident are\noften punished by\nits stinging acid.',
  })
  description: string;

  @ApiProperty({ example: 'sea' })
  habitat: string;

  @ApiProperty({ example: false })
  isLegendary: boolean;
}
