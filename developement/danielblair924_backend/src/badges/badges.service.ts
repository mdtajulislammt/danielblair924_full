import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateBadgeDto } from './dto/create-badge.dto.js';
import { UpdateBadgeDto } from './dto/update-badge.dto.js';
import { BadgeQueryDto } from './dto/badge-query.dto.js';
import { BadgeTagType } from '../generated/prisma/enums.js';

export interface FormattedBadge {
  id: string;
  slug: string;
  name: string;
  title: string;
  description: string;
  icon: string;
  iconUrl: string;
  isActive: boolean;
  tagType: BadgeTagType;
  tag: {
    label: string;
    type: string;
  };
  earnedCount: number;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable()
export class BadgesService implements OnModuleInit {
  constructor(private readonly prisma: PrismaService) {}

  async onModuleInit() {
    await this.seedInitialBadges();
  }

  // ---------------------------------------------------------------------------
  // INITIAL SEEDING
  // ---------------------------------------------------------------------------

  async seedInitialBadges(): Promise<void> {
    try {
      const count = await this.prisma.badge.count();
      if (count > 0) return;

      const initialBadges: Array<{
        slug: string;
        name: string;
        description: string;
        iconUrl: string;
        tagType: BadgeTagType;
        isActive: boolean;
        earnedCount: number;
      }> = [
        {
          slug: 'first-5k',
          name: 'First 5K',
          description: 'Awarded for completing your first 5K run.',
          iconUrl: '/image/badge/badge1.png',
          tagType: 'EVENT',
          isActive: true,
          earnedCount: 284,
        },
        {
          slug: '10k-finisher',
          name: '10K Finisher',
          description: 'Awarded for completing a 10K run.',
          iconUrl: '/image/badge/badge2.png',
          tagType: 'EVENT',
          isActive: true,
          earnedCount: 156,
        },
        {
          slug: 'consistent-runner',
          name: 'Consistent Runner',
          description: 'Awarded for running consistently over a month.',
          iconUrl: '/image/badge/badge3.png',
          tagType: 'EVENT',
          isActive: true,
          earnedCount: 97,
        },
        {
          slug: 'ratw-participant',
          name: 'RATW Participant',
          description: 'Awarded for participating in RATW.',
          iconUrl: '/image/badge/badge4.png',
          tagType: 'RATW',
          isActive: true,
          earnedCount: 512,
        },
        {
          slug: 'speed-demon',
          name: 'Speed Demon',
          description: 'Awarded for achieving a fast pace.',
          iconUrl: '/image/badge/badge5.png',
          tagType: 'EVENT',
          isActive: true,
          earnedCount: 63,
        },
        {
          slug: 'half-marathon',
          name: 'Half Marathon',
          description: 'Awarded for completing a half marathon.',
          iconUrl: '/image/badge/badge6.png',
          tagType: 'EVENT',
          isActive: true,
          earnedCount: 42,
        },
        {
          slug: 'ratw-champion',
          name: 'RATW Champion',
          description: 'Awarded for winning RATW.',
          iconUrl: '/image/badge/badge7.png',
          tagType: 'RATW',
          isActive: true,
          earnedCount: 18,
        },
        {
          slug: 'iron-athlete',
          name: 'Iron Athlete',
          description: 'Awarded for exceptional endurance.',
          iconUrl: '/image/badge/badge8.png',
          tagType: 'RATW',
          isActive: true,
          earnedCount: 29,
        },
      ];

      for (const badge of initialBadges) {
        await this.prisma.badge.create({ data: badge });
      }
    } catch {
      // Non-blocking in case migrations are still running
    }
  }

  // ---------------------------------------------------------------------------
  // BADGES CRUD & QUERIES
  // ---------------------------------------------------------------------------

