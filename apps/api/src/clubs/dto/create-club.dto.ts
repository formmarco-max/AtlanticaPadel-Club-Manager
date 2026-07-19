import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsHexColor,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Length,
  Matches,
  MaxLength,
} from 'class-validator';

export class CreateClubDto {
  @ApiProperty({
    example: 'Atlântica Padel Club',
    description: 'Nome do clube',
    maxLength: 150,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  name: string;

  @ApiProperty({
    example: 'atlantica-padel-club',
    description:
      'Identificador único do clube usado em URLs. Deve conter apenas letras minúsculas, números e hífenes.',
    maxLength: 150,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message:
      'slug must contain only lowercase letters, numbers and hyphens',
  })
  slug: string;

  @ApiPropertyOptional({
    example: 'geral@atlantica-padel.pt',
    description: 'Endereço de email do clube',
    maxLength: 255,
  })
  @IsOptional()
  @IsEmail()
  @MaxLength(255)
  email?: string;

  @ApiPropertyOptional({
    example: '+351 220 123 456',
    description: 'Número de telefone do clube',
    maxLength: 30,
  })
  @IsOptional()
  @IsString()
  @MaxLength(30)
  phone?: string;

  @ApiPropertyOptional({
    example: 'https://www.atlantica-padel.pt',
    description: 'Website oficial do clube',
    maxLength: 255,
  })
  @IsOptional()
  @IsUrl({
    require_protocol: true,
  })
  @MaxLength(255)
  website?: string;

  @ApiPropertyOptional({
    example:
      'Clube de padel com campos cobertos, aulas e organização de torneios.',
    description: 'Descrição do clube',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    example: '509123456',
    description: 'Número de identificação fiscal do clube',
    maxLength: 20,
  })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  taxNumber?: string;

  @ApiPropertyOptional({
    example: 'Rua do Padel, 100',
    description: 'Morada do clube',
    maxLength: 255,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  address?: string;

  @ApiPropertyOptional({
    example: '4400-123',
    description: 'Código postal do clube',
    maxLength: 20,
  })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  postalCode?: string;

  @ApiPropertyOptional({
    example: 'Vila Nova de Gaia',
    description: 'Cidade do clube',
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  city?: string;

  @ApiPropertyOptional({
    example: 'Porto',
    description: 'Distrito do clube',
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  district?: string;

  @ApiPropertyOptional({
    example: 'Portugal',
    description: 'País do clube',
    default: 'Portugal',
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  country?: string;

  @ApiPropertyOptional({
    example: 'https://cdn.example.com/clubs/atlantica/logo.png',
    description: 'URL do logótipo do clube',
    maxLength: 500,
  })
  @IsOptional()
  @IsUrl({
    require_protocol: true,
  })
  @MaxLength(500)
  logoUrl?: string;

  @ApiPropertyOptional({
    example: '#1E40AF',
    description: 'Cor principal da identidade visual do clube',
  })
  @IsOptional()
  @IsHexColor()
  @Length(4, 9)
  primaryColor?: string;

  @ApiPropertyOptional({
    example: '#F59E0B',
    description: 'Cor secundária da identidade visual do clube',
  })
  @IsOptional()
  @IsHexColor()
  @Length(4, 9)
  secondaryColor?: string;

  @ApiPropertyOptional({
    example: true,
    description: 'Indica se o clube está ativo',
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}