import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class UpdateMyProfileDto {
  @ApiProperty({ example: 'Marco' })
  @IsString({ message: 'O primeiro nome deve ser uma string.' })
  @IsNotEmpty({ message: 'O primeiro nome é obrigatório.' })
  @MaxLength(100, { message: 'O primeiro nome não pode exceder 100 caracteres.' })
  firstName: string;

  @ApiProperty({ example: 'Oliveira' })
  @IsString({ message: 'O apelido deve ser uma string.' })
  @IsNotEmpty({ message: 'O apelido é obrigatório.' })
  @MaxLength(100, { message: 'O apelido não pode exceder 100 caracteres.' })
  lastName: string;
}
