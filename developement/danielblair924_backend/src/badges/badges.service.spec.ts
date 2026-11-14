import { jest } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { BadgesService } from './badges.service.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { BadgeTagType } from '../generated/prisma/enums.js';

describe('BadgesService', () => {
  let service: BadgesService;
  let prisma: any;

  const mockBadge = {
    id: 'badge-uuid-1',
    slug: 'first-5k',
    name: 'First 5K',
    description: 'Awarded for completing your first 5K run.',
    iconUrl: '/image/badge/badge1.png',
    tagType: BadgeTagType.EVENT,
    isActive: true,
    earnedCount: 284,
    createdAt: new Date('2026-01-01T00:00:00Z'),
    updatedAt: new Date('2026-01-01T00:00:00Z'),
  };

  const mockUserBadge = {
    id: 'ub-uuid-1',
    userId: 'user-uuid-1',
    badgeId: 'badge-uuid-1',
    earnedAt: new Date('2026-02-03T00:00:00Z'),
    badge: mockBadge,
  };

  beforeEach(async () => {
    prisma = {
      badge: {
        count: jest.fn(),
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        findFirst: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
      userBadge: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
        create: jest.fn(),
        delete: jest.fn(),
      },
      user: {
        findUnique: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BadgesService,
        {
          provide: PrismaService,
          useValue: prisma,
        },
      ],
    }).compile();

    service = module.get<BadgesService>(BadgesService);
  });

  describe('seedInitialBadges', () => {
    it('should seed initial badges when table is empty', async () => {
      prisma.badge.count.mockResolvedValue(0);
      prisma.badge.create.mockResolvedValue(mockBadge);

      await service.seedInitialBadges();

      expect(prisma.badge.count).toHaveBeenCalled();
      expect(prisma.badge.create).toHaveBeenCalledTimes(8);
    });

    it('should skip seeding if badges already exist', async () => {
      prisma.badge.count.mockResolvedValue(8);

      await service.seedInitialBadges();

      expect(prisma.badge.count).toHaveBeenCalled();
      expect(prisma.badge.create).not.toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return paginated badges formatted properly', async () => {
      prisma.badge.count.mockResolvedValue(1);
      prisma.badge.findMany.mockResolvedValue([mockBadge]);

      const result = await service.findAll({ page: 1, limit: 10 });

      expect(result.status).toBe('success');
      expect(result.data).toHaveLength(1);
      expect(result.data[0].id).toBe('badge-uuid-1');
      expect(result.data[0].title).toBe('First 5K');
      expect(result.data[0].tag.label).toBe('Event');
      expect(result.pagination.totalItems).toBe(1);
    });

    it('should apply filters for tagType and isActive', async () => {
      prisma.badge.count.mockResolvedValue(1);
      prisma.badge.findMany.mockResolvedValue([mockBadge]);

      await service.findAll({
        tagType: BadgeTagType.EVENT,
        isActive: true,
        search: '5K',
      });

      expect(prisma.badge.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            tagType: BadgeTagType.EVENT,
            isActive: true,
          }),
        }),
      );
    });
  });

  describe('findByIdOrSlug', () => {
    it('should return formatted badge when found by slug', async () => {
      prisma.badge.findFirst.mockResolvedValue(mockBadge);

      const result = await service.findByIdOrSlug('first-5k');

      expect(result.status).toBe('success');
      expect(result.data.slug).toBe('first-5k');
    });

    it('should throw NotFoundException when badge does not exist', async () => {
      prisma.badge.findFirst.mockResolvedValue(null);

      await expect(service.findByIdOrSlug('non-existent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('create', () => {
    it('should create badge and auto-generate slug', async () => {
      prisma.badge.findUnique.mockResolvedValue(null);
      prisma.badge.create.mockResolvedValue(mockBadge);

      const result = await service.create({
        name: 'First 5K',
        description: 'Awarded for completing your first 5K run.',
      });

      expect(result.status).toBe('success');
      expect(prisma.badge.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            slug: 'first-5k',
            name: 'First 5K',
          }),
        }),
      );
    });

    it('should throw ConflictException if slug already exists', async () => {
      prisma.badge.findUnique.mockResolvedValue(mockBadge);

      await expect(
        service.create({
          name: 'First 5K',
          description: 'Awarded for completing your first 5K run.',
          slug: 'first-5k',
        }),
      ).rejects.toThrow(ConflictException);
    });

    it('should throw BadRequestException if name is missing', async () => {
      await expect(
        service.create({
          description: 'Some description',
        } as any),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('update', () => {
    it('should update badge successfully', async () => {
      prisma.badge.findFirst.mockResolvedValue(mockBadge);
      prisma.badge.update.mockResolvedValue({
        ...mockBadge,
        name: 'First 5K Updated',
      });

      const result = await service.update('first-5k', {
        name: 'First 5K Updated',
      });

      expect(result.status).toBe('success');
      expect(prisma.badge.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: mockBadge.id },
          data: expect.objectContaining({ name: 'First 5K Updated' }),
        }),
      );
    });

    it('should throw ConflictException when updating to an existing slug', async () => {
      prisma.badge.findFirst.mockResolvedValue(mockBadge);
      prisma.badge.findUnique.mockResolvedValue({
        id: 'other-uuid',
        slug: 'new-slug',
      });

      await expect(
        service.update('first-5k', { slug: 'new-slug' }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('delete', () => {
    it('should delete existing badge', async () => {
      prisma.badge.findFirst.mockResolvedValue(mockBadge);
      prisma.badge.delete.mockResolvedValue(mockBadge);

      const result = await service.delete('first-5k');

      expect(result.status).toBe('success');
      expect(prisma.badge.delete).toHaveBeenCalledWith({
        where: { id: mockBadge.id },
      });
    });
  });

  describe('getMyBadges', () => {
    it('should return unlocked and locked badges for runner', async () => {
      const lockedBadge = {
        ...mockBadge,
        id: 'badge-uuid-2',
        slug: '10k-finisher',
        name: '10K Finisher',
      };

      prisma.badge.findMany.mockResolvedValue([mockBadge, lockedBadge]);
      prisma.userBadge.findMany.mockResolvedValue([mockUserBadge]);

      const result = await service.getMyBadges('user-uuid-1');

      expect(result.status).toBe('success');
      expect(result.data.totalEarned).toBe(1);
      expect(result.data.totalAvailable).toBe(2);
      expect(result.data.completionPercentage).toBe(50);
      expect(result.data.unlocked).toHaveLength(1);
      expect(result.data.unlocked[0].isUnlocked).toBe(true);
      expect(result.data.locked).toHaveLength(1);
      expect(result.data.locked[0].isUnlocked).toBe(false);
    });
  });

  describe('getBadgeBySlug', () => {
    it('should return badge with unlocked status for runner', async () => {
      prisma.badge.findFirst.mockResolvedValue(mockBadge);
      prisma.userBadge.findUnique.mockResolvedValue(mockUserBadge);

      const result = await service.getBadgeBySlug('first-5k', 'user-uuid-1');

      expect(result.status).toBe('success');
      expect(result.data.slug).toBe('first-5k');
      expect(result.data.isUnlocked).toBe(true);
      expect(result.data.earnedAt).toEqual(mockUserBadge.earnedAt);
    });
  });

  describe('getUserBadges', () => {
    it('should return formatted records matching BadgesPage.tsx', async () => {
      prisma.user.findUnique.mockResolvedValue({ id: 'user-uuid-1' });
      prisma.userBadge.findMany.mockResolvedValue([mockUserBadge]);

      const result = await service.getUserBadges('user-uuid-1');

      expect(result.status).toBe('success');
      expect(result.data).toHaveLength(1);
      expect(result.data[0].badge).toBe('/image/badge/badge1.png');
      expect(result.data[0].name).toBe('First 5K');
      expect(result.data[0].earnedOn).toBeDefined();
    });

    it('should throw NotFoundException if user does not exist', async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      await expect(service.getUserBadges('invalid-user')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('awardBadge', () => {
    it('should award badge to user and increment count', async () => {
      prisma.user.findUnique.mockResolvedValue({ id: 'user-uuid-1' });
      prisma.badge.findFirst.mockResolvedValue(mockBadge);
      prisma.userBadge.findUnique.mockResolvedValue(null);
      prisma.userBadge.create.mockResolvedValue(mockUserBadge);
      prisma.badge.update.mockResolvedValue({
        ...mockBadge,
        earnedCount: mockBadge.earnedCount + 1,
      });

      const result = await service.awardBadge('user-uuid-1', 'first-5k');

      expect(result.status).toBe('success');
      expect(result.data.alreadyAwarded).toBe(false);
      expect(prisma.badge.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: { earnedCount: { increment: 1 } },
        }),
      );
    });

    it('should return alreadyAwarded true if user already has badge', async () => {
      prisma.user.findUnique.mockResolvedValue({ id: 'user-uuid-1' });
      prisma.badge.findFirst.mockResolvedValue(mockBadge);
      prisma.userBadge.findUnique.mockResolvedValue(mockUserBadge);

      const result = await service.awardBadge('user-uuid-1', 'first-5k');

      expect(result.status).toBe('success');
      expect(result.data.alreadyAwarded).toBe(true);
      expect(prisma.userBadge.create).not.toHaveBeenCalled();
    });
  });

  describe('revokeBadge', () => {
    it('should revoke badge and decrement count', async () => {
      prisma.badge.findFirst.mockResolvedValue(mockBadge);
      prisma.userBadge.findUnique.mockResolvedValue(mockUserBadge);
      prisma.userBadge.delete.mockResolvedValue(mockUserBadge);
      prisma.badge.update.mockResolvedValue({
        ...mockBadge,
        earnedCount: mockBadge.earnedCount - 1,
      });

      const result = await service.revokeBadge('user-uuid-1', 'first-5k');

      expect(result.status).toBe('success');
      expect(prisma.userBadge.delete).toHaveBeenCalledWith({
        where: { id: mockUserBadge.id },
      });
      expect(prisma.badge.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: { earnedCount: mockBadge.earnedCount - 1 },
        }),
      );
    });

    it('should throw NotFoundException if user does not have badge', async () => {
      prisma.badge.findFirst.mockResolvedValue(mockBadge);
      prisma.userBadge.findUnique.mockResolvedValue(null);

      await expect(
        service.revokeBadge('user-uuid-1', 'first-5k'),
      ).rejects.toThrow(NotFoundException);
    });
  });
});

