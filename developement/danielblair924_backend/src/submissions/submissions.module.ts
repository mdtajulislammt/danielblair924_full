import { Module } from '@nestjs/common';
import { SubmissionsService } from './submissions.service.js';
import { SubmissionsController } from './submissions.controller.js';
import { RunnerController } from './runner.controller.js';
import { AdminSubmissionsController } from './admin-submissions.controller.js';
import { AdminDashboardController } from './admin-dashboard.controller.js';
import { AuthModule } from '../auth/auth.module.js';

@Module({
  imports: [AuthModule],
  controllers: [
    SubmissionsController,
    RunnerController,
    AdminSubmissionsController,
    AdminDashboardController,
  ],
  providers: [SubmissionsService],
  exports: [SubmissionsService],
})
export class SubmissionsModule {}

