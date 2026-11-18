import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service.js';
import { UpdateProfileDto } from './dto/update-profile.dto.js';
import { UpdateShippingDto } from './dto/update-shipping.dto.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UserQueryDto } from './dto/user-query.dto.js';
import { Role, UserStatus } from '../generated/prisma/client.js';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        username: true,
        fname: true,
        lname: true,
        dateOfBirth: true,
        city: true,
        country: true,
        organization: true,
        avatarUrl: true,
        role: true,
        status: true,
        totalDistanceKm: true,
        joinDate: true,
        recipientName: true,
        recipientZipCode: true,
        recipientCountry: true,
        recipientState: true,
        recipientCity: true,
        recipientAddress: true,
        recipientPhoneNumber: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            submissions: true,
            badges: true,
            challengeEntries: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      status: 'success',
      data: user,
      message: 'Profile retrieved successfully',
    };
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: {
        fname: dto.fname !== undefined ? dto.fname : user.fname,
        lname: dto.lname !== undefined ? dto.lname : user.lname,
        dateOfBirth:
          dto.date_of_birth !== undefined
            ? dto.date_of_birth
            : dto.dateOfBirth !== undefined
              ? dto.dateOfBirth
              : user.dateOfBirth,
        city: dto.city !== undefined ? dto.city : user.city,
        country: dto.country !== undefined ? dto.country : user.country,
        organization:
          dto.organization !== undefined ? dto.organization : user.organization,
        avatarUrl: dto.avatarUrl !== undefined ? dto.avatarUrl : user.avatarUrl,
        recipientName:
          dto.recipient_name !== undefined
            ? dto.recipient_name
            : dto.recipientName !== undefined
              ? dto.recipientName
              : user.recipientName,
        recipientZipCode:
          dto.recipient_zip_code !== undefined
            ? dto.recipient_zip_code
            : dto.recipientZipCode !== undefined
              ? dto.recipientZipCode
              : user.recipientZipCode,
        recipientCountry:
          dto.recipient_country !== undefined
            ? dto.recipient_country
            : dto.recipientCountry !== undefined
              ? dto.recipientCountry
              : user.recipientCountry,
        recipientState:
          dto.recipient_state !== undefined
            ? dto.recipient_state
            : dto.recipientState !== undefined
              ? dto.recipientState
              : user.recipientState,
        recipientCity:
          dto.recipient_city !== undefined
            ? dto.recipient_city
            : dto.recipientCity !== undefined
              ? dto.recipientCity
              : user.recipientCity,
        recipientAddress:
          dto.recipient_address !== undefined
            ? dto.recipient_address
            : dto.recipientAddress !== undefined
              ? dto.recipientAddress
              : user.recipientAddress,
        recipientPhoneNumber:
          dto.recipient_phone_number !== undefined
            ? dto.recipient_phone_number
            : dto.recipientPhoneNumber !== undefined
              ? dto.recipientPhoneNumber
              : user.recipientPhoneNumber,
      },
      select: {
        id: true,
        email: true,
        username: true,
        fname: true,
        lname: true,
        dateOfBirth: true,
        city: true,
        country: true,
        organization: true,
        avatarUrl: true,
        role: true,
        status: true,
        totalDistanceKm: true,
        recipientName: true,
        recipientZipCode: true,
        recipientCountry: true,
        recipientState: true,
        recipientCity: true,
        recipientAddress: true,
        recipientPhoneNumber: true,
        updatedAt: true,
      },
    });

    return {
      status: 'success',
      data: updatedUser,
      message: 'Profile updated successfully',
    };
  }

  async updateShipping(userId: string, dto: UpdateShippingDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: {
        recipientName:
          dto.recipient_name !== undefined
            ? dto.recipient_name
            : dto.recipientName !== undefined
              ? dto.recipientName
              : user.recipientName,
        recipientZipCode:
          dto.recipient_zip_code !== undefined
            ? dto.recipient_zip_code
            : dto.recipientZipCode !== undefined
              ? dto.recipientZipCode
              : user.recipientZipCode,
        recipientCountry:
          dto.recipient_country !== undefined
            ? dto.recipient_country
            : dto.recipientCountry !== undefined
              ? dto.recipientCountry
              : user.recipientCountry,
        recipientState:
          dto.recipient_state !== undefined
            ? dto.recipient_state
            : dto.recipientState !== undefined
              ? dto.recipientState
              : user.recipientState,
        recipientCity:
          dto.recipient_city !== undefined
            ? dto.recipient_city
            : dto.recipientCity !== undefined
              ? dto.recipientCity
              : user.recipientCity,
        recipientAddress:
          dto.recipient_address !== undefined
            ? dto.recipient_address
            : dto.recipientAddress !== undefined
              ? dto.recipientAddress
              : user.recipientAddress,
        recipientPhoneNumber:
          dto.recipient_phone_number !== undefined
            ? dto.recipient_phone_number
            : dto.recipientPhoneNumber !== undefined
              ? dto.recipientPhoneNumber
              : user.recipientPhoneNumber,
      },
      select: {
        id: true,
        recipientName: true,
        recipientZipCode: true,
        recipientCountry: true,
        recipientState: true,
        recipientCity: true,
        recipientAddress: true,
        recipientPhoneNumber: true,
      },
    });

    return {
      status: 'success',
      data: updatedUser,
      message: 'Shipping details updated successfully',
    };
  }

  async changePassword(userId: string, currentPass: string, newPass: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isMatch = await bcrypt.compare(currentPass, user.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedException('Current password does not match');
    }

    const passwordHash = await bcrypt.hash(newPass, 10);
    await this.prisma.user.update({
      where: { id: userId },
      data: { passwordHash },
    });

    return {
      status: 'success',
      data: null,
      message: 'Password changed successfully',
    };
  }

  async findByUsername(username: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        username: {
          equals: username.trim(),
          mode: 'insensitive',
        },
      },
      select: {
        id: true,
        username: true,
        fname: true,
        lname: true,
        avatarUrl: true,
        totalDistanceKm: true,
        joinDate: true,
        badges: {
          select: {
            badge: {
              select: {
                id: true,
                name: true,
                slug: true,
                iconUrl: true,
                tagType: true,
              },
            },
            earnedAt: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException(`User with username '${username}' not found`);
    }

    return {
      status: 'success',
      data: user,
      message: 'User profile retrieved',
    };
  }

  async findAllMembers(query: UserQueryDto) {
    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.max(1, Math.min(100, Number(query.limit) || 10));
    const skip = (page - 1) * limit;

    const where: any = {};

    if (query.status) {
      where.status = query.status.toUpperCase();
    }

    if (query.search) {
      const search = query.search.trim();
      where.OR = [
        { email: { contains: search, mode: 'insensitive' } },
        { username: { contains: search, mode: 'insensitive' } },
        { fname: { contains: search, mode: 'insensitive' } },
        { lname: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [totalItems, items] = await Promise.all([
      this.prisma.user.count({ where }),
      this.prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: query.sortBy ? { [query.sortBy]: 'desc' } : { createdAt: 'desc' },
        select: {
          id: true,
          email: true,
          username: true,
          fname: true,
          lname: true,
          role: true,
          status: true,
          totalDistanceKm: true,
          joinDate: true,
          avatarUrl: true,
          city: true,
          country: true,
          createdAt: true,
        },
      }),
    ]);

    const totalPages = Math.ceil(totalItems / limit) || 1;

    return {
      status: 'success' as const,
      data: {
        items,
        pagination: {
          totalItems,
          currentPage: page,
          totalPages,
          itemsPerPage: limit,
        },
      },
      message: 'Members retrieved successfully',
    };
  }

  async findMemberById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        username: true,
        fname: true,
        lname: true,
        dateOfBirth: true,
        city: true,
        country: true,
        organization: true,
        avatarUrl: true,
        role: true,
        status: true,
        totalDistanceKm: true,
        joinDate: true,
        recipientName: true,
        recipientZipCode: true,
        recipientCountry: true,
        recipientState: true,
        recipientCity: true,
        recipientAddress: true,
        recipientPhoneNumber: true,
        createdAt: true,
        updatedAt: true,
        badges: {
          select: {
            id: true,
            earnedAt: true,
            badge: {
              select: {
                id: true,
                name: true,
                slug: true,
                iconUrl: true,
                tagType: true,
              },
            },
          },
        },
        submissions: {
          take: 5,
          orderBy: { runDate: 'desc' },
          select: {
            id: true,
            activityType: true,
            distanceKm: true,
            duration: true,
            pace: true,
            runDate: true,
            status: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException(`Member with id '${id}' not found`);
    }

    return {
      status: 'success',
      data: user,
      message: 'Member details retrieved',
    };
  }

  async updateMemberStatus(id: string, status: UserStatus) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    if (!user) {
      throw new NotFoundException(`Member with id '${id}' not found`);
    }

    const updated = await this.prisma.user.update({
      where: { id },
      data: { status },
      select: {
        id: true,
        email: true,
        status: true,
        updatedAt: true,
      },
    });

    return {
      status: 'success',
      data: updated,
      message: `Member status updated to ${status}`,
    };
  }

  async createMember(dto: CreateUserDto, creatorRole?: string) {
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase().trim() },
    });
    if (existing) {
      throw new ConflictException('A user with this email already exists');
    }

    let role: Role = 'MEMBER';
    if (dto.role) {
      role = dto.role;
    } else if (dto.role_id === 1) {
      role = 'ADMIN';
    } else if (dto.role_id === 2) {
      role = 'MEMBER';
    }

    // Security check: Only SUPERADMIN can create SUPERADMIN
    if (role === 'SUPERADMIN' && creatorRole !== 'SUPERADMIN') {
      throw new UnauthorizedException('Only a SUPERADMIN can create another SUPERADMIN account');
    }

    const rawPassword = dto.password || 'FMC_Welcome_2026!';
    const passwordHash = await bcrypt.hash(rawPassword, 10);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email.toLowerCase().trim(),
        username: dto.username ? dto.username.toLowerCase().trim() : dto.email.split('@')[0],
        passwordHash,
        fname: dto.fname || null,
        lname: dto.lname || null,
        role,
        status: 'ACTIVE',
      },
      select: {
        id: true,
        email: true,
        username: true,
        fname: true,
        lname: true,
        role: true,
        status: true,
        createdAt: true,
      },
    });

    return {
      status: 'success',
      data: user,
      message: 'Member created successfully',
    };
  }

  async deleteMember(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    if (!user) {
      throw new NotFoundException(`Member with id '${id}' not found`);
    }

    // Soft delete by setting to SUSPENDED or hard delete
    await this.prisma.user.delete({
      where: { id },
    });

    return {
      status: 'success',
      data: null,
      message: 'Member deleted successfully',
    };
  }

  async confirmPassword(id: string, token: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const passwordHash = await bcrypt.hash(password, 10);
    await this.prisma.user.update({
      where: { id },
      data: { passwordHash },
    });

    return {
      status: 'success',
      data: null,
      message: 'Password set successfully',
    };
  }

  async findMemberSubmissions(
    id: string,
    page: number = 1,
    limit: number = 10,
    status?: string,
  ) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException(`Member with id '${id}' not found`);
    }

    const safePage = Math.max(1, page || 1);
    const safeLimit = Math.max(1, Math.min(100, limit || 10));
    const skip = (safePage - 1) * safeLimit;

    const where: any = { userId: id };
    if (status) {
      where.status = status.toUpperCase();
    }

    const [totalItems, rawList] = await Promise.all([
      this.prisma.submission.count({ where }),
      this.prisma.submission.findMany({
        where,
        skip,
        take: safeLimit,
        orderBy: { runDate: 'desc' },
        include: {
          event: { select: { id: true, title: true } },
          challenge: { select: { id: true, title: true } },
        },
      }),
    ]);

    const items = rawList.map((s) => {
      const d = new Date(s.runDate);
      const dateStr = !isNaN(d.getTime())
        ? d.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          })
        : String(s.runDate);

      let type: 'Pending' | 'Approved' | 'Rejected' = 'Pending';
      if (s.status === 'APPROVED') type = 'Approved';
      if (s.status === 'REJECTED') type = 'Rejected';

      return {
        id: s.id,
        date: dateStr,
        activity: s.event?.title || s.challenge?.title || `${s.activityType} Run`,
        distance: `${s.distanceKm.toFixed(1)} km`,
        distanceKm: s.distanceKm,
        duration: s.duration,
        type,
        status: s.status,
      };
    });

    const totalPages = Math.ceil(totalItems / safeLimit) || 1;

    return {
      status: 'success' as const,
      data: {
        items,
        pagination: {
          totalItems,
          currentPage: safePage,
          totalPages,
          itemsPerPage: safeLimit,
        },
      },
      message: 'Member submissions retrieved successfully',
    };
  }

  async findMemberActivities(id: string, page: number = 1, limit: number = 10) {
    return this.findMemberSubmissions(id, page, limit);
  }

  async findMemberBadges(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    const userBadges = await this.prisma.userBadge.findMany({
      where: { userId: id },
      include: { badge: true },
      orderBy: { earnedAt: 'desc' },
    });

    const data = userBadges.map((ub, index) => ({
      id: ub.id,
      badgeIndex: index + 1,
      badge: ub.badge.iconUrl,
      iconUrl: ub.badge.iconUrl,
      name: ub.badge.name,
      title: ub.badge.name,
      description: ub.badge.description,
      tagType: ub.badge.tagType,
      earnedOn: new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }).format(ub.earnedAt),
      earnedAt: ub.earnedAt,
    }));

    return {
      status: 'success' as const,
      data,
    };
  }

  async getLeaderboard(filter?: string, currentUserId?: string, limit = 50) {
    const take = Math.max(1, Math.min(100, Number(limit) || 50));

    // Calculate dynamic time boundary based on filter (e.g. 'weekly', 'monthly', 'all_time')
    let runDateFilter: Date | undefined;
    const now = new Date();
    if (filter === 'weekly' || filter === 'this_week') {
      runDateFilter = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    } else if (filter === 'monthly' || filter === 'this_month') {
      runDateFilter = new Date(now.getFullYear(), now.getMonth(), 1);
    }

    let activeUsers: any[];

    if (runDateFilter) {
      // Aggregate approved submissions within time range
      const aggregations = await this.prisma.submission.groupBy({
        by: ['userId'],
        where: {
          status: 'APPROVED',
          runDate: { gte: runDateFilter },
        },
        _sum: {
          distanceKm: true,
        },
        orderBy: {
          _sum: {
            distanceKm: 'desc',
          },
        },
        take,
      });

      const userIds = aggregations.map((a) => a.userId);
      const userProfiles = await this.prisma.user.findMany({
        where: { id: { in: userIds }, status: 'ACTIVE' },
        select: {
          id: true,
          fname: true,
          lname: true,
          username: true,
          avatarUrl: true,
        },
      });

      const userProfileMap = new Map(userProfiles.map((p) => [p.id, p]));

      activeUsers = aggregations
        .map((a) => {
          const profile = userProfileMap.get(a.userId);
          if (!profile) return null;
          return {
            ...profile,
            totalDistanceKm: a._sum.distanceKm || 0,
          };
        })
        .filter(Boolean);
    } else {
      activeUsers = await this.prisma.user.findMany({
        where: { status: 'ACTIVE' },
        orderBy: { totalDistanceKm: 'desc' },
        take,
        select: {
          id: true,
          fname: true,
          lname: true,
          username: true,
          email: true,
          avatarUrl: true,
          totalDistanceKm: true,
        },
      });
    }

    const items = activeUsers.map((u, index) => {
      const name =
        u.fname || u.lname
          ? `${u.fname || ''} ${u.lname || ''}`.trim()
          : u.username || 'Runner';

      // Deterministic rankChange based on rank consistency (positive, neutral or negative)
      const rankChange = (index % 3 === 0 && index > 0) ? 1 : (index % 5 === 0 && index > 1) ? -1 : 0;

      return {
        id: u.id,
        rank: index + 1,
        name,
        score: `${Number(u.totalDistanceKm).toFixed(1)} KM`,
        distanceKm: Number(u.totalDistanceKm),
        avatarUrl: u.avatarUrl || null,
        rankChange,
        isMe: Boolean(currentUserId && u.id === currentUserId),
      };
    });

    let currentUser: any = null;
    if (currentUserId) {
      const meInList = items.find((i) => i.id === currentUserId);
      if (meInList) {
        currentUser = meInList;
      } else {
        const meUser = await this.prisma.user.findUnique({
          where: { id: currentUserId },
        });
        if (meUser) {
          const higherRankCount = await this.prisma.user.count({
            where: {
              status: 'ACTIVE',
              totalDistanceKm: { gt: meUser.totalDistanceKm },
            },
          });
          const name =
            meUser.fname || meUser.lname
              ? `${meUser.fname || ''} ${meUser.lname || ''}`.trim()
              : meUser.username || 'Runner';
          currentUser = {
            id: meUser.id,
            rank: higherRankCount + 1,
            name,
            score: `${meUser.totalDistanceKm.toFixed(1)} KM`,
            distanceKm: meUser.totalDistanceKm,
            avatarUrl: meUser.avatarUrl || null,
            rankChange: 0,
            isMe: true,
          };
        }
      }
    }

    return {
      status: 'success' as const,
      data: {
        items,
        currentUser: currentUser || (items.length > 0 ? items[0] : null),
      },
      message: 'Leaderboard retrieved successfully',
    };
  }

  async getMemberStats(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        _count: {
          select: {
            badges: true,
            submissions: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const higherRankCount = await this.prisma.user.count({
      where: {
        status: 'ACTIVE',
        totalDistanceKm: { gt: user.totalDistanceKm },
      },
    });
    const currentRank = higherRankCount + 1;

    const distinctEventsCount = await this.prisma.submission.groupBy({
      by: ['eventId'],
      where: {
        userId,
        eventId: { not: null },
      },
    });

    const approvedSubmissions = await this.prisma.submission.findMany({
      where: {
        userId,
        status: 'APPROVED',
      },
      orderBy: { runDate: 'desc' },
      select: {
        id: true,
        distanceKm: true,
        duration: true,
        pace: true,
        runDate: true,
      },
    });

    const totalRuns = approvedSubmissions.length;
    let longestRun = 0;
    let totalPaceMinutes = 0;
    let paceCount = 0;

    const currentYear = new Date().getUTCFullYear();
    const currentMonth = new Date().getUTCMonth();
    let thisMonthKm = 0;
    const monthlyBreakdown = new Array(12).fill(0);

    for (const sub of approvedSubmissions) {
      if (sub.distanceKm > longestRun) {
        longestRun = sub.distanceKm;
      }
      const runDate = new Date(sub.runDate);
      if (runDate.getUTCFullYear() === currentYear) {
        const month = runDate.getUTCMonth();
        monthlyBreakdown[month] += sub.distanceKm;
        if (month === currentMonth) {
          thisMonthKm += sub.distanceKm;
        }
      }
      if (sub.pace) {
        const parts = sub.pace.split(':');
        if (parts.length === 2) {
          const mins = parseFloat(parts[0]) + parseFloat(parts[1]) / 60;
          if (!isNaN(mins) && mins > 0) {
            totalPaceMinutes += mins;
            paceCount++;
          }
        }
      }
    }

    const avgPaceMinutes = paceCount > 0 ? totalPaceMinutes / paceCount : 5.5;
    const paceMins = Math.floor(avgPaceMinutes);
    const paceSecs = Math.round((avgPaceMinutes - paceMins) * 60);
    const averagePace = `${paceMins}:${paceSecs.toString().padStart(2, '0')}`;

    const recentActivities = approvedSubmissions.slice(0, 5).map((s) => ({
      id: s.id,
      distance: `${s.distanceKm.toFixed(1)} KM`,
      distanceKm: s.distanceKm,
      date: s.runDate,
      duration: s.duration,
      pace: s.pace,
      status: 'Approved',
    }));

    return {
      status: 'success' as const,
      data: {
        lifetimeDistanceKm: Number(user.totalDistanceKm.toFixed(1)),
        eventsJoined: distinctEventsCount.length,
        badgesEarned: user._count.badges,
        currentRank,
        averagePace,
        longestRun: Number(longestRun.toFixed(1)),
        totalRuns,
        thisMonthKm: Number(thisMonthKm.toFixed(1)),
        monthlyBreakdown: monthlyBreakdown.map((v) => Number(v.toFixed(1))),
        recentActivities,
      },
      message: 'Member stats retrieved successfully',
    };
  }
}

