import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';

export class UpdateMyProfileDto {
  @ApiProperty({ example: 'Marco' })
  @IsString({ message: 'O primeiro nome deve ser uma string.' })
  @IsNotEmpty({ message: 'O primeiro nome é obrigatório.' })
  @MaxLength(100, {
    message: 'O primeiro nome não pode exceder 100 caracteres.',
  })
  firstName: string;

  @ApiProperty({ example: 'Oliveira' })
  @IsString({ message: 'O apelido deve ser uma string.' })
  @IsNotEmpty({ message: 'O apelido é obrigatório.' })
  @MaxLength(100, {
    message: 'O apelido não pode exceder 100 caracteres.',
  })
  lastName: string;

  @ApiProperty({ example: 'marco.oliveira@apcm.pt' })
  @IsEmail({}, { message: 'O email deve ter um formato válido.' })
  @IsNotEmpty({ message: 'O email é obrigatório.' })
  @MaxLength(255, {
    message: 'O email não pode exceder 255 caracteres.',
  })
  email: string;

  @ApiPropertyOptional({ example: '+351 912 345 678' })
  @IsOptional()
  @IsString({ message: 'O telefone deve ser uma string.' })
  @MaxLength(30, {
    message: 'O telefone não pode exceder 30 caracteres.',
  })
  @Matches(/^\+?[0-9\s().-]{7,30}$/, {
    message: 'Introduz um número de telefone válido.',
  })
  phone?: string;
}
