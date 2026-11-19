import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { initializeApp, getApps, cert, App } from 'firebase-admin/app';
import { getMessaging, MulticastMessage } from 'firebase-admin/messaging';
import { PrismaService } from '../prisma/prisma.service.js';

export interface SendPushPayload {
  title: string;
  body: string;
  data?: Record<string, string>;
  badge?: number;
}

@Injectable()
export class FirebaseService implements OnModuleInit {
  private readonly logger = new Logger(FirebaseService.name);
  private app: App | null = null;
  private enabled = false;

  constructor(private readonly prisma: PrismaService) {}

  onModuleInit() {
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    let privateKey = process.env.FIREBASE_PRIVATE_KEY;

    if (!projectId || !clientEmail || !privateKey) {
      this.logger.warn(
        '⚠️ FCM disabled: FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, or FIREBASE_PRIVATE_KEY missing. Push notifications will be no-ops.',
      );
      this.enabled = false;
      return;
    }

    try {
      privateKey = privateKey.replace(/\\n/g, '\n');

      const existingApps = getApps();
      if (!existingApps.length) {
        this.app = initializeApp({
          credential: cert({
            projectId,
            clientEmail,
            privateKey,
          }),
        });
      } else {
        this.app = existingApps[0];
      }
      this.enabled = true;
      this.logger.log('🔥 Firebase Admin SDK initialized successfully for FCM');
    } catch (err: any) {
      this.logger.error(`Failed to initialize Firebase Admin SDK: ${err?.message}`, err?.stack);
      this.enabled = false;
    }
  }

  async sendToTokens(tokens: string[], payload: SendPushPayload): Promise<void> {
    if (!this.enabled || !tokens.length || !this.app) {
      return;
    }

    // Filter unique tokens
    const uniqueTokens = Array.from(new Set(tokens.filter(Boolean)));
    if (!uniqueTokens.length) return;

    const dataPayload: Record<string, string> = {};
    if (payload.data) {
      for (const [k, v] of Object.entries(payload.data)) {
        dataPayload[k] = v !== undefined && v !== null ? String(v) : '';
      }
    }

    const message: MulticastMessage = {
      tokens: uniqueTokens,
      notification: {
        title: payload.title,
        body: payload.body,
      },
      data: dataPayload,
      android: {
        priority: 'high',
        notification: {
          channelId: 'fmc_default',
          sound: 'default',
        },
      },
      apns: {
        payload: {
          aps: {
            sound: 'default',
            badge: payload.badge,
          },
        },
      },
    };

    try {
      const response = await getMessaging(this.app).sendEachForMulticast(message);
      const invalidTokens: string[] = [];

      response.responses.forEach((resp, idx) => {
        if (!resp.success && resp.error) {
          const code = resp.error.code;
          if (
            code === 'messaging/registration-token-not-registered' ||
            code === 'messaging/invalid-registration-token'
          ) {
            invalidTokens.push(uniqueTokens[idx]);
          }
        }
      });

      if (invalidTokens.length > 0) {
        this.logger.log(`Pruning ${invalidTokens.length} stale FCM device token(s)`);
        await this.prisma.deviceToken.deleteMany({
          where: { token: { in: invalidTokens } },
        });
      }
    } catch (error: any) {
      this.logger.error(`Error sending multicast FCM notification: ${error?.message}`);
    }
  }
}
