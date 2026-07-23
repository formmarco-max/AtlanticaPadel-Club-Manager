import {
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
} from 'class-validator';

import {
  CourtEnvironment,
  CourtSurfaceType,
  CourtType,
} from '../../generated/prisma/enums';

export class CreateCourtDto {
  @ApiProperty({
    example: 'Campo 1',
    description: 'Nome identificativo do campo.',
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty({
    message: 'O nome do campo é obrigatório.',
  })
  @MaxLength(100, {
    message: 'O nome do campo não pode exceder 100 caracteres.',
  })
  name: string;

  @ApiPropertyOptional({
    example: 'Campo principal com bancada lateral.',
    description: 'Descrição adicional do campo.',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    example: 'Pavilhão principal',
    description:
      'Localização do campo dentro das instalações do clube.',
    maxLength: 150,
  })
  @IsOptional()
  @IsString()
  @MaxLength(150, {
    message: 'A localização não pode exceder 150 caracteres.',
  })
  location?: string;

  @ApiPropertyOptional({
    enum: CourtSurfaceType,
    example: CourtSurfaceType.ARTIFICIAL_GRASS,
    description: 'Tipo de superfície do campo.',
    default: CourtSurfaceType.ARTIFICIAL_GRASS,
  })
  @IsOptional()
  @IsEnum(CourtSurfaceType, {
    message: 'O tipo de superfície indicado não é válido.',
  })
  surfaceType?: CourtSurfaceType;

  @ApiPropertyOptional({
    enum: CourtType,
    example: CourtType.DOUBLES,
    description:
      'Tipo de campo, destinado a jogos singulares ou de pares.',
    default: CourtType.DOUBLES,
  })
  @IsOptional()
  @IsEnum(CourtType, {
    message: 'O tipo de campo indicado não é válido.',
  })
  courtType?: CourtType;

  @ApiPropertyOptional({
    enum: CourtEnvironment,
    example: CourtEnvironment.INDOOR,
    description: 'Ambiente do campo, coberto ou exterior.',
    default: CourtEnvironment.INDOOR,
  })
  @IsOptional()
  @IsEnum(CourtEnvironment, {
    message: 'O ambiente do campo indicado não é válido.',
  })
  environment?: CourtEnvironment;

  @ApiPropertyOptional({
    example: 25,
    description: 'Preço-base por hora de utilização do campo.',
    minimum: 0.01,
  })
  @IsOptional()
  @IsNumber(
    {
      maxDecimalPlaces: 2,
    },
    {
      message:
        'O preço por hora deve ser um número com até duas casas decimais.',
    },
  )
  @IsPositive({
    message: 'O preço por hora deve ser superior a zero.',
  })
  hourlyPrice?: number;

  @ApiPropertyOptional({
    example: true,
    description:
      'Indica se o campo está ativo e disponível para utilização.',
    default: true,
  })
  @IsOptional()
  @IsBoolean({
    message: 'O estado do campo deve ser um valor booleano.',
  })
  isActive?: boolean;
}