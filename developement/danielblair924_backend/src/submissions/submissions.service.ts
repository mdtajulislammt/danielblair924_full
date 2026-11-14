import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateSubmissionDto } from './dto/create-submission.dto.js';
import { UploadProofImagesDto } from './dto/upload-proof-images.dto.js';
import { FinalizeSubmissionDto } from './dto/finalize-submission.dto.js';
import { RejectSubmissionDto } from './dto/reject-submission.dto.js';
import { SubmissionQueryDto } from './dto/submission-query.dto.js';
import {
  ActivityType,
  SubmissionStatus,
} from '../generated/prisma/client.js';

@Injectable()
export class SubmissionsService {
  constructor(private readonly prisma: PrismaService) {}

  // ---------------------------------------------------------------------------
  // HELPERS: Pace, Date, and Label Formatting
  // ---------------------------------------------------------------------------

  public calculatePace(distanceKm: number, durationStr: string): string {
    if (!distanceKm || distanceKm <= 0 || !durationStr) {
      return '5:30 /km';
    }

    try {
      let totalSeconds = 0;
      const lower = durationStr.toLowerCase().trim();

      // Case 1: e.g. "1h 08m" or "28m 14s" or "45m"
      const hourMatch = lower.match(/(\d+)\s*h/);
      const minMatch = lower.match(/(\d+)\s*m/);
      const secMatch = lower.match(/(\d+)\s*s/);

      if (hourMatch || minMatch || secMatch) {
        if (hourMatch) totalSeconds += parseInt(hourMatch[1], 10) * 3600;
        if (minMatch) totalSeconds += parseInt(minMatch[1], 10) * 60;
        if (secMatch) totalSeconds += parseInt(secMatch[1], 10);
      } else if (durationStr.includes(':')) {
        // Case 2: "01:08:00" or "29:57"
        const parts = durationStr.split(':').map((p) => parseInt(p, 10));
        if (parts.length === 3) {
          totalSeconds = parts[0] * 3600 + parts[1] * 60 + parts[2];
        } else if (parts.length === 2) {
          totalSeconds = parts[0] * 60 + parts[1];
        }
      } else {
        const rawNum = parseFloat(durationStr);
        if (!isNaN(rawNum)) {
          totalSeconds = rawNum * 60;
        }
      }

      if (totalSeconds <= 0) {
        return '5:30 /km';
      }

      const secPerKm = totalSeconds / distanceKm;
      const paceMinutes = Math.floor(secPerKm / 60);
      const paceSeconds = Math.round(secPerKm % 60);
      const paddedSec = paceSeconds < 10 ? `0${paceSeconds}` : `${paceSeconds}`;
      return `${paceMinutes}:${paddedSec} /km`;
    } catch {
      return '5:30 /km';
    }
  }