  async findAll(query?: BadgeQueryDto) {
    const page = Number(query?.page) || 1;
    const limit = Number(query?.limit) || 50;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (query?.isActive !== undefined) {
      where.isActive = query.isActive;
    }

    if (query?.tagType) {
      where.tagType = query.tagType;
    }

    if (query?.search) {
      where.OR = [
        { name: { contains: query.search, mode: 'insensitive' } },
        { description: { contains: query.search, mode: 'insensitive' } },
        { slug: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    const [totalItems, items] = await Promise.all([
      this.prisma.badge.count({ where }),
      this.prisma.badge.findMany({
        where,
        skip,
        take: limit,
        orderBy: [{ tagType: 'asc' }, { earnedCount: 'desc' }],
      }),
    ]);

    const formatted = items.map((item) => this.formatBadge(item));

    return {
      status: 'success' as const,
      data: formatted,
      pagination: {
        page,
        limit,
        totalItems,
        totalPages: Math.ceil(totalItems / limit),
      },
    };
  }

  async findByIdOrSlug(idOrSlug: string) {
    const badge = await this.resolveBadge(idOrSlug);
    return {
      status: 'success' as const,
      data: this.formatBadge(badge),
    };
  }

  async create(dto: CreateBadgeDto, fileUrl?: string) {
    const name = dto.name || dto.title;
    if (!name) {
      throw new BadRequestException('Badge name is required');
    }

    const slug = dto.slug ? this.slugify(dto.slug) : this.slugify(name);

    const existing = await this.prisma.badge.findUnique({
      where: { slug },
    });
    if (existing) {
      throw new ConflictException(`Badge with slug "${slug}" already exists`);
    }

    const iconUrl = fileUrl || dto.iconUrl || dto.icon || '/image/badge/badge1.png';
    const tagType = dto.tagType || BadgeTagType.EVENT;
    const isActive = dto.isActive !== undefined ? dto.isActive : true;

    const badge = await this.prisma.badge.create({
      data: {
        slug,
        name,
        description: dto.description,
        iconUrl,
        tagType,
        isActive,
        earnedCount: 0,
      },
    });

    return {
      status: 'success' as const,
      data: this.formatBadge(badge),
      message: 'Badge created successfully',
    };
  }

  async update(idOrSlug: string, dto: UpdateBadgeDto, fileUrl?: string) {
    const existing = await this.resolveBadge(idOrSlug);

    const updateData: any = {};

    if (dto.name || dto.title) {
      updateData.name = dto.name || dto.title;
    }

    if (dto.description) {
      updateData.description = dto.description;
    }

    if (fileUrl || dto.iconUrl || dto.icon) {
      updateData.iconUrl = fileUrl || dto.iconUrl || dto.icon;
    }

    if (dto.tagType) {
      updateData.tagType = dto.tagType;
    }

    if (dto.isActive !== undefined) {
      updateData.isActive = dto.isActive;
    }

    if (dto.slug && dto.slug !== existing.slug) {
      const newSlug = this.slugify(dto.slug);
      const duplicate = await this.prisma.badge.findUnique({
        where: { slug: newSlug },
      });
      if (duplicate && duplicate.id !== existing.id) {
        throw new ConflictException(`Badge slug "${newSlug}" is already in use`);
      }
      updateData.slug = newSlug;
    }

    const updated = await this.prisma.badge.update({
      where: { id: existing.id },
      data: updateData,
    });

    return {
      status: 'success' as const,
      data: this.formatBadge(updated),
      message: 'Badge updated successfully',
    };
  }

  async delete(idOrSlug: string) {
    const badge = await this.resolveBadge(idOrSlug);

    await this.prisma.badge.delete({
      where: { id: badge.id },
    });

    return {
      status: 'success' as const,
      message: `Badge "${badge.name}" removed successfully`,
    };
  }

  // ---------------------------------------------------------------------------
  // RUNNER GAMIFICATION SHOWCASE (MOB-007)
  // ---------------------------------------------------------------------------

  async getMyBadges(userId: string) {
    // 1. Fetch all active badges
    const allBadges = await this.prisma.badge.findMany({
      where: { isActive: true },
      orderBy: [{ tagType: 'asc' }, { earnedCount: 'desc' }],
    });

    // 2. Fetch badges user has earned
    const userBadges = await this.prisma.userBadge.findMany({
      where: { userId },
      include: { badge: true },
      orderBy: { earnedAt: 'desc' },
    });

    const earnedBadgeIds = new Map<string, Date>();
    for (const ub of userBadges) {
      earnedBadgeIds.set(ub.badgeId, ub.earnedAt);
    }

    const unlocked: Array<FormattedBadge & { earnedAt: Date; isUnlocked: true }> = [];
    const locked: Array<FormattedBadge & { earnedAt: null; isUnlocked: false }> = [];

    for (const badge of allBadges) {
      const formatted = this.formatBadge(badge);
      if (earnedBadgeIds.has(badge.id)) {
        unlocked.push({
          ...formatted,
          earnedAt: earnedBadgeIds.get(badge.id)!,
          isUnlocked: true,
        });
      } else {
        locked.push({
          ...formatted,
          earnedAt: null,
          isUnlocked: false,
        });
      }
    }

    const totalAvailable = allBadges.length;
    const totalEarned = unlocked.length;
    const completionPercentage =
      totalAvailable > 0 ? Math.round((totalEarned / totalAvailable) * 100) : 0;

    return {
      status: 'success' as const,
      data: {
        totalEarned,
        totalAvailable,
        completionPercentage,
        unlocked,
        locked,
        badges: [...unlocked, ...locked],
      },
    };
  }

  async getBadgeBySlug(slugOrId: string, userId?: string) {
    const badge = await this.resolveBadge(slugOrId);
    const formatted = this.formatBadge(badge);

    let isUnlocked = false;
    let earnedAt: Date | null = null;

    if (userId) {
      const userBadge = await this.prisma.userBadge.findUnique({
        where: {
          userId_badgeId: {
            userId,
            badgeId: badge.id,
          },
        },
      });
      if (userBadge) {
        isUnlocked = true;
        earnedAt = userBadge.earnedAt;
      }
    }

    return {
      status: 'success' as const,
      data: {
        ...formatted,
        isUnlocked,
        earnedAt,
      },
    };
  }

  // ---------------------------------------------------------------------------
  // MEMBER BADGES (Matching BadgesPage.tsx)
  // ---------------------------------------------------------------------------

  async getUserBadges(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, fname: true, lname: true },
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const userBadges = await this.prisma.userBadge.findMany({
      where: { userId },
      include: { badge: true },
      orderBy: { earnedAt: 'desc' },
    });

    const records = userBadges.map((ub, index) => ({
      id: ub.id,
      badgeIndex: index + 1,
      badge: ub.badge.iconUrl,
      iconUrl: ub.badge.iconUrl,
      name: ub.badge.name,
      title: ub.badge.name,
      description: ub.badge.description,
      tagType: ub.badge.tagType,
      earnedOn: this.formatDate(ub.earnedAt),
      earnedAt: ub.earnedAt,
    }));

    return {
      status: 'success' as const,
      data: records,
    };
  }

  // ---------------------------------------------------------------------------
  // AWARD & REVOKE BADGES
  // ---------------------------------------------------------------------------

  async awardBadge(userId: string, badgeIdOrSlug: string) {
    const [user, badge] = await Promise.all([
      this.prisma.user.findUnique({ where: { id: userId } }),
      this.resolveBadge(badgeIdOrSlug),
    ]);

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const existing = await this.prisma.userBadge.findUnique({
      where: {
        userId_badgeId: {
          userId,
          badgeId: badge.id,
        },
      },
    });

    if (existing) {
      return {
        status: 'success' as const,
        data: {
          id: existing.id,
          badgeId: badge.id,
          badgeName: badge.name,
          alreadyAwarded: true,
          earnedAt: existing.earnedAt,
        },
        message: `User already has badge "${badge.name}"`,
      };
    }

    const userBadge = await this.prisma.userBadge.create({
      data: {
        userId,
        badgeId: badge.id,
      },
      include: {
        badge: true,
      },
    });

    await this.prisma.badge.update({
      where: { id: badge.id },
      data: { earnedCount: { increment: 1 } },
    });

    return {
      status: 'success' as const,
      data: {
        id: userBadge.id,
        badgeId: badge.id,
        badgeName: badge.name,
        alreadyAwarded: false,
        earnedAt: userBadge.earnedAt,
      },
      message: `Badge "${badge.name}" successfully awarded to user`,
    };
  }

  async revokeBadge(userId: string, badgeIdOrSlug: string) {
    const badge = await this.resolveBadge(badgeIdOrSlug);

    const userBadge = await this.prisma.userBadge.findUnique({
      where: {
        userId_badgeId: {
          userId,
          badgeId: badge.id,
        },
      },
    });

    if (!userBadge) {
      throw new NotFoundException(
        `User ${userId} does not have badge "${badge.name}"`,
      );
    }

    await this.prisma.userBadge.delete({
      where: { id: userBadge.id },
    });

    const newEarnedCount = Math.max(0, badge.earnedCount - 1);
    await this.prisma.badge.update({
      where: { id: badge.id },
      data: { earnedCount: newEarnedCount },
    });

    return {
      status: 'success' as const,
      message: `Badge "${badge.name}" revoked from user successfully`,
    };
  }

  // ---------------------------------------------------------------------------
  // HELPER METHODS
  // ---------------------------------------------------------------------------

  private async resolveBadge(idOrSlug: string) {
    const badge = await this.prisma.badge.findFirst({
      where: {
        OR: [{ id: idOrSlug }, { slug: idOrSlug }],
      },
    });

    if (!badge) {
      throw new NotFoundException(`Badge "${idOrSlug}" not found`);
    }

    return badge;
  }

  private formatBadge(badge: any): FormattedBadge {
    const tagLabel =
      badge.tagType === BadgeTagType.EVENT
        ? 'Event'
        : badge.tagType === BadgeTagType.RATW
          ? 'RATW'
          : 'Special';

    return {
      id: badge.id,
      slug: badge.slug,
      name: badge.name,
      title: badge.name,
      description: badge.description,
      icon: badge.iconUrl,
      iconUrl: badge.iconUrl,
      isActive: badge.isActive,
      tagType: badge.tagType,
      tag: {
        label: tagLabel,
        type: badge.tagType.toLowerCase(),
      },
      earnedCount: badge.earnedCount,
      createdAt: badge.createdAt,
      updatedAt: badge.updatedAt,
    };
  }

  private slugify(text: string): string {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  private formatDate(date: Date): string {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  }
}

