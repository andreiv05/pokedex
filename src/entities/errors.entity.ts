import { ApiProperty } from '@nestjs/swagger';

export class ServiceUnavailable {
  @ApiProperty({ example: 503 })
  statusCode: number;

  @ApiProperty({ example: 'PokeAPI is not available' })
  message: string;

  @ApiProperty({ example: 'Service Unavailable' })
  error: string;
}

export class NotFound {
  @ApiProperty({ example: 404 })
  statusCode: number;

  @ApiProperty({ example: 'Unknown pokemon name' })
  message: string;

  @ApiProperty({ example: 'Not Found' })
  error: string;
}
