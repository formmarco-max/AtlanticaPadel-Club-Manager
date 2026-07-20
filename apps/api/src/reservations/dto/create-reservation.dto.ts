import {
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';
import { ReservationStatus } from '../../generated/prisma/enums';

export class CreateReservationDto {
  @ApiProperty({
    example: '14141ecf-b096-4381-80f9-dbecb89a6d0a',
    description: 'Identificador UUID do clube ao qual a reserva pertence.',
  })
  @IsUUID('4', {
    message: 'O identificador do clube deve ser um UUID válido.',
  })
  clubId: string;

  @ApiProperty({
    example: 'e3dc4c7f-3b9a-4a90-8601-fe462464c102',
    description: 'Identificador UUID do campo reservado.',
  })
  @IsUUID('4', {
    message: 'O identificador do campo deve ser um UUID válido.',
  })
  courtId: string;

  @ApiProperty({
    example: '96f82aec-d4c4-453a-a36f-a2101f66e308',
    description: 'Identificador UUID do sócio responsável pela reserva.',
  })
  @IsUUID('4', {
    message: 'O identificador do sócio deve ser um UUID válido.',
  })
  memberId: string;

  @ApiProperty({
    example: '2026-07-21T18:00:00.000Z',
    description:
      'Data e hora de início da reserva em formato ISO 8601.',
  })
  @IsDateString(
    {},
    {
      message:
        'A data e hora de início devem estar num formato ISO 8601 válido.',
    },
  )
  startTime: string;

  @ApiProperty({
    example: '2026-07-21T19:30:00.000Z',
    description:
      'Data e hora de fim da reserva em formato ISO 8601.',
  })
  @IsDateString(
    {},
    {
      message:
        'A data e hora de fim devem estar num formato ISO 8601 válido.',
    },
  )
  endTime: string;

  @ApiPropertyOptional({
    enum: ReservationStatus,
    example: ReservationStatus.CONFIRMED,
    description:
      'Estado inicial da reserva. Por omissão, a reserva é confirmada.',
    default: ReservationStatus.CONFIRMED,
  })
  @IsOptional()
  @IsEnum(ReservationStatus, {
    message: 'O estado indicado para a reserva não é válido.',
  })
  status?: ReservationStatus;

  @ApiPropertyOptional({
    example: 37.5,
    description:
      'Preço total da reserva. Pode ser calculado automaticamente pelo serviço.',
    minimum: 0.01,
  })
  @IsOptional()
  @IsNumber(
    {
      maxDecimalPlaces: 2,
    },
    {
      message:
        'O preço total deve ser um número com até duas casas decimais.',
    },
  )
  @IsPositive({
    message: 'O preço total deve ser superior a zero.',
  })
  totalPrice?: number;

  @ApiPropertyOptional({
    example: 'Reserva para jogo entre quatro sócios.',
    description: 'Observações adicionais sobre a reserva.',
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty({
    message: 'As observações não podem estar vazias.',
  })
  @MaxLength(1000, {
    message: 'As observações não podem exceder 1000 caracteres.',
  })
  notes?: string;
}