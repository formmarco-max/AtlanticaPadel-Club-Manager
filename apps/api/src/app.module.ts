import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { CoachesModule } from './coaches/coaches.module';
import { CourtsModule } from './courts/courts.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { HealthModule } from './health/health.module';
import { LessonsModule } from './lessons/lessons.module';
import { MembersModule } from './members/members.module';
import { ReservationsModule } from './reservations/reservations.module';
import { RolesModule } from './roles/roles.module';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    HealthModule,
    AuthModule,
    UsersModule,
    RolesModule,
    MembersModule,
    CoachesModule,
    CourtsModule,
    ReservationsModule,
    LessonsModule,
    DashboardModule,
    PrismaModule,
  ],
})
export class AppModule {}