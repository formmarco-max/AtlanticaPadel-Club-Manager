import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UpdateClubSettingsDto } from './dto/update-club-settings.dto';
import { SettingsService } from './settings.service';

@ApiTags('Settings')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN', 'OWNER')
@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get()
  getClubSettings(@CurrentUser('id') userId: string) {
    return this.settingsService.getClubSettings(userId);
  }

  @Patch()
  updateClubSettings(
    @CurrentUser('id') userId: string,
    @Body() dto: UpdateClubSettingsDto,
  ) {
    return this.settingsService.updateClubSettings(userId, dto);
  }
}