  public formatDate(date: Date | string): string {
    const d = new Date(date);
    if (isNaN(d.getTime())) return String(date);
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  public formatShortDate(date: Date | string): string {
    const d = new Date(date);
    if (isNaN(d.getTime())) return String(date);
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }

  public formatDateTime(date: Date | string): string {
    const d = new Date(date);
    if (isNaN(d.getTime())) return String(date);
    const datePart = d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    const timePart = d.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
    return `${datePart} · ${timePart}`;
  }

  public formatStatus(status: SubmissionStatus): string {
    switch (status) {
      case 'APPROVED':
        return 'Approved';
      case 'REJECTED':
        return 'Rejected';
      case 'PENDING':
      default:
        return 'Pending';
    }
  }

  // ---------------------------------------------------------------------------
  // RUNNER WORKFLOW: Draft, Upload Proofs, Finalize
  // ---------------------------------------------------------------------------

  async createDraft(userId: string, dto: CreateSubmissionDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      throw new NotFoundException('Runner account not found');
    }
    if (user.status === 'SUSPENDED') {
      throw new ForbiddenException('Suspended runners cannot submit activities');
    }

    if (dto.eventId) {
      const event = await this.prisma.event.findUnique({
        where: { id: dto.eventId },
      });
      if (!event) {
        throw new NotFoundException(`Event '${dto.eventId}' not found`);
      }
    }

    if (dto.challengeId) {
      const challenge = await this.prisma.challenge.findUnique({
        where: { id: dto.challengeId },
      });
      if (!challenge) {
        throw new NotFoundException(`Challenge '${dto.challengeId}' not found`);
      }
    }

    const calculatedPace = dto.pace || this.calculatePace(dto.distanceKm, dto.duration);
    const runDate = new Date(dto.runDate);

    const submission = await this.prisma.submission.create({
      data: {
        userId,
        eventId: dto.eventId || null,
        challengeId: dto.challengeId || null,
        activityType: dto.activityType || 'RUNNING',
        distanceKm: dto.distanceKm,
        duration: dto.duration,
        pace: calculatedPace,
        runDate: isNaN(runDate.getTime()) ? new Date() : runDate,
        stravaImageUrl: dto.stravaImageUrl || null,
        gpsImageUrl: dto.gpsImageUrl || null,
        postedOnTikTok: dto.postedOnTikTok ?? false,
        taggedClub: dto.taggedClub ?? false,
        usedHashtag: dto.usedHashtag ?? false,
        status: 'PENDING',
      },
      include: {
        event: { select: { id: true, title: true } },
        challenge: { select: { id: true, title: true } },
      },
    });

    return {
      status: 'success' as const,
      data: submission,
      message: 'Run proof submission initialized successfully',
    };
  }

  async uploadProofImages(
    userId: string,
    submissionId: string,
    dto: UploadProofImagesDto,
    userRole?: string,
  ) {
    const submission = await this.prisma.submission.findUnique({
      where: { id: submissionId },
    });
    if (!submission) {
      throw new NotFoundException(`Submission with id '${submissionId}' not found`);
    }

    if (submission.userId !== userId && userRole !== 'ADMIN' && userRole !== 'SUPERADMIN') {
      throw new ForbiddenException('You are not authorized to modify this submission');
    }

    const updated = await this.prisma.submission.update({
      where: { id: submissionId },
      data: {
        stravaImageUrl: dto.stravaImageUrl !== undefined ? dto.stravaImageUrl : submission.stravaImageUrl,
        gpsImageUrl: dto.gpsImageUrl !== undefined ? dto.gpsImageUrl : submission.gpsImageUrl,
      },
    });

    return {
      status: 'success' as const,
      data: updated,
      message: 'Proof images uploaded successfully',
    };
  }

  async finalizeSubmission(
    userId: string,
    submissionId: string,
    dto: FinalizeSubmissionDto,
    userRole?: string,
  ) {
    const submission = await this.prisma.submission.findUnique({
      where: { id: submissionId },
    });
    if (!submission) {
      throw new NotFoundException(`Submission with id '${submissionId}' not found`);
    }

    if (submission.userId !== userId && userRole !== 'ADMIN' && userRole !== 'SUPERADMIN') {
      throw new ForbiddenException('You are not authorized to modify this submission');
    }

    const updated = await this.prisma.submission.update({
      where: { id: submissionId },
      data: {
        postedOnTikTok: dto.postedOnTikTok !== undefined ? dto.postedOnTikTok : submission.postedOnTikTok,
        taggedClub: dto.taggedClub !== undefined ? dto.taggedClub : submission.taggedClub,
        usedHashtag: dto.usedHashtag !== undefined ? dto.usedHashtag : submission.usedHashtag,
        status: 'PENDING',
      },
      include: {
        event: { select: { id: true, title: true } },
        challenge: { select: { id: true, title: true } },
      },
    });

    return {
      status: 'success' as const,
      data: updated,
      message: 'Submission finalized and submitted for moderation',
    };
  }

  // ---------------------------------------------------------------------------
  // RUNNER READ APIS: Single Detail, My Submissions, Finisher Card, Dashboard
  // ---------------------------------------------------------------------------

