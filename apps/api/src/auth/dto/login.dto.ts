import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    description: 'Endereço de email do utilizador',
    example: 'admin@apcm.pt',
  })
  @IsEmail({}, { message: 'O email deve ter um formato válido.' })
  @IsNotEmpty({ message: 'O email é obrigatório.' })
  email: string;

  @ApiProperty({
    description: 'Palavra-passe do utilizador',
    example: 'Admin@123!',
  })
  @IsString({ message: 'A palavra-passe deve ser uma string.' })
  @IsNotEmpty({ message: 'A palavra-passe é obrigatória.' })
  password: string;
}