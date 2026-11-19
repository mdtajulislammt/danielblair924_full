import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service.js';
import { UpdateAdminAccountDto } from './dto/update-admin-account.dto.js';
import { UpdateNotificationSettingsDto } from './dto/update-notifications.dto.js';

@Injectable()
export class SettingsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Retrieve administrative settings including account details,
   * alert notification preferences, and active browser sessions.
   */
  async getAdminSettings(userId: string, currentSid?: string) {
    const now = new Date();
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        notificationSettings: true,
        sessions: {
          where: { expiresAt: { gt: now } },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('Admin user not found');
    }

    const fullName =
      [user.fname, user.lname].filter(Boolean).join(' ') ||
      user.username ||
      'Admin User';

    return {
      status: 'success',
      data: {
        account: {
          id: user.id,
          name: fullName,
          email: user.email,
          avatarUrl: user.avatarUrl,
          role: user.role,
        },
        notifications: {
          newSubmissionAlert:
            user.notificationSettings?.newSubmissionAlert ?? true,
          newRegistrationAlert:
            user.notificationSettings?.newRegistrationAlert ?? true,
          weeklySummaryEmail:
            user.notificationSettings?.weeklySummaryEmail ?? false,
          eventPublishedConfirmation:
            user.notificationSettings?.eventPublishedConfirmation ?? true,
          badgeEarnedNotifications:
            user.notificationSettings?.badgeEarnedNotifications ?? false,
        },
        security: {
          enable2FA: false,
          twoFactorAvailable: false,
          sessions: (user.sessions || []).map((session) => ({
            id: session.id,
            device: session.device,
            location: session.location || 'Unknown Location',
            isCurrent: currentSid ? session.id === currentSid : session.isCurrent,
            createdAt: session.createdAt,
            expiresAt: session.expiresAt,
          })),
        },
      },
    };
  }

  /**
   * Update administrator account credentials (name, email, password)
   * with current password verification and email uniqueness checks.
   */
  async updateAdminAccount(
    userId: string,
    dto: UpdateAdminAccountDto,
    currentSid?: string,
  ) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('Admin user not found');
    }

    let passwordHashUpdate: string | undefined;

    // Validate password change if requested
    if (dto.newPassword) {
      if (!dto.currentPassword) {
        throw new BadRequestException(
          'Current password is required to set a new password.',
        );
      }

      if (dto.newPassword.length < 8) {
        throw new BadRequestException('New password must be at least 8 characters.');
      }

      if (
        dto.confirmNewPassword !== undefined &&
        dto.confirmNewPassword !== dto.newPassword
      ) {
        throw new BadRequestException('Passwords do not match.');
      }

      const isCurrentValid = await bcrypt.compare(
        dto.currentPassword,
        user.passwordHash,
      );
      if (!isCurrentValid) {
        throw new BadRequestException('Current password is incorrect.');
      }

      if (dto.newPassword === dto.currentPassword) {
        throw new BadRequestException('New password must be different from current password.');
      }

      passwordHashUpdate = await bcrypt.hash(dto.newPassword, 10);
    }

    // Validate email change if requested
    if (
      dto.email &&
      dto.email.toLowerCase().trim() !== user.email.toLowerCase().trim()
    ) {
      const normalizedEmail = dto.email.toLowerCase().trim();
      const existing = await this.prisma.user.findUnique({
        where: { email: normalizedEmail },
      });
      if (existing && existing.id !== user.id) {
        throw new ConflictException('Email is already taken.');
      }
    }

    let fnameUpdate: string | undefined;
    let lnameUpdate: string | undefined;

    if (dto.name !== undefined) {
      const nameParts = dto.name.trim().split(/\s+/);
      fnameUpdate = nameParts[0] || '';
      lnameUpdate = nameParts.slice(1).join(' ') || '';
    }

    const updated = await this.prisma.user.update({
      where: { id: userId },
      data: {
        ...(dto.name !== undefined && { fname: fnameUpdate, lname: lnameUpdate }),
        ...(dto.email !== undefined && {
          email: dto.email.toLowerCase().trim(),
        }),
        ...(passwordHashUpdate && { passwordHash: passwordHashUpdate }),
      },
    });

    // If password changed, revoke other sessions
    if (passwordHashUpdate) {
      await this.prisma.userSession.deleteMany({
        where: {
          userId,
          ...(currentSid ? { id: { not: currentSid } } : {}),
        },
      });
    }

    const updatedName =
      [updated.fname, updated.lname].filter(Boolean).join(' ') ||
      updated.username ||
      'Admin User';

    return {
      status: 'success',
      message: 'Admin account updated successfully',
      data: {
        account: {
          id: updated.id,
          name: updatedName,
          email: updated.email,
          avatarUrl: updated.avatarUrl,
          role: updated.role,
        },
      },
    };
  }

  /**
   * Get notification preferences for a user.
   */
  async getNotifications(userId: string) {
    const settings = await this.prisma.notificationSettings.findUnique({
      where: { userId },
    });

    return {
      status: 'success',
      data: {
        newSubmissionAlert: settings?.newSubmissionAlert ?? true,
        newRegistrationAlert: settings?.newRegistrationAlert ?? true,
        weeklySummaryEmail: settings?.weeklySummaryEmail ?? false,
        eventPublishedConfirmation:
          settings?.eventPublishedConfirmation ?? true,
        badgeEarnedNotifications:
          settings?.badgeEarnedNotifications ?? false,
        pushEnabled: settings?.pushEnabled ?? true,
        submissionUpdates: settings?.submissionUpdates ?? true,
        newEvents: settings?.newEvents ?? true,
        newChallenges: settings?.newChallenges ?? true,
        newsUpdates: settings?.newsUpdates ?? true,
      },
    };
  }

  /**
   * Upsert notification alert preferences for an administrator or user.
   */
  async updateNotifications(
    userId: string,
    dto: UpdateNotificationSettingsDto,
  ) {
    const settings = await this.prisma.notificationSettings.upsert({
      where: { userId },
      create: {
        userId,
        newSubmissionAlert: dto.newSubmissionAlert ?? true,
        newRegistrationAlert: dto.newRegistrationAlert ?? true,
        weeklySummaryEmail: dto.weeklySummaryEmail ?? false,
        eventPublishedConfirmation:
          dto.eventPublishedConfirmation ?? true,
        badgeEarnedNotifications:
          dto.badgeEarnedNotifications ?? false,
        pushEnabled: dto.pushEnabled ?? true,
        submissionUpdates: dto.submissionUpdates ?? true,
        newEvents: dto.newEvents ?? true,
        newChallenges: dto.newChallenges ?? true,
        newsUpdates: dto.newsUpdates ?? true,
      },
      update: {
        ...(dto.newSubmissionAlert !== undefined && {
          newSubmissionAlert: dto.newSubmissionAlert,
        }),
        ...(dto.newRegistrationAlert !== undefined && {
          newRegistrationAlert: dto.newRegistrationAlert,
        }),
        ...(dto.weeklySummaryEmail !== undefined && {
          weeklySummaryEmail: dto.weeklySummaryEmail,
        }),
        ...(dto.eventPublishedConfirmation !== undefined && {
          eventPublishedConfirmation: dto.eventPublishedConfirmation,
        }),
        ...(dto.badgeEarnedNotifications !== undefined && {
          badgeEarnedNotifications: dto.badgeEarnedNotifications,
        }),
        ...(dto.pushEnabled !== undefined && {
          pushEnabled: dto.pushEnabled,
        }),
        ...(dto.submissionUpdates !== undefined && {
          submissionUpdates: dto.submissionUpdates,
        }),
        ...(dto.newEvents !== undefined && {
          newEvents: dto.newEvents,
        }),
        ...(dto.newChallenges !== undefined && {
          newChallenges: dto.newChallenges,
        }),
        ...(dto.newsUpdates !== undefined && {
          newsUpdates: dto.newsUpdates,
        }),
      },
    });

    return {
      status: 'success',
      message: 'Notification preferences updated successfully',
      data: {
        notifications: {
          newSubmissionAlert: settings.newSubmissionAlert,
          newRegistrationAlert: settings.newRegistrationAlert,
          weeklySummaryEmail: settings.weeklySummaryEmail,
          eventPublishedConfirmation: settings.eventPublishedConfirmation,
          badgeEarnedNotifications: settings.badgeEarnedNotifications,
          pushEnabled: settings.pushEnabled,
          submissionUpdates: settings.submissionUpdates,
          newEvents: settings.newEvents,
          newChallenges: settings.newChallenges,
          newsUpdates: settings.newsUpdates,
        },
      },
    };
  }

  /**
   * Get list of active logged-in browser/device sessions.
   */
  async getActiveSessions(userId: string, currentSid?: string) {
    const sessions = await this.prisma.userSession.findMany({
      where: {
        userId,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: 'desc' },
    });

    return {
      status: 'success',
      data: sessions.map((session) => ({
        id: session.id,
        device: session.device,
        location: session.location || 'Unknown Location',
        isCurrent: currentSid ? session.id === currentSid : session.isCurrent,
        createdAt: session.createdAt,
        expiresAt: session.expiresAt,
      })),
    };
  }

  /**
   * Revoke an active security session by ID.
   */
  async revokeSession(userId: string, sessionId: string, currentSid?: string) {
    if (currentSid && sessionId === currentSid) {
      throw new BadRequestException('Use logout to end the current session');
    }

    const session = await this.prisma.userSession.findUnique({
      where: { id: sessionId },
    });

    if (!session || session.userId !== userId) {
      throw new NotFoundException(
        'Session not found or does not belong to you',
      );
    }

    await this.prisma.userSession.delete({
      where: { id: sessionId },
    });

    return {
      status: 'success',
      message: 'Session revoked successfully',
      data: null,
    };
  }

  /**
   * Delete other active sessions for this user, keeping currentSid.
   */
  async deleteOtherSessions(userId: string, currentSid?: string) {
    await this.prisma.userSession.deleteMany({
      where: {
        userId,
        ...(currentSid ? { id: { not: currentSid } } : {}),
      },
    });

    return {
      status: 'success',
      message: 'Other sessions logged out successfully',
      data: null,
    };
  }
}

