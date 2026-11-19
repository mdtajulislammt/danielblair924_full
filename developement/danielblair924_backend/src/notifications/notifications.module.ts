import { Global, Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service.js';
import { NotificationsController } from './notifications.controller.js';
import { FirebaseService } from './firebase.service.js';
import { NotificationsGateway } from './notifications.gateway.js';
import { AuthModule } from '../auth/auth.module.js';

@Global()
@Module({
  imports: [AuthModule],
  controllers: [NotificationsController],
  providers: [
    NotificationsService,
    FirebaseService,
    NotificationsGateway,
  ],
  exports: [NotificationsService, FirebaseService, NotificationsGateway],
})
export class NotificationsModule {}

