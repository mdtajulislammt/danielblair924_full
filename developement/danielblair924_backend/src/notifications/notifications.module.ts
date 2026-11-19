import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { NotificationsService } from './notifications.service.js';
import { NotificationsController } from './notifications.controller.js';
import { FirebaseService } from './firebase.service.js';
import { NotificationsGateway } from './notifications.gateway.js';

const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) {
  throw new Error('FATAL: JWT_SECRET environment variable is missing.');
}

@Global()
@Module({
  imports: [
    JwtModule.register({
      secret: jwtSecret,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [NotificationsController],
  providers: [
    NotificationsService,
    FirebaseService,
    NotificationsGateway,
  ],
  exports: [NotificationsService, FirebaseService, NotificationsGateway],
})
export class NotificationsModule {}

