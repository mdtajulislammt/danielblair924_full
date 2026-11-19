import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { FirebaseService } from './firebase.service.js';
import { NotificationsGateway } from './notifications.gateway.js';
import { NotificationType } from '../generated/prisma/client.js';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly firebase: FirebaseService,
    private readonly gateway: NotificationsGateway,
  ) {}

  /**
   * Helper to evaluate whether user's preferences permit push for this notification type
   */
  private shouldSendPush(settings: any, type: NotificationType): boolean {
    if (!settings) return true;
    if (settings.pushEnabled === false) return false;

    switch (type) {
      case 'SUBMISSION_APPROVED':
      case 'SUBMISSION_REJECTED':
      case 'STRAVA_RUN_SYNCED':
        return settings.submissionUpdates !== false;
      case 'BADGE_EARNED':
        return settings.badgeEarnedNotifications !== false;
      case 'EVENT_PUBLISHED':
        return settings.newEvents !== false;
      case 'CHALLENGE_LAUNCHED':
        return settings.newChallenges !== false;
      case 'NEWS_PUBLISHED':
        return settings.newsUpdates !== false;
      case 'SUBMISSION_NEW':
        return settings.newSubmissionAlert !== false;
      case 'MEMBER_REGISTERED':
        return settings.newRegistrationAlert !== false;
      default:
        return true;
    }
  }

  /**
   * Notify single user (In-app notification + WebSocket + FCM Push)
   */
  async notifyUser(
    userId: string,
    type: NotificationType,
    title: string,
    body: string,
    data?: Record<string, any>,
  ): Promise<void> {
    try {
      // 1. Fetch user notification settings
      const settings = await this.prisma.notificationSettings.findUnique({
        where: { userId },
      });

      // 2. Always create in-app notification row
      const notification = await this.prisma.notification.create({
        data: {
          userId,
          type,
          title,
          body,
          data: data ? data : undefined,
        },
      });

      // 3. Count unread notifications
      const unreadCount = await this.prisma.notification.count({
        where: { userId, isRead: false },
      });

      // 4. Emit via WebSocket
      this.gateway.emitToUser(userId, 'notification:new', notification);
      this.gateway.emitToUser(userId, 'notification:count', { count: unreadCount });

      // 5. Send FCM Push if allowed
      if (this.shouldSendPush(settings, type)) {
        const deviceTokens = await this.prisma.deviceToken.findMany({
          where: { userId },
          select: { token: true },
        });

        if (deviceTokens.length > 0) {
          const tokens = deviceTokens.map((d) => d.token);
          await this.firebase.sendToTokens(tokens, {
            title,
            body,
            data: data as Record<string, string>,
            badge: unreadCount,
          });
        }
      }
    } catch (err: any) {
      this.logger.error(`Failed to send notification to user ${userId}: ${err?.message}`, err?.stack);
    }
  }

  /**
   * Notify administrators (ADMIN and SUPERADMIN)
   */
  async notifyAdmins(
    type: NotificationType,
    title: string,
    body: string,
    data?: Record<string, any>,
  ): Promise<void> {
    try {
      const admins = await this.prisma.user.findMany({
        where: {
          role: { in: ['ADMIN', 'SUPERADMIN'] },
          status: 'ACTIVE',
        },
        select: { id: true },
      });

      for (const admin of admins) {
        await this.notifyUser(admin.id, type, title, body, data);
      }

      if (type === 'SUBMISSION_NEW') {
        this.gateway.emitToAdmins('dashboard:refresh', { scope: 'submissions' });
      } else if (type === 'MEMBER_REGISTERED') {
        this.gateway.emitToAdmins('dashboard:refresh', { scope: 'members' });
      }
    } catch (err: any) {
      this.logger.error(`Failed to notify admins: ${err?.message}`, err?.stack);
    }
  }

  /**
   * Broadcast notification to all active club members in batches of 500
   */
  async notifyAllMembers(
    type: NotificationType,
    title: string,
    body: string,
    data?: Record<string, any>,
  ): Promise<void> {
    try {
      const batchSize = 500;
      let skip = 0;
      let hasMore = true;

      while (hasMore) {
        const members = await this.prisma.user.findMany({
          where: { role: 'MEMBER', status: 'ACTIVE' },
          select: { id: true },
          skip,
          take: batchSize,
        });

        if (!members.length) {
          hasMore = false;
          break;
        }

        for (const m of members) {
          await this.notifyUser(m.id, type, title, body, data);
        }

        skip += batchSize;
        if (members.length < batchSize) {
          hasMore = false;
        }
      }
    } catch (err: any) {
      this.logger.error(`Failed to broadcast to all members: ${err?.message}`, err?.stack);
    }
  }

  /**
   * Get paginated notifications for current user
   */
  async getNotifications(
    userId: string,
    page = 1,
    limit = 10,
    unreadOnly = false,
  ) {
    const p = Math.max(1, page);
    const l = Math.max(1, Math.min(100, limit));
    const skip = (p - 1) * l;

    const where: any = { userId };
    if (unreadOnly) {
      where.isRead = false;
    }

    const [totalItems, items, unreadCount] = await Promise.all([
      this.prisma.notification.count({ where }),
      this.prisma.notification.findMany({
        where,
        skip,
        take: l,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.notification.count({
        where: { userId, isRead: false },
      }),
    ]);

    const totalPages = Math.ceil(totalItems / l) || 1;

    return {
      status: 'success' as const,
      data: {
        items,
        pagination: {
          totalItems,
          currentPage: p,
          totalPages,
          itemsPerPage: l,
        },
        unreadCount,
      },
      message: 'Notifications retrieved successfully',
    };
  }

  async getUnreadCount(userId: string) {
    const count = await this.prisma.notification.count({
      where: { userId, isRead: false },
    });
    return {
      status: 'success' as const,
      data: { count },
      message: 'Unread count retrieved',
    };
  }

  async markAsRead(userId: string, notificationId: string) {
    const notification = await this.prisma.notification.findFirst({
      where: { id: notificationId, userId },
    });

    if (notification && !notification.isRead) {
      await this.prisma.notification.update({
        where: { id: notificationId },
        data: { isRead: true, readAt: new Date() },
      });
    }

    const unreadCount = await this.prisma.notification.count({
      where: { userId, isRead: false },
    });

    this.gateway.emitToUser(userId, 'notification:count', { count: unreadCount });

    return {
      status: 'success' as const,
      data: { unreadCount },
      message: 'Notification marked as read',
    };
  }

  async markAllAsRead(userId: string) {
    await this.prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true, readAt: new Date() },
    });

    this.gateway.emitToUser(userId, 'notification:count', { count: 0 });

    return {
      status: 'success' as const,
      data: { unreadCount: 0 },
      message: 'All notifications marked as read',
    };
  }

  async deleteNotification(userId: string, notificationId: string) {
    await this.prisma.notification.deleteMany({
      where: { id: notificationId, userId },
    });

    const unreadCount = await this.prisma.notification.count({
      where: { userId, isRead: false },
    });

    this.gateway.emitToUser(userId, 'notification:count', { count: unreadCount });

    return {
      status: 'success' as const,
      message: 'Notification deleted successfully',
    };
  }

  async registerDeviceToken(userId: string, token: string, platform: string) {
    await this.prisma.deviceToken.upsert({
      where: { token },
      update: {
        userId,
        platform,
        lastSeenAt: new Date(),
      },
      create: {
        userId,
        token,
        platform,
        lastSeenAt: new Date(),
      },
    });

    return {
      status: 'success' as const,
      message: 'Device token registered successfully',
    };
  }

  async unregisterDeviceToken(userId: string, token: string) {
    await this.prisma.deviceToken.deleteMany({
      where: { token, userId },
    });

    return {
      status: 'success' as const,
      message: 'Device token unregistered successfully',
    };
  }
}