  async getSubmissionById(
    submissionId: string,
    requestingUser?: { id: string; role: string },
  ) {
    const submission = await this.prisma.submission.findUnique({
      where: { id: submissionId },
      include: {
        user: {
          select: {
            id: true,
            fname: true,
            lname: true,
            username: true,
            email: true,
            avatarUrl: true,
            totalDistanceKm: true,
          },
        },
        event: {
          select: {
            id: true,
            title: true,
            distanceType: true,
            eventDate: true,
          },
        },
        challenge: {
          select: {
            id: true,
            title: true,
            targetProgress: true,
            currentProgress: true,
            progressUnit: true,
          },
        },
      },
    });

    if (!submission) {
      throw new NotFoundException(`Submission with id '${submissionId}' not found`);
    }

    if (
      requestingUser &&
      requestingUser.role !== 'ADMIN' &&
      requestingUser.role !== 'SUPERADMIN' &&
      submission.userId !== requestingUser.id
    ) {
      throw new ForbiddenException('You do not have permission to view this submission');
    }

    const memberName =
      submission.user.fname || submission.user.lname
        ? `${submission.user.fname || ''} ${submission.user.lname || ''}`.trim()
        : submission.user.username || 'Runner';

    const eventName =
      submission.event?.title || submission.challenge?.title || 'Open Run';

    const formatted = {
      id: submission.id,
      member: memberName,
      icon: submission.user.avatarUrl || '/profile.png',
      submittedAt: this.formatDateTime(submission.createdAt),
      event: eventName,
      distance: `${submission.distanceKm.toFixed(1)} km`,
      date: this.formatDate(submission.runDate),
      duration: submission.duration,
      pace: submission.pace || '5:30 /km',
      activityType: submission.activityType,
      stravaImageUrl: submission.stravaImageUrl,
      gpsImageUrl: submission.gpsImageUrl,
      postedOnTikTok: submission.postedOnTikTok,
      taggedClub: submission.taggedClub,
      usedHashtag: submission.usedHashtag,
      status: submission.status,
      rejectionReason: submission.rejectionReason,
      reviewedAt: submission.reviewedAt,
      reviewedById: submission.reviewedById,
      user: submission.user,
      eventDetail: submission.event,
      challengeDetail: submission.challenge,
    };

    return {
      status: 'success' as const,
      data: formatted,
      message: 'Submission details retrieved successfully',
    };
  }

