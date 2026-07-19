import {
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';

export class CreateMemberDto {
  @ApiProperty({
    example: '7b84a4d5-8c41-4c89-a774-52a2f55a79b2',
    description: 'Identificador do clube ao qual o sócio pertence.',
  })
  @IsUUID()
  clubId: string;

  @ApiPropertyOptional({
    example: '8e2db4ab-07a8-4e4f-98eb-d4dd0c55a5d2',
    description:
      'Utilizador associado ao sócio (opcional).',
  })
  @IsOptional()
  @IsUUID()
  userId?: string;

  @ApiProperty({
    example: 'SOC-000001',
    description:
      'Número de sócio único dentro do clube.',
    maxLength: 30,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  membershipNumber: string;

  @ApiProperty({
    example: 'João',
    description: 'Primeiro nome do sócio.',
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  firstName: string;

  @ApiProperty({
    example: 'Silva',
    description: 'Apelido do sócio.',
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  lastName: string;

  @ApiPropertyOptional({
    example: 'joao.silva@email.pt',
    description: 'Endereço de email do sócio.',
    maxLength: 255,
  })
  @IsOptional()
  @IsEmail()
  @MaxLength(255)
  email?: string;

  @ApiPropertyOptional({
    example: '+351912345678',
    description: 'Número de telefone do sócio.',
    maxLength: 30,
  })
  @IsOptional()
  @IsPhoneNumber('PT')
  phone?: string;

  @ApiPropertyOptional({
    example: '1990-05-18',
    description: 'Data de nascimento.',
    type: String,
    format: 'date',
  })
  @IsOptional()
  @IsDateString()
  birthDate?: string;

  @ApiPropertyOptional({
    example: '2026-07-19',
    description:
      'Data de inscrição no clube.',
    type: String,
    format: 'date',
  })
  @IsOptional()
  @IsDateString()
  joinDate?: string;

  @ApiPropertyOptional({
    example:
      'Sócio federado. Prefere jogar ao final do dia.',
    description: 'Observações internas.',
  })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({
    example: true,
    description:
      'Indica se o sócio está ativo.',
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}