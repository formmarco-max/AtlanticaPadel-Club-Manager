import {
  IsBoolean,
  IsEmail,
  IsOptional,
  IsString,
  IsUUID,
  Length,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCoachDto {
  @ApiProperty({
    description: 'ID do clube',
    example: 'd290f1ee-6c54-4b01-90e6-d701748f0851',
  })
  @IsUUID('4', { message: 'O ID do clube deve ser um UUID válido.' })
  clubId: string;

  @ApiPropertyOptional({
    description: 'ID do utilizador associado',
    example: 'd290f1ee-6c54-4b01-90e6-d701748f0852',
  })
  @IsOptional()
  @IsUUID('4', { message: 'O ID do utilizador deve ser um UUID válido.' })
  userId?: string;

  @ApiPropertyOptional({
  description: 'Número interno do treinador',
  example: 'TR0001',
})
@IsOptional()
@IsString({
  message: 'O número do treinador deve ser uma string.',
})
@MaxLength(30, {
  message: 'O número do treinador não pode ter mais de 30 caracteres.',
})
employeeNumber?: string;

  @ApiProperty({
    description: 'Primeiro nome',
    example: 'João',
  })
  @IsString({ message: 'O primeiro nome deve ser uma string.' })
  @Length(2, 100, {
    message: 'O primeiro nome deve ter entre 2 e 100 caracteres.',
  })
  firstName: string;

  @ApiProperty({
    description: 'Último nome',
    example: 'Silva',
  })
  @IsString({ message: 'O último nome deve ser uma string.' })
  @Length(2, 100, {
    message: 'O último nome deve ter entre 2 e 100 caracteres.',
  })
  lastName: string;

  @ApiPropertyOptional({
    description: 'Email',
    example: 'joao.silva@apcm.pt',
  })
  @IsOptional()
  @IsEmail({}, { message: 'O email deve ser válido.' })
  email?: string;

  @ApiPropertyOptional({
    description: 'Telefone',
    example: '912345678',
  })
  @IsOptional()
  @IsString({ message: 'O telefone deve ser uma string.' })
  @MaxLength(30, {
    message: 'O telefone não pode ter mais de 30 caracteres.',
  })
  phone?: string;

  @ApiPropertyOptional({
    description: 'Especialização',
    example: 'Treinador Nível II',
  })
  @IsOptional()
  @IsString({ message: 'A especialização deve ser uma string.' })
  @MaxLength(150, {
    message: 'A especialização não pode ter mais de 150 caracteres.',
  })
  specialization?: string;

  @ApiPropertyOptional({
    description: 'Biografia',
    example: 'Treinador com mais de 10 anos de experiência.',
  })
  @IsOptional()
  @IsString({ message: 'A biografia deve ser uma string.' })
  biography?: string;

  @ApiPropertyOptional({
    description: 'Data de contratação',
    example: '2026-07-21',
  })
  @IsOptional()
  @IsString({
    message: 'A data de contratação deve estar no formato YYYY-MM-DD.',
  })
  hireDate?: string;

  @ApiPropertyOptional({
    description: 'Estado do treinador',
    default: true,
  })
  @IsOptional()
  @IsBoolean({
    message: 'O estado ativo deve ser verdadeiro ou falso.',
  })
  isActive?: boolean;
}