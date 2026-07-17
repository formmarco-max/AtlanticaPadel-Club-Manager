import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import type { AuthenticatedUser } from './strategies/jwt.strategy';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Autenticar um utilizador',
    description:
      'Valida as credenciais do utilizador e devolve um token JWT.',
  })
  @ApiBody({
    type: LoginDto,
  })
  @ApiOkResponse({
    description: 'Autenticação efetuada com sucesso.',
    schema: {
      example: {
        accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        tokenType: 'Bearer',
        expiresIn: 3600,
        user: {
          id: 'b521fa36-8fd0-4329-8f1b-d4c130ff32f5',
          email: 'admin@apcm.pt',
          firstName: 'Marco',
          lastName: 'Oliveira',
          role: 'ADMIN',
        },
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Email ou palavra-passe inválidos.',
  })
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Obter o utilizador autenticado',
    description:
      'Devolve os dados presentes no token JWT do utilizador autenticado.',
  })
  @ApiOkResponse({
    description: 'Utilizador autenticado devolvido com sucesso.',
    schema: {
      example: {
        id: 'b521fa36-8fd0-4329-8f1b-d4c130ff32f5',
        email: 'admin@apcm.pt',
        role: 'ADMIN',
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Token JWT ausente, inválido ou expirado.',
  })
  me(@CurrentUser() user: AuthenticatedUser): AuthenticatedUser {
    return user;
  }
}