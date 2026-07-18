import {
  ArgumentsHost,
  Catch,
  ConflictException,
  ExceptionFilter,
  HttpStatus,
  Logger,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import type { Request, Response } from 'express';

import { Prisma } from '../../generated/prisma/client';
import type { ApiErrorResponse } from '../interfaces/api-error-response.interface';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(PrismaExceptionFilter.name);

  catch(
    exception: Prisma.PrismaClientKnownRequestError,
    host: ArgumentsHost,
  ): void {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    const request = context.getRequest<Request>();

    const httpException = this.mapException(exception);
    const statusCode = httpException.getStatus();
    const exceptionResponse = httpException.getResponse();

    const message =
      typeof exceptionResponse === 'string'
        ? exceptionResponse
        : this.extractMessage(exceptionResponse);

    this.logger.warn(
      `${request.method} ${request.url} - Prisma ${exception.code}: ${message}`,
    );

    const errorResponse: ApiErrorResponse = {
      success: false,
      statusCode,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
    };

    response.status(statusCode).json(errorResponse);
  }

  private mapException(
    exception: Prisma.PrismaClientKnownRequestError,
  ):
    | ConflictException
    | NotFoundException
    | UnprocessableEntityException {
    switch (exception.code) {
      case 'P2002':
        return new ConflictException(
          this.getUniqueConstraintMessage(exception),
        );

      case 'P2003':
        return new UnprocessableEntityException(
          'A operação viola uma relação existente na base de dados.',
        );

      case 'P2025':
        return new NotFoundException(
          'O recurso solicitado não foi encontrado.',
        );

      default:
        return new UnprocessableEntityException(
          'Não foi possível concluir a operação na base de dados.',
        );
    }
  }

  private getUniqueConstraintMessage(
    exception: Prisma.PrismaClientKnownRequestError,
  ): string {
    const target = exception.meta?.target;

    if (Array.isArray(target) && target.length > 0) {
      const fields = target.join(', ');

      return `Já existe um registo com o valor fornecido para: ${fields}.`;
    }

    return 'Já existe um registo com os dados fornecidos.';
  }

  private extractMessage(response: object): string | string[] {
    if ('message' in response) {
      const message = response.message;

      if (typeof message === 'string' || Array.isArray(message)) {
        return message;
      }
    }

    return 'Não foi possível concluir a operação na base de dados.';
  }
}