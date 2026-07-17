import {
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsString,
  IsUUID,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    description: 'Identificador UUID do perfil atribuído ao utilizador.',
    example: '8d78d6a4-a8d7-4a18-95b4-357f60ef1924',
  })
  @IsUUID('4', {
    message: 'O roleId deve ser um UUID válido.',
  })
  roleId: string;

  @ApiProperty({
    description: 'Endereço de email do utilizador.',
    example: 'utilizador@apcm.pt',
  })
  @IsEmail(
    {},
    {
      message: 'O email deve ser válido.',
    },
  )
  @MaxLength(255, {
    message: 'O email não pode exceder 255 caracteres.',
  })
  email: string;

  @ApiProperty({
    description:
      'Palavra-passe com pelo menos 8 caracteres, incluindo maiúscula, minúscula, número e símbolo.',
    example: 'User@123!',
    minLength: 8,
  })
  @IsString({
    message: 'A palavra-passe deve ser uma string.',
  })
  @MinLength(8, {
    message: 'A palavra-passe deve ter pelo menos 8 caracteres.',
  })
  @MaxLength(72, {
    message: 'A palavra-passe não pode exceder 72 caracteres.',
  })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).+$/, {
    message:
      'A palavra-passe deve incluir uma letra maiúscula, uma letra minúscula, um número e um símbolo.',
  })
  password: string;

  @ApiProperty({
    description: 'Primeiro nome do utilizador.',
    example: 'Marco',
  })
  @IsString({
    message: 'O primeiro nome deve ser uma string.',
  })
  @IsNotEmpty({
    message: 'O primeiro nome é obrigatório.',
  })
  @MaxLength(100, {
    message: 'O primeiro nome não pode exceder 100 caracteres.',
  })
  firstName: string;

  @ApiProperty({
    description: 'Último nome do utilizador.',
    example: 'Oliveira',
  })
  @IsString({
    message: 'O último nome deve ser uma string.',
  })
  @IsNotEmpty({
    message: 'O último nome é obrigatório.',
  })
  @MaxLength(100, {
    message: 'O último nome não pode exceder 100 caracteres.',
  })
  lastName: string;

  @ApiPropertyOptional({
    description: 'Indica se o utilizador está ativo.',
    example: true,
    default: true,
  })
  @IsBoolean({
    message: 'O campo isActive deve ser booleano.',
  })
  isActive?: boolean;
}