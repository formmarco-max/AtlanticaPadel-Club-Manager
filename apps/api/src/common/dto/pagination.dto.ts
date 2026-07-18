import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsInt,
  IsOptional,
  Max,
  Min,
} from 'class-validator';

export class PaginationDto {
  @ApiPropertyOptional({
    description: 'Número da página a consultar.',
    example: 1,
    default: 1,
    minimum: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({
    message: 'A página deve ser um número inteiro.',
  })
  @Min(1, {
    message: 'A página deve ser igual ou superior a 1.',
  })
  page: number = 1;

  @ApiPropertyOptional({
    description: 'Número máximo de registos por página.',
    example: 10,
    default: 10,
    minimum: 1,
    maximum: 100,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({
    message: 'O limite deve ser um número inteiro.',
  })
  @Min(1, {
    message: 'O limite deve ser igual ou superior a 1.',
  })
  @Max(100, {
    message: 'O limite não pode exceder 100.',
  })
  limit: number = 10;
}