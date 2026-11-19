import { Module } from '@nestjs/common';
import { UsersService } from './users.service.js';
import { UsersController } from './users.controller.js';
import { MembersController } from './members.controller.js';
import { AdminMembersController } from './admin-members.controller.js';
import { AuthModule } from '../auth/auth.module.js';
import { NotificationsModule } from '../notifications/notifications.module.js';

@Module({
  imports: [AuthModule, NotificationsModule],
  controllers: [UsersController, MembersController, AdminMembersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}

