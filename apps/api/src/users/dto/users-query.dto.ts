import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

import { PaginationDto } from '../../common/dto/pagination.dto';
import { SortOrder } from '../../common/enums/sort-order.enum';
import { UserSortField } from '../enums/user-sort-field.enum';

export class UsersQueryDto extends PaginationDto {
  @ApiPropertyOptional({
    description:
      'Texto a pesquisar no primeiro nome, último nome ou email.',
    example: 'marco',
    maxLength: 100,
  })
  @IsOptional()
  @IsString({
    message: 'O parâmetro de pesquisa deve ser uma string.',
  })
  @MaxLength(100, {
    message:
      'O parâmetro de pesquisa não pode exceder 100 caracteres.',
  })
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  q?: string;

  @ApiPropertyOptional({
    description: 'Nome do perfil utilizado para filtrar utilizadores.',
    example: 'ADMIN',
  })
  @IsOptional()
  @IsString({
    message: 'O perfil deve ser uma string.',
  })
  @MaxLength(50, {
    message: 'O perfil não pode exceder 50 caracteres.',
  })
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string'
      ? value.trim().toUpperCase()
      : value,
  )
  role?: string;

  @ApiPropertyOptional({
    description:
      'Filtra os utilizadores pelo respetivo estado de atividade.',
    example: true,
  })
  @IsOptional()
  @Transform(({ value }: { value: unknown }) => {
    if (value === true || value === 'true') {
      return true;
    }

    if (value === false || value === 'false') {
      return false;
    }

    return value;
  })
  @IsBoolean({
    message: 'O parâmetro active deve ser true ou false.',
  })
  active?: boolean;

  @ApiPropertyOptional({
    description: 'Campo utilizado para ordenar os utilizadores.',
    enum: UserSortField,
    example: UserSortField.FIRST_NAME,
    default: UserSortField.FIRST_NAME,
  })
  @IsOptional()
  @IsEnum(UserSortField, {
    message:
      'O campo de ordenação deve ser firstName, lastName, email, createdAt ou updatedAt.',
  })
  sort: UserSortField = UserSortField.FIRST_NAME;

  @ApiPropertyOptional({
    description: 'Direção da ordenação.',
    enum: SortOrder,
    example: SortOrder.ASC,
    default: SortOrder.ASC,
  })
  @IsOptional()
  @IsEnum(SortOrder, {
    message: 'A direção da ordenação deve ser asc ou desc.',
  })
  order: SortOrder = SortOrder.ASC;
}