  async getMySubmissions(userId: string, query: SubmissionQueryDto) {
    const page = Math.max(1, query.page || 1);
    const limit = Math.max(1, Math.min(100, query.limit || 10));
    const skip = (page - 1) * limit;

    const where: any = { userId };
    if (query.status) {
      where.status = query.status;
    }
    if (query.activityType) {
      where.activityType = query.activityType;
    }

    const [totalItems, rawSubmissions] = await Promise.all([
      this.prisma.submission.count({ where }),
      this.prisma.submission.findMany({
        where,
        skip,
        take: limit,
        orderBy: { runDate: 'desc' },
        include: {
          event: { select: { id: true, title: true } },
          challenge: { select: { id: true, title: true } },
        },
      }),
    ]);

    const items = rawSubmissions.map((s) => ({
      id: s.id,
      activity: s.event?.title || s.challenge?.title || `${s.activityType} Run`,
      distance: `${s.distanceKm.toFixed(1)} km`,
      distanceKm: s.distanceKm,
      date: this.formatShortDate(s.runDate),
      duration: s.duration,
      pace: s.pace,
      status: s.status,
      type: this.formatStatus(s.status),
      stravaImageUrl: s.stravaImageUrl,
      gpsImageUrl: s.gpsImageUrl,
      createdAt: s.createdAt,
    }));

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
      message: 'Activities retrieved successfully',
    };
  }

  async getFinisherCard(submissionId: string) {
    const submission = await this.prisma.submission.findUnique({
      where: { id: submissionId },
      include: {
        user: {
          select: {
            id: true,
            fname: true,
            lname: true,
            username: true,
            avatarUrl: true,
            totalDistanceKm: true,
            badges: {
              take: 1,
              orderBy: { earnedAt: 'desc' },
              include: { badge: true },
            },
          },
        },
        event: { select: { id: true, title: true, distanceType: true } },
        challenge: { select: { id: true, title: true } },
      },
    });

    if (!submission) {
      throw new NotFoundException(`Submission with id '${submissionId}' not found`);
    }

    const runnerName =
      submission.user.fname || submission.user.lname
        ? `${submission.user.fname || ''} ${submission.user.lname || ''}`.trim()
        : submission.user.username || 'First Mile Finisher';

    const eventTitle =
      submission.event?.title || submission.challenge?.title || 'First Mile Run';

    let congratsMessage = 'Incredible run! Every mile brings you closer to your greatness.';
    if (submission.distanceKm >= 21) {
      congratsMessage = 'Legendary endurance! You conquered the Half Marathon distance.';
    } else if (submission.distanceKm >= 10) {
      congratsMessage = 'Magnificent achievement! You powered through 10K with pure determination.';
    } else if (submission.distanceKm >= 5) {
      congratsMessage = 'Fantastic pace! 5K in the books for First Mile Club.';
    }

    const recentBadge = submission.user.badges[0]?.badge || null;

    const card = {
      submissionId: submission.id,
      runnerName,
      avatarUrl: submission.user.avatarUrl || '/profile.png',
      eventTitle,
      distance: `${submission.distanceKm.toFixed(1)} km`,
      duration: submission.duration,
      pace: submission.pace || '5:30 /km',
      runDate: this.formatDate(submission.runDate),
      status: submission.status,
      badgeEarned: recentBadge
        ? {
            id: recentBadge.id,
            name: recentBadge.name,
            slug: recentBadge.slug,
            iconUrl: recentBadge.iconUrl,
          }
        : null,
      congratulationsMessage: congratsMessage,
      shareableUrl: `/finisher-card/${submission.id}`,
    };

    return {
      status: 'success' as const,
      data: card,
      message: 'Finisher card generated successfully',
    };
  }

  async getRunnerDashboard(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        fname: true,
        lname: true,
        username: true,
        totalDistanceKm: true,
        _count: {
          select: {
            badges: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('Runner not found');
    }

    // Rank calculation: runners with greater distance + 1
    const higherRankCount = await this.prisma.user.count({
      where: {
        status: 'ACTIVE',
        totalDistanceKm: { gt: user.totalDistanceKm },
      },
    });
    const currentRank = higherRankCount + 1;

    // Events joined count (distinct event submissions)
    const distinctEventsCount = await this.prisma.submission.groupBy({
      by: ['eventId'],
      where: {
        userId,
        eventId: { not: null },
      },
    });

    // Active Challenge (e.g. RATW)
    const activeChallenge = await this.prisma.challenge.findFirst({
      where: { status: 'ACTIVE' },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        currentProgress: true,
        targetProgress: true,
        progressUnit: true,
      },
    });

    // Recent 5 activities
    const recentSubmissions = await this.prisma.submission.findMany({
      where: { userId },
      take: 5,
      orderBy: { runDate: 'desc' },
      select: {
        id: true,
        distanceKm: true,
        runDate: true,
        status: true,
      },
    });

    const recentActivities = recentSubmissions.map((s) => ({
      id: s.id,
      distance: `${s.distanceKm.toFixed(2)} KM`,
      date: this.formatShortDate(s.runDate),
      status: this.formatStatus(s.status),
    }));

    return {
      status: 'success' as const,
      data: {
        lifetimeDistanceKm: Number(user.totalDistanceKm.toFixed(1)),
        eventsJoined: distinctEventsCount.length,
        badgesEarned: user._count.badges,
        currentRank,
        activeChallenge: activeChallenge || {
          id: 'ch-ratw-default',
          title: 'Run Around the World',
          currentProgress: 342,
          targetProgress: 500,
          progressUnit: 'km',
        },
        recentActivities,
      },
      message: 'Runner dashboard stats retrieved successfully',
    };
  }

  // ---------------------------------------------------------------------------
  // ADMIN MODERATION: Queue, Detail, Approve, Reject
  // ---------------------------------------------------------------------------

  async getAdminSubmissions(query: SubmissionQueryDto) {
    const page = Math.max(1, query.page || 1);
    const limit = Math.max(1, Math.min(100, query.limit || 10));
    const skip = (page - 1) * limit;

    const where: any = {};
    if (query.status) {
      where.status = query.status;
    }
    if (query.activityType) {
      where.activityType = query.activityType;
    }
    if (query.search) {
      const s = query.search.toLowerCase().trim();
      where.OR = [
        { user: { fname: { contains: s, mode: 'insensitive' } } },
        { user: { lname: { contains: s, mode: 'insensitive' } } },
        { user: { username: { contains: s, mode: 'insensitive' } } },
        { user: { email: { contains: s, mode: 'insensitive' } } },
        { event: { title: { contains: s, mode: 'insensitive' } } },
        { challenge: { title: { contains: s, mode: 'insensitive' } } },
      ];
    }

    const [totalItems, rawList] = await Promise.all([
      this.prisma.submission.count({ where }),
      this.prisma.submission.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              fname: true,
              lname: true,
              username: true,
              email: true,
              avatarUrl: true,
            },
          },
          event: { select: { id: true, title: true } },
          challenge: { select: { id: true, title: true } },
        },
      }),
    ]);

    const items = rawList.map((sub) => {
      const memberName =
        sub.user.fname || sub.user.lname
          ? `${sub.user.fname || ''} ${sub.user.lname || ''}`.trim()
          : sub.user.username || sub.user.email;

      const eventName =
        sub.event?.title || sub.challenge?.title || 'Open Run';

      return {
        id: sub.id,
        member: memberName,
        icon: sub.user.avatarUrl || '/profile.png',
        event: eventName,
        distance: `${sub.distanceKm.toFixed(1)} km`,
        distanceKm: sub.distanceKm,
        date: this.formatDate(sub.runDate),
        duration: sub.duration,
        status: this.formatStatus(sub.status),
        rawStatus: sub.status,
        submittedAt: this.formatDateTime(sub.createdAt),
        postedOnTikTok: sub.postedOnTikTok,
        taggedClub: sub.taggedClub,
        usedHashtag: sub.usedHashtag,
      };
    });

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
      message: 'Moderation submissions retrieved successfully',
    };
  }

  async approveSubmission(submissionId: string, adminId: string) {
    const submission = await this.prisma.submission.findUnique({
      where: { id: submissionId },
      include: {
        user: true,
        challenge: true,
        event: true,
      },
    });

    if (!submission) {
      throw new NotFoundException(`Submission with id '${submissionId}' not found`);
    }

    const isAlreadyApproved = submission.status === 'APPROVED';

    // 1. Update Submission status
    const updatedSubmission = await this.prisma.submission.update({
      where: { id: submissionId },
      data: {
        status: 'APPROVED',
        rejectionReason: null,
        reviewedAt: new Date(),
        reviewedById: adminId,
      },
    });

    let newTotalDistance = submission.user.totalDistanceKm;

    // 2. Accredit Distance only if not already approved
    if (!isAlreadyApproved) {
      newTotalDistance = submission.user.totalDistanceKm + submission.distanceKm;
      await this.prisma.user.update({
        where: { id: submission.userId },
        data: {
          totalDistanceKm: newTotalDistance,
        },
      });

      // 3. Challenge Progress Accretion
      if (submission.challengeId) {
        // Upsert ChallengeParticipant
        const existingParticipant = await this.prisma.challengeParticipant.findUnique({
          where: {
            challengeId_userId: {
              challengeId: submission.challengeId,
              userId: submission.userId,
            },
          },
        });

        if (existingParticipant) {
          await this.prisma.challengeParticipant.update({
            where: { id: existingParticipant.id },
            data: {
              individualKm: existingParticipant.individualKm + submission.distanceKm,
            },
          });
        } else {
          await this.prisma.challengeParticipant.create({
            data: {
              challengeId: submission.challengeId,
              userId: submission.userId,
              individualKm: submission.distanceKm,
            },
          });
        }

        // Increment Challenge Total Progress
        await this.prisma.challenge.update({
          where: { id: submission.challengeId },
          data: {
            currentProgress: {
              increment: submission.distanceKm,
            },
          },
        });
      }
    }

    // 4. Automated Gamification & Badges Engine
    const unlockedBadges = await this.checkAndAwardBadges(
      submission.userId,
      submission.distanceKm,
      newTotalDistance,
      Boolean(submission.challengeId),
    );

    return {
      status: 'success' as const,
      data: {
        submission: {
          id: updatedSubmission.id,
          status: updatedSubmission.status,
          reviewedAt: updatedSubmission.reviewedAt,
        },
        userTotalDistanceKm: Number(newTotalDistance.toFixed(1)),
        unlockedBadges,
      },
      message: 'Submission approved and distance accredited successfully',
    };
  }

  async rejectSubmission(
    submissionId: string,
    adminId: string,
    dto: RejectSubmissionDto,
  ) {
    const submission = await this.prisma.submission.findUnique({
      where: { id: submissionId },
      include: { user: true },
    });

    if (!submission) {
      throw new NotFoundException(`Submission with id '${submissionId}' not found`);
    }

    // If it was previously approved, deduct the credited distance to maintain integrity
    if (submission.status === 'APPROVED') {
      const correctedDistance = Math.max(0, submission.user.totalDistanceKm - submission.distanceKm);
      await this.prisma.user.update({
        where: { id: submission.userId },
        data: { totalDistanceKm: correctedDistance },
      });

      if (submission.challengeId) {
        const participant = await this.prisma.challengeParticipant.findUnique({
          where: {
            challengeId_userId: {
              challengeId: submission.challengeId,
              userId: submission.userId,
            },
          },
        });
        if (participant) {
          await this.prisma.challengeParticipant.update({
            where: { id: participant.id },
            data: { individualKm: Math.max(0, participant.individualKm - submission.distanceKm) },
          });
        }
        await this.prisma.challenge.update({
          where: { id: submission.challengeId },
          data: { currentProgress: { decrement: submission.distanceKm } },
        });
      }
    }

    const updated = await this.prisma.submission.update({
      where: { id: submissionId },
      data: {
        status: 'REJECTED',
        rejectionReason: dto.reason,
        reviewedAt: new Date(),
        reviewedById: adminId,
      },
    });

    return {
      status: 'success' as const,
      data: {
        id: updated.id,
        status: updated.status,
        rejectionReason: updated.rejectionReason,
        reviewedAt: updated.reviewedAt,
      },
      message: 'Submission rejected',
    };
  }

  // ---------------------------------------------------------------------------
  // GAMIFICATION ENGINE: Milestone Badges Verification
  // ---------------------------------------------------------------------------

  private async checkAndAwardBadges(
    userId: string,
    runDistanceKm: number,
    totalDistanceKm: number,
    isChallenge: boolean,
  ): Promise<Array<{ name: string; slug: string }>> {
    const unlocked: Array<{ name: string; slug: string }> = [];

    // Eligible badge candidates based on performance
    const candidateSlugs: Array<{ slug: string; name: string; desc: string }> = [];

    // First Mile / First Run Badge
    candidateSlugs.push({
      slug: 'first-run',
      name: 'First Mile Finisher',
      desc: 'Completed their very first verified run submission.',
    });

    if (runDistanceKm >= 5.0) {
      candidateSlugs.push({
        slug: '5k-finisher',
        name: '5K Finisher',
        desc: 'Completed a 5 km verified run.',
      });
    }

    if (runDistanceKm >= 10.0) {
      candidateSlugs.push({
        slug: '10k-finisher',
        name: '10K Finisher',
        desc: 'Completed a 10 km verified run.',
      });
    }

    if (runDistanceKm >= 21.0) {
      candidateSlugs.push({
        slug: 'half-marathon',
        name: 'Half Marathoner',
        desc: 'Conquered 21.1 km in a single run.',
      });
    }

    if (totalDistanceKm >= 100.0) {
      candidateSlugs.push({
        slug: '100k-club',
        name: 'Century Club (100K)',
        desc: 'Accumulated over 100 km in lifetime runs.',
      });
    }

    if (isChallenge) {
      candidateSlugs.push({
        slug: 'global-explorer',
        name: 'Global Explorer',
        desc: 'Contributed kilometers to the Run Around the World challenge.',
      });
    }

    for (const candidate of candidateSlugs) {
      try {
        // Ensure badge exists in database
        let badge = await this.prisma.badge.findUnique({
          where: { slug: candidate.slug },
        });

        if (!badge) {
          badge = await this.prisma.badge.create({
            data: {
              slug: candidate.slug,
              name: candidate.name,
              description: candidate.desc,
              iconUrl: `/badges/${candidate.slug}.png`,
              tagType: 'SPECIAL',
              isActive: true,
            },
          });
        }

        // Check if user already earned this badge
        const alreadyEarned = await this.prisma.userBadge.findUnique({
          where: {
            userId_badgeId: {
              userId,
              badgeId: badge.id,
            },
          },
        });

        if (!alreadyEarned) {
          await this.prisma.userBadge.create({
            data: {
              userId,
              badgeId: badge.id,
            },
          });

          await this.prisma.badge.update({
            where: { id: badge.id },
            data: { earnedCount: { increment: 1 } },
          });

          unlocked.push({ name: badge.name, slug: badge.slug });
        }
      } catch {
        // Non-blocking: continue awarding other badges if any error occurs
      }
    }

    return unlocked;
  }

  // ---------------------------------------------------------------------------
  // ADMIN DASHBOARD ANALYTICS & RECENT ACTIVITIES
  // ---------------------------------------------------------------------------

  async getAdminDashboardStats() {
    const [activeMembers, pendingSubmissions, upcomingEvents, upcomingChallenges] =
      await Promise.all([
        this.prisma.user.count({
          where: { role: 'MEMBER', status: 'ACTIVE' },
        }),
        this.prisma.submission.count({
          where: { status: 'PENDING' },
        }),
        this.prisma.event.count({
          where: { status: 'PUBLISHED' },
        }),
        this.prisma.challenge.count({
          where: { status: 'ACTIVE' },
        }),
      ]);

    return {
      status: 'success' as const,
      data: {
        activeMembers,
        pendingSubmissions,
        upcomingEvents,
        upcomingChallenges,
      },
      message: 'Admin dashboard KPI metrics retrieved successfully',
    };
  }

  async getAdminRecentActivity() {
    const submissions = await this.prisma.submission.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            fname: true,
            lname: true,
            username: true,
            email: true,
          },
        },
        event: { select: { title: true } },
      },
    });

    const data = submissions.map((s) => {
      const member =
        s.user.fname || s.user.lname
          ? `${s.user.fname || ''} ${s.user.lname || ''}`.trim()
          : s.user.username || s.user.email;

      return {
        id: s.id,
        member,
        activity: s.event?.title || `${s.activityType} Run`,
        distance: `${s.distanceKm.toFixed(1)} km`,
        date: this.formatShortDate(s.runDate),
        status: s.status,
      };
    });

    return {
      status: 'success' as const,
      data,
      message: 'Recent activity feed retrieved successfully',
    };
  }

  // ---------------------------------------------------------------------------
  // MEMBER-SPECIFIC SUBMISSIONS (For Admin Member Detail Page)
  // ---------------------------------------------------------------------------

  async getMemberSubmissions(memberId: string, query: SubmissionQueryDto) {
    const page = Math.max(1, query.page || 1);
    const limit = Math.max(1, Math.min(100, query.limit || 10));
    const skip = (page - 1) * limit;

    const where: any = { userId: memberId };
    if (query.status) {
      where.status = query.status;
    }

    const [totalItems, rawList] = await Promise.all([
      this.prisma.submission.count({ where }),
      this.prisma.submission.findMany({
        where,
        skip,
        take: limit,
        orderBy: { runDate: 'desc' },
        include: {
          event: { select: { id: true, title: true } },
          challenge: { select: { id: true, title: true } },
        },
      }),
    ]);

    const items = rawList.map((s) => ({
      id: s.id,
      date: this.formatShortDate(s.runDate),
      activity: s.event?.title || s.challenge?.title || `${s.activityType} Run`,
      distance: `${s.distanceKm.toFixed(1)} km`,
      type: this.formatStatus(s.status),
      status: s.status,
    }));

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
      message: 'Member submissions retrieved successfully',
    };
  }
}

