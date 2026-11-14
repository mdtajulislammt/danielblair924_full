import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateChallengeDto } from './dto/create-challenge.dto.js';
import { UpdateChallengeDto } from './dto/update-challenge.dto.js';
import { ChallengeQueryDto } from './dto/challenge-query.dto.js';
import {
  ChallengeScope,
  ChallengeStatus,
  Prisma,
} from '../generated/prisma/client.js';

export interface MilestoneDestination {
  id: number;
  destination: string;
  countryCode: string;
  distanceRequiredKm: number;
  distanceRequired: string;
  badgeName: string;
  badgeIcon: string;
  status: 'Unlocked' | 'Current' | 'Locked';
  unlockDate: string;
}

const STATIC_DESTINATIONS = [
  {
    id: 1,
    destination: 'Bangladesh',
    countryCode: 'BD',
    distanceRequiredKm: 0,
    distanceRequired: '0 km',
    badgeName: 'Bangladesh Star Medal',
    badgeIcon: '/badges/badge1.png',
  },
  {
    id: 2,
    destination: 'India',
    countryCode: 'IN',
    distanceRequiredKm: 500,
    distanceRequired: '500 km',
    badgeName: 'India Silver Medal',
    badgeIcon: '/badges/badge2.png',
  },
  {
    id: 3,
    destination: 'Nepal',
    countryCode: 'NP',
    distanceRequiredKm: 1000,
    distanceRequired: '1,000 km',
    badgeName: 'Nepal Gold Medal',
    badgeIcon: '/badges/badge6.png',
  },
  {
    id: 4,
    destination: 'China',
    countryCode: 'CN',
    distanceRequiredKm: 2500,
    distanceRequired: '2,500 km',
    badgeName: 'China Trophy',
    badgeIcon: '/badges/badge7.png',
  },
  {
    id: 5,
    destination: 'Rome',
    countryCode: 'IT',
    distanceRequiredKm: 5000,
    distanceRequired: '5,000 km',
    badgeName: 'Rome Colosseum Medal',
    badgeIcon: '/badges/rome-medal.png',
  },
  {
    id: 6,
    destination: 'Paris',
    countryCode: 'FR',
    distanceRequiredKm: 7500,
    distanceRequired: '7,500 km',
    badgeName: 'Parisian Finisher Medal',
    badgeIcon: '/badges/paris-finisher.png',
  },
  {
    id: 7,
    destination: 'Tokyo',
    countryCode: 'JP',
    distanceRequiredKm: 10000,
    distanceRequired: '10,000 km',
    badgeName: 'Tokyo Marathon Master',
    badgeIcon: '/badges/tokyo-master.png',
  },
];

@Injectable()
export class ChallengesService {
  constructor(private readonly prisma: PrismaService) {}

  private resolveScope(type?: string, scope?: ChallengeScope): ChallengeScope {
    if (scope) return scope;
    if (type) {
      const lower = type.toLowerCase();
      if (lower.includes('indiv')) return ChallengeScope.INDIVIDUAL;
      if (lower.includes('comm')) return ChallengeScope.COMMUNITY_WIDE;
    }
    return ChallengeScope.COMMUNITY_WIDE;
  }

  async createChallenge(dto: CreateChallengeDto) {
    const title = dto.title || dto.challengeName;
    if (!title || !title.trim()) {
      throw new BadRequestException('Challenge title or challengeName is required');
    }

    const scope = this.resolveScope(dto.type, dto.scope);

    let startDate: Date | null = null;
    let endDate: Date | null = null;

    if (dto.startDate) {
      const s = new Date(dto.startDate);
      if (!isNaN(s.getTime())) startDate = s;
    }
    if (dto.endDate) {
      const e = new Date(dto.endDate);
      if (!isNaN(e.getTime())) endDate = e;
    }

    const challenge = await this.prisma.challenge.create({
      data: {
        title: title.trim(),
        description: dto.description,
        scope,
        status: dto.status || ChallengeStatus.DRAFT,
        targetProgress: dto.targetProgress !== undefined ? Number(dto.targetProgress) : 500,
        progressUnit: dto.progressUnit || 'km',
        coverImageUrl: dto.coverImageUrl || null,
        startDate,
        endDate,
        requirements: dto.requirements
          ? {
              create: {
                completeDistance:
                  dto.requirements.completeDistance !== undefined
                    ? dto.requirements.completeDistance
                    : true,
                uploadRunningEvidence:
                  dto.requirements.uploadRunningEvidence !== undefined
                    ? dto.requirements.uploadRunningEvidence
                    : true,
                postOnTikTok:
                  dto.requirements.postOnTikTok !== undefined
                    ? dto.requirements.postOnTikTok
                    : true,
                tiktokCaptionInstructions:
                  dto.requirements.tiktokCaptionInstructions || null,
                tagFirstMileClub:
                  dto.requirements.tagFirstMileClub !== undefined
                    ? dto.requirements.tagFirstMileClub
                    : true,
                tagCollaboratingPage:
                  dto.requirements.tagCollaboratingPage !== undefined
                    ? dto.requirements.tagCollaboratingPage
                    : false,
                collaboratingPageName:
                  dto.requirements.collaboratingPageName || null,
                useSpecificHashtag:
                  dto.requirements.useSpecificHashtag !== undefined
                    ? dto.requirements.useSpecificHashtag
                    : true,
                specificHashtag: dto.requirements.specificHashtag || null,
              },
            }
          : undefined,
      },
      include: {
        requirements: true,
      },
    });

    return {
      status: 'success' as const,
      data: challenge,
    };
  }

