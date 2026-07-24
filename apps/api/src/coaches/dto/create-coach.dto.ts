import {
  IsBoolean,
  IsDateString,
  IsEmail,
  IsOptional,
  IsString,
  IsUUID,
  Length,
  MaxLength,
} from 'class-validator';
import {
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';

export class CreateCoachDto {
  @ApiPropertyOptional({
    description: 'ID do utilizador opcionalmente associado ao treinador',
    example: 'd290f1ee-6c54-4b01-90e6-d701748f0852',
  })
  @IsOptional()
  @IsUUID('4', {
    message: 'O ID do utilizador deve ser um UUID válido.',
  })
  userId?: string;

  @ApiPropertyOptional({
    description: 'Número interno do treinador',
    example: 'TR0001',
    maxLength: 30,
  })
  @IsOptional()
  @IsString({
    message: 'O número interno deve ser uma string.',
  })
  @MaxLength(30, {
    message: 'O número interno não pode exceder 30 caracteres.',
  })
  employeeNumber?: string;

  @ApiProperty({
    description: 'Primeiro nome',
    example: 'João',
    minLength: 2,
    maxLength: 100,
  })
  @IsString({
    message: 'O primeiro nome deve ser uma string.',
  })
  @Length(2, 100, {
    message: 'O primeiro nome deve ter entre 2 e 100 caracteres.',
  })
  firstName: string;

  @ApiProperty({
    description: 'Último nome',
    example: 'Silva',
    minLength: 2,
    maxLength: 100,
  })
  @IsString({
    message: 'O último nome deve ser uma string.',
  })
  @Length(2, 100, {
    message: 'O último nome deve ter entre 2 e 100 caracteres.',
  })
  lastName: string;

  @ApiPropertyOptional({
    description: 'Endereço de email',
    example: 'joao.silva@apcm.pt',
    maxLength: 255,
  })
  @IsOptional()
  @IsEmail({}, {
    message: 'O email deve ser válido.',
  })
  @MaxLength(255, {
    message: 'O email não pode exceder 255 caracteres.',
  })
  email?: string;

  @ApiPropertyOptional({
    description: 'Número de telefone',
    example: '912345678',
    maxLength: 30,
  })
  @IsOptional()
  @IsString({
    message: 'O telefone deve ser uma string.',
  })
  @MaxLength(30, {
    message: 'O telefone não pode exceder 30 caracteres.',
  })
  phone?: string;

  @ApiPropertyOptional({
    description: 'Especialização profissional',
    example: 'Treinador Nível II',
    maxLength: 150,
  })
  @IsOptional()
  @IsString({
    message: 'A especialização deve ser uma string.',
  })
  @MaxLength(150, {
    message: 'A especialização não pode exceder 150 caracteres.',
  })
  specialization?: string;

  @ApiPropertyOptional({
    description: 'Biografia e experiência profissional',
    example: 'Treinador com mais de 10 anos de experiência.',
    maxLength: 2000,
  })
  @IsOptional()
  @IsString({
    message: 'A biografia deve ser uma string.',
  })
  @MaxLength(2000, {
    message: 'A biografia não pode exceder 2000 caracteres.',
  })
  biography?: string;

  @ApiPropertyOptional({
    description: 'Data de contratação em formato ISO 8601',
    example: '2026-07-21',
  })
  @IsOptional()
  @IsDateString({}, {
    message: 'A data de contratação deve ser uma data ISO válida.',
  })
  hireDate?: string;

  @ApiPropertyOptional({
    description: 'Indica se o treinador está ativo',
    default: true,
  })
  @IsOptional()
  @IsBoolean({
    message: 'O estado ativo deve ser verdadeiro ou falso.',
  })
  isActive?: boolean;
}
