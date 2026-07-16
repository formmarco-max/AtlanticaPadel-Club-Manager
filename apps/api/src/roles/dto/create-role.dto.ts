import { ApiProperty } from '@nestjs/swagger';

export class CreateRoleDto {
  @ApiProperty({
    example: 'ADMIN',
    description: 'Nome único do perfil.',
  })
  name: string;

  @ApiProperty({
    example: 'Administrador do sistema',
    description: 'Descrição do perfil.',
  })
  description: string;
}