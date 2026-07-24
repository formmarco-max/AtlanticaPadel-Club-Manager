import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateClubSettingsDto {
  @ApiPropertyOptional({ example: 'Atlantica Padel Club' })
  @IsOptional() @IsString() @MaxLength(150)
  name?: string;

  @ApiPropertyOptional({ example: 'clube@apcm.pt' })
  @IsOptional() @IsEmail() @MaxLength(255)
  email?: string | null;

  @ApiPropertyOptional({ example: '+351 210 000 000' })
  @IsOptional() @IsString() @MaxLength(30)
  phone?: string | null;

  @ApiPropertyOptional({ example: 'Rua do Padel, 10' })
  @IsOptional() @IsString() @MaxLength(255)
  address?: string | null;

  @ApiPropertyOptional({ example: '2730-000' })
  @IsOptional() @IsString() @MaxLength(20)
  postalCode?: string | null;

  @ApiPropertyOptional({ example: 'Barcarena' })
  @IsOptional() @IsString() @MaxLength(100)
  city?: string | null;

  @ApiPropertyOptional({ example: 'Lisboa' })
  @IsOptional() @IsString() @MaxLength(100)
  district?: string | null;

  @ApiPropertyOptional({ example: 'Portugal' })
  @IsOptional() @IsString() @MaxLength(100)
  country?: string | null;

  @ApiPropertyOptional({ example: 'https://www.apcm.pt' })
  @IsOptional() @IsString() @MaxLength(255)
  website?: string | null;

  @ApiPropertyOptional()
  @IsOptional() @IsString() @MaxLength(2000)
  description?: string | null;
}
