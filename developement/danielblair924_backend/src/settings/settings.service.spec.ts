import { jest } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import bcrypt from 'bcryptjs';
import { SettingsService } from './settings.service.js';
import { PrismaService } from '../prisma/prisma.service.js';

describe('SettingsService', () => {
  let service: SettingsService;
  let prisma: any;

  const mockDate = new Date('2026-01-01T00:00:00.000Z');
  const mockPassword = 'CurrentPassword123!';
  const mockPasswordHash = bcrypt.hashSync(mockPassword, 10);

  const mockAdminUser = {
    id: 'admin-uuid-1',
    email: 'admin@fmc.com',
    username: 'superadmin',
    passwordHash: mockPasswordHash,
    fname: 'Super',
    lname: 'Admin',
    role: 'ADMIN',
    status: 'ACTIVE',
    avatarUrl: '/uploads/avatars/admin.png',
    notificationSettings: {
      id: 'notif-1',
      userId: 'admin-uuid-1',
      newSubmissionAlert: true,
      newRegistrationAlert: true,
      weeklySummaryEmail: false,
      eventPublishedConfirmation: true,
      badgeEarnedNotifications: false,
      createdAt: mockDate,
      updatedAt: mockDate,
    },
    sessions: [
      {
        id: 'session-1',
        userId: 'admin-uuid-1',
        device: 'Chrome on macOS',
        location: 'Dhaka, BD',
        isCurrent: true,
        expiresAt: new Date(Date.now() + 86400000),
        createdAt: mockDate,
        updatedAt: mockDate,
      },
    ],
  };

  beforeEach(async () => {
    prisma = {
      user: {
        findUnique: jest.fn(),
        update: jest.fn(),
      },
      notificationSettings: {
        findUnique: jest.fn(),
        upsert: jest.fn(),
      },
      userSession: {
        findUnique: jest.fn(),
        findMany: jest.fn(),
        delete: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SettingsService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<SettingsService>(SettingsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAdminSettings', () => {
    it('should return admin account, notification preferences, and active sessions', async () => {
      prisma.user.findUnique.mockResolvedValue(mockAdminUser);

      const result = await service.getAdminSettings('admin-uuid-1');

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: 'admin-uuid-1' },
        include: {
          notificationSettings: true,
          sessions: {
            orderBy: { createdAt: 'desc' },
          },
        },
      });

      expect(result.account).toEqual({
        id: 'admin-uuid-1',
        name: 'Super Admin',
        email: 'admin@fmc.com',
        avatarUrl: '/uploads/avatars/admin.png',
        role: 'ADMIN',
      });
      expect(result.notifications.newSubmissionAlert).toBe(true);
      expect(result.notifications.weeklySummaryEmail).toBe(false);
      expect(result.security.sessions).toHaveLength(1);
      expect(result.security.sessions[0].device).toBe('Chrome on macOS');
    });

    it('should provide default notification settings when user has no record', async () => {
      prisma.user.findUnique.mockResolvedValue({
        ...mockAdminUser,
        notificationSettings: null,
      });

      const result = await service.getAdminSettings('admin-uuid-1');

      expect(result.notifications).toEqual({
        newSubmissionAlert: true,
        newRegistrationAlert: true,
        weeklySummaryEmail: false,
        eventPublishedConfirmation: true,
        badgeEarnedNotifications: false,
      });
    });

    it('should throw NotFoundException if admin user does not exist', async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      await expect(service.getAdminSettings('unknown')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('updateAdminAccount', () => {
    it('should update name and email successfully', async () => {
      prisma.user.findUnique
        .mockResolvedValueOnce(mockAdminUser) // find admin
        .mockResolvedValueOnce(null); // email conflict check

      prisma.user.update.mockResolvedValue({
        ...mockAdminUser,
        fname: 'Chief',
        lname: 'Operator',
        email: 'chief@fmc.com',
      });

      const result = await service.updateAdminAccount('admin-uuid-1', {
        name: 'Chief Operator',
        email: 'chief@fmc.com',
      });

      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: 'admin-uuid-1' },
        data: {
          fname: 'Chief',
          lname: 'Operator',
          email: 'chief@fmc.com',
        },
      });
      expect(result.account.name).toBe('Chief Operator');
      expect(result.account.email).toBe('chief@fmc.com');
    });

    it('should validate current password and update password hash on password change', async () => {
      prisma.user.findUnique.mockResolvedValue(mockAdminUser);
      prisma.user.update.mockResolvedValue(mockAdminUser);

      const result = await service.updateAdminAccount('admin-uuid-1', {
        currentPassword: mockPassword,
        newPassword: 'BrandNewPassword456!',
        confirmNewPassword: 'BrandNewPassword456!',
      });

      expect(prisma.user.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'admin-uuid-1' },
          data: expect.objectContaining({
            passwordHash: expect.any(String),
          }),
        }),
      );
      expect(result.message).toBe('Admin account updated successfully');
    });

    it('should throw BadRequestException if newPassword is provided without currentPassword', async () => {
      prisma.user.findUnique.mockResolvedValue(mockAdminUser);

      await expect(
        service.updateAdminAccount('admin-uuid-1', {
          newPassword: 'BrandNewPassword456!',
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if confirmNewPassword does not match newPassword', async () => {
      prisma.user.findUnique.mockResolvedValue(mockAdminUser);

      await expect(
        service.updateAdminAccount('admin-uuid-1', {
          currentPassword: mockPassword,
          newPassword: 'BrandNewPassword456!',
          confirmNewPassword: 'MismatchedPassword789!',
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if currentPassword is incorrect', async () => {
      prisma.user.findUnique.mockResolvedValue(mockAdminUser);

      await expect(
        service.updateAdminAccount('admin-uuid-1', {
          currentPassword: 'WrongPassword999!',
          newPassword: 'BrandNewPassword456!',
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw ConflictException if new email is already used by another user', async () => {
      prisma.user.findUnique
        .mockResolvedValueOnce(mockAdminUser)
        .mockResolvedValueOnce({ id: 'other-user', email: 'taken@fmc.com' });

      await expect(
        service.updateAdminAccount('admin-uuid-1', {
          email: 'taken@fmc.com',
        }),
      ).rejects.toThrow(ConflictException);
    });

    it('should throw NotFoundException if admin user does not exist', async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      await expect(
        service.updateAdminAccount('unknown', { name: 'New Name' }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('getNotifications', () => {
    it('should return stored notification settings', async () => {
      prisma.notificationSettings.findUnique.mockResolvedValue({
        userId: 'admin-uuid-1',
        newSubmissionAlert: false,
        newRegistrationAlert: true,
        weeklySummaryEmail: true,
        eventPublishedConfirmation: false,
        badgeEarnedNotifications: true,
      });

      const result = await service.getNotifications('admin-uuid-1');

      expect(result.newSubmissionAlert).toBe(false);
      expect(result.weeklySummaryEmail).toBe(true);
      expect(result.badgeEarnedNotifications).toBe(true);
    });

    it('should return defaults if no settings record exists', async () => {
      prisma.notificationSettings.findUnique.mockResolvedValue(null);

      const result = await service.getNotifications('admin-uuid-1');

      expect(result).toEqual({
        newSubmissionAlert: true,
        newRegistrationAlert: true,
        weeklySummaryEmail: false,
        eventPublishedConfirmation: true,
        badgeEarnedNotifications: false,
      });
    });
  });

  describe('updateNotifications', () => {
    it('should upsert notification settings and return updated record', async () => {
      prisma.notificationSettings.upsert.mockResolvedValue({
        id: 'notif-1',
        userId: 'admin-uuid-1',
        newSubmissionAlert: false,
        newRegistrationAlert: true,
        weeklySummaryEmail: true,
        eventPublishedConfirmation: true,
        badgeEarnedNotifications: false,
      });

      const result = await service.updateNotifications('admin-uuid-1', {
        newSubmissionAlert: false,
        weeklySummaryEmail: true,
      });

      expect(prisma.notificationSettings.upsert).toHaveBeenCalledWith({
        where: { userId: 'admin-uuid-1' },
        create: expect.objectContaining({
          userId: 'admin-uuid-1',
          newSubmissionAlert: false,
          weeklySummaryEmail: true,
        }),
        update: expect.objectContaining({
          newSubmissionAlert: false,
          weeklySummaryEmail: true,
        }),
      });

      expect(result.notifications.newSubmissionAlert).toBe(false);
      expect(result.notifications.weeklySummaryEmail).toBe(true);
    });
  });

  describe('getActiveSessions', () => {
    it('should return mapped active sessions', async () => {
      prisma.userSession.findMany.mockResolvedValue([
        {
          id: 'sess-1',
          userId: 'admin-uuid-1',
          device: 'Chrome on macOS',
          location: 'Dhaka, BD',
          isCurrent: true,
          expiresAt: mockDate,
          createdAt: mockDate,
        },
      ]);

      const result = await service.getActiveSessions('admin-uuid-1');

      expect(prisma.userSession.findMany).toHaveBeenCalledWith({
        where: { userId: 'admin-uuid-1' },
        orderBy: { createdAt: 'desc' },
      });
      expect(result).toHaveLength(1);
      expect(result[0].device).toBe('Chrome on macOS');
      expect(result[0].isCurrent).toBe(true);
    });
  });

  describe('revokeSession', () => {
    it('should delete session if found and belongs to user', async () => {
      prisma.userSession.findUnique.mockResolvedValue({
        id: 'sess-1',
        userId: 'admin-uuid-1',
      });
      prisma.userSession.delete.mockResolvedValue({ id: 'sess-1' });

      const result = await service.revokeSession('admin-uuid-1', 'sess-1');

      expect(prisma.userSession.delete).toHaveBeenCalledWith({
        where: { id: 'sess-1' },
      });
      expect(result.success).toBe(true);
    });

    it('should throw NotFoundException if session does not exist or belongs to another user', async () => {
      prisma.userSession.findUnique.mockResolvedValue({
        id: 'sess-2',
        userId: 'other-user',
      });

      await expect(
        service.revokeSession('admin-uuid-1', 'sess-2'),
      ).rejects.toThrow(NotFoundException);
    });
  });
});