  async getChallenges(
    query: ChallengeQueryDto,
    defaultStatus?: ChallengeStatus,
    userId?: string,
  ) {
    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.max(1, Math.min(100, Number(query.limit) || 10));
    const skip = (page - 1) * limit;

    const where: Prisma.ChallengeWhereInput = {};

    if (query.status) {
      where.status = query.status;
    } else if (defaultStatus) {
      where.status = defaultStatus;
    }

    if (query.scope) {
      where.scope = query.scope;
    }

    if (query.search) {
      where.OR = [
        { title: { contains: query.search, mode: 'insensitive' } },
        { description: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    const [total, rawChallenges] = await Promise.all([
      this.prisma.challenge.count({ where }),
      this.prisma.challenge.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          requirements: true,
          _count: {
            select: {
              participants: true,
              submissions: true,
            },
          },
          ...(userId
            ? {
                participants: {
                  where: { userId },
                  select: { id: true, individualKm: true },
                },
              }
            : {}),
        },
      }),
    ]);

    const items = rawChallenges.map((ch) => {
      const target = ch.targetProgress || 500;
      const current = ch.currentProgress || 0;
      const progressPercent =
        target > 0 ? Math.min(100, Math.max(0, (current / target) * 100)) : 0;

      let isJoined = false;
      let userIndividualKm = 0;

      if (userId && Array.isArray((ch as any).participants) && (ch as any).participants.length > 0) {
        isJoined = true;
        userIndividualKm = (ch as any).participants[0].individualKm;
      }

      return {
        id: ch.id,
        title: ch.title,
        challengeName: ch.title,
        description: ch.description,
        scope: ch.scope,
        type: ch.scope === ChallengeScope.COMMUNITY_WIDE ? 'Community-wide' : 'Individual',
        status: ch.status,
        currentProgress: current,
        targetProgress: target,
        progressUnit: ch.progressUnit,
        progressPercent: Number(progressPercent.toFixed(1)),
        coverImageUrl: ch.coverImageUrl,
        startDate: ch.startDate,
        endDate: ch.endDate,
        participantsCount: ch._count.participants,
        submissionsCount: ch._count.submissions,
        requirements: ch.requirements,
        isJoined,
        userIndividualKm,
        createdAt: ch.createdAt,
        updatedAt: ch.updatedAt,
      };
    });

    return {
      status: 'success' as const,
      data: {
        items,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit) || 1,
        },
      },
    };
  }

  async getChallengeById(id: string, userId?: string) {
    const challenge = await this.prisma.challenge.findUnique({
      where: { id },
      include: {
        requirements: true,
        _count: {
          select: {
            participants: true,
            submissions: true,
          },
        },
        ...(userId
          ? {
              participants: {
                where: { userId },
                select: { id: true, individualKm: true, joinedAt: true },
              },
            }
          : {}),
      },
    });

    if (!challenge) {
      throw new NotFoundException(`Challenge with ID '${id}' not found`);
    }

    const target = challenge.targetProgress || 500;
    const current = challenge.currentProgress || 0;
    const progressPercent =
      target > 0 ? Math.min(100, Math.max(0, (current / target) * 100)) : 0;

    let isJoined = false;
    let userIndividualKm = 0;
    let joinedAt: Date | null = null;

    if (userId && Array.isArray((challenge as any).participants) && (challenge as any).participants.length > 0) {
      isJoined = true;
      userIndividualKm = (challenge as any).participants[0].individualKm;
      joinedAt = (challenge as any).participants[0].joinedAt;
    }

    return {
      status: 'success' as const,
      data: {
        id: challenge.id,
        title: challenge.title,
        challengeName: challenge.title,
        description: challenge.description,
        scope: challenge.scope,
        type: challenge.scope === ChallengeScope.COMMUNITY_WIDE ? 'Community-wide' : 'Individual',
        status: challenge.status,
        currentProgress: current,
        targetProgress: target,
        progressUnit: challenge.progressUnit,
        progressPercent: Number(progressPercent.toFixed(1)),
        coverImageUrl: challenge.coverImageUrl,
        startDate: challenge.startDate,
        endDate: challenge.endDate,
        participantsCount: challenge._count.participants,
        submissionsCount: challenge._count.submissions,
        requirements: challenge.requirements,
        isJoined,
        userIndividualKm,
        joinedAt,
        createdAt: challenge.createdAt,
        updatedAt: challenge.updatedAt,
      },
    };
  }

  async updateChallenge(id: string, dto: UpdateChallengeDto) {
    const existing = await this.prisma.challenge.findUnique({
      where: { id },
      include: { requirements: true },
    });

    if (!existing) {
      throw new NotFoundException(`Challenge with ID '${id}' not found`);
    }

    const data: Prisma.ChallengeUpdateInput = {};

    const title = dto.title || dto.challengeName;
    if (title) {
      data.title = title.trim();
    }
    if (dto.description !== undefined) {
      data.description = dto.description;
    }
    if (dto.type || dto.scope) {
      data.scope = this.resolveScope(dto.type, dto.scope);
    }
    if (dto.status !== undefined) {
      data.status = dto.status;
    }
    if (dto.coverImageUrl !== undefined) {
      data.coverImageUrl = dto.coverImageUrl || null;
    }
    if (dto.targetProgress !== undefined) {
      data.targetProgress = Number(dto.targetProgress);
    }
    if (dto.currentProgress !== undefined) {
      data.currentProgress = Number(dto.currentProgress);
    }
    if (dto.progressUnit !== undefined) {
      data.progressUnit = dto.progressUnit;
    }
    if (dto.startDate !== undefined) {
      if (dto.startDate) {
        const d = new Date(dto.startDate);
        data.startDate = isNaN(d.getTime()) ? null : d;
      } else {
        data.startDate = null;
      }
    }
    if (dto.endDate !== undefined) {
      if (dto.endDate) {
        const d = new Date(dto.endDate);
        data.endDate = isNaN(d.getTime()) ? null : d;
      } else {
        data.endDate = null;
      }
    }

    if (dto.requirements) {
      const req = dto.requirements;
      data.requirements = {
        upsert: {
          create: {
            completeDistance: req.completeDistance ?? true,
            uploadRunningEvidence: req.uploadRunningEvidence ?? true,
            postOnTikTok: req.postOnTikTok ?? true,
            tiktokCaptionInstructions: req.tiktokCaptionInstructions || null,
            tagFirstMileClub: req.tagFirstMileClub ?? true,
            tagCollaboratingPage: req.tagCollaboratingPage ?? false,
            collaboratingPageName: req.collaboratingPageName || null,
            useSpecificHashtag: req.useSpecificHashtag ?? true,
            specificHashtag: req.specificHashtag || null,
          },
          update: {
            ...(req.completeDistance !== undefined && {
              completeDistance: req.completeDistance,
            }),
            ...(req.uploadRunningEvidence !== undefined && {
              uploadRunningEvidence: req.uploadRunningEvidence,
            }),
            ...(req.postOnTikTok !== undefined && {
              postOnTikTok: req.postOnTikTok,
            }),
            ...(req.tiktokCaptionInstructions !== undefined && {
              tiktokCaptionInstructions: req.tiktokCaptionInstructions,
            }),
            ...(req.tagFirstMileClub !== undefined && {
              tagFirstMileClub: req.tagFirstMileClub,
            }),
            ...(req.tagCollaboratingPage !== undefined && {
              tagCollaboratingPage: req.tagCollaboratingPage,
            }),
            ...(req.collaboratingPageName !== undefined && {
              collaboratingPageName: req.collaboratingPageName,
            }),
            ...(req.useSpecificHashtag !== undefined && {
              useSpecificHashtag: req.useSpecificHashtag,
            }),
            ...(req.specificHashtag !== undefined && {
              specificHashtag: req.specificHashtag,
            }),
          },
        },
      };
    }

    const updated = await this.prisma.challenge.update({
      where: { id },
      data,
      include: { requirements: true },
    });

    return {
      status: 'success' as const,
      data: updated,
    };
  }

  async deleteChallenge(id: string) {
    const existing = await this.prisma.challenge.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException(`Challenge with ID '${id}' not found`);
    }

    await this.prisma.challenge.delete({
      where: { id },
    });

    return {
      status: 'success' as const,
      message: `Challenge '${existing.title}' successfully deleted`,
    };
  }

  async joinChallenge(challengeId: string, userId: string) {
    const challenge = await this.prisma.challenge.findUnique({
      where: { id: challengeId },
    });

    if (!challenge) {
      throw new NotFoundException(`Challenge with ID '${challengeId}' not found`);
    }

    const participant = await this.prisma.challengeParticipant.upsert({
      where: {
        challengeId_userId: {
          challengeId,
          userId,
        },
      },
      create: {
        challengeId,
        userId,
        individualKm: 0.0,
      },
      update: {},
    });

    return {
      status: 'success' as const,
      message: `Successfully joined challenge '${challenge.title}'`,
      data: {
        challengeId,
        participantId: participant.id,
        individualKm: participant.individualKm,
        joinedAt: participant.joinedAt,
      },
    };
  }

  async getChallengeParticipants(challengeId: string, page = 1, limit = 20) {
    const challenge = await this.prisma.challenge.findUnique({
      where: { id: challengeId },
    });

    if (!challenge) {
      throw new NotFoundException(`Challenge with ID '${challengeId}' not found`);
    }

    const pageNum = Math.max(1, Number(page) || 1);
    const limitNum = Math.max(1, Math.min(100, Number(limit) || 20));
    const skip = (pageNum - 1) * limitNum;

    const [total, rawParticipants] = await Promise.all([
      this.prisma.challengeParticipant.count({
        where: { challengeId },
      }),
      this.prisma.challengeParticipant.findMany({
        where: { challengeId },
        skip,
        take: limitNum,
        orderBy: { individualKm: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              fname: true,
              lname: true,
              username: true,
              email: true,
              avatarUrl: true,
              city: true,
              country: true,
            },
          },
        },
      }),
    ]);

    const participants = rawParticipants.map((p, idx) => {
      const name =
        p.user.fname || p.user.lname
          ? `${p.user.fname || ''} ${p.user.lname || ''}`.trim()
          : p.user.username || p.user.email;

      return {
        id: p.id,
        userId: p.user.id,
        rank: skip + idx + 1,
        name,
        email: p.user.email,
        avatarUrl: p.user.avatarUrl,
        location: [p.user.city, p.user.country].filter(Boolean).join(', ') || null,
        individualKm: Number(p.individualKm.toFixed(1)),
        joinedAt: p.joinedAt,
      };
    });

    return {
      status: 'success' as const,
      data: {
        challenge: {
          id: challenge.id,
          title: challenge.title,
          currentProgress: challenge.currentProgress,
          targetProgress: challenge.targetProgress,
          progressUnit: challenge.progressUnit,
        },
        participants,
        pagination: {
          total,
          page: pageNum,
          limit: limitNum,
          totalPages: Math.ceil(total / limitNum) || 1,
        },
      },
    };
  }

  async getDestinations(challengeId?: string) {
    let currentKm = 0;

    if (challengeId) {
      const challenge = await this.prisma.challenge.findUnique({
        where: { id: challengeId },
      });
      if (challenge) {
        currentKm = challenge.currentProgress;
      }
    } else {
      // Find active community RATW challenge
      const activeRatw = await this.prisma.challenge.findFirst({
        where: {
          status: ChallengeStatus.ACTIVE,
          scope: ChallengeScope.COMMUNITY_WIDE,
        },
        orderBy: { createdAt: 'desc' },
      });
      if (activeRatw) {
        currentKm = activeRatw.currentProgress;
      } else {
        // Fallback: aggregate all members totalDistanceKm
        const aggregate = await this.prisma.user.aggregate({
          _sum: { totalDistanceKm: true },
        });
        currentKm = aggregate._sum.totalDistanceKm || 0;
      }
    }

    let foundCurrent = false;

    const destinations: MilestoneDestination[] = STATIC_DESTINATIONS.map((dest) => {
      let status: 'Unlocked' | 'Current' | 'Locked' = 'Locked';
      let unlockDate = 'Not yet reached';

      if (currentKm >= dest.distanceRequiredKm) {
        status = 'Unlocked';
        unlockDate = 'Unlocked';
      } else if (!foundCurrent) {
        status = 'Current';
        foundCurrent = true;
      }

      return {
        id: dest.id,
        destination: dest.destination,
        countryCode: dest.countryCode,
        distanceRequiredKm: dest.distanceRequiredKm,
        distanceRequired: dest.distanceRequired,
        badgeName: dest.badgeName,
        badgeIcon: dest.badgeIcon,
        status,
        unlockDate,
      };
    });

    return {
      status: 'success' as const,
      data: {
        currentCollectiveKm: Number(currentKm.toFixed(1)),
        destinations,
      },
    };
  }
}
