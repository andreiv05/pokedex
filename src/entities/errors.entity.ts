import { ApiProperty } from '@nestjs/swagger';

export class ServiceUnavailable {
  @ApiProperty({ example: 503 })
  statusCode: number;

  @ApiProperty({ example: 'PokeAPI is not available' })
  message: string;

  @ApiProperty({ example: 'Service Unavailable' })
  error: string;
}
