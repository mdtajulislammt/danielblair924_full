import { jest } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { SubmissionsService } from './submissions.service.js';
import { PrismaService } from '../prisma/prisma.service.js';

describe('SubmissionsService', () => {
  let service: SubmissionsService;
  let prisma: any;

  const mockUser = {
    id: 'user-runner-1',
    email: 'runner@fmc.com',
    username: 'runner_john',
    fname: 'John',
    lname: 'Doe',
    avatarUrl: '/avatars/john.png',
    role: 'MEMBER',
    status: 'ACTIVE',
    totalDistanceKm: 42.0,
    _count: { badges: 3 },
  };

  const mockSubmission = {
    id: 'sub-uuid-1',
    userId: 'user-runner-1',
    eventId: 'evt-10k-1',
    challengeId: null,
    activityType: 'RUNNING',
    distanceKm: 10.0,
    duration: '55m 00s',
    pace: '5:30 /km',
    runDate: new Date('2026-08-21T08:00:00Z'),
    stravaImageUrl: '/uploads/strava.png',
    gpsImageUrl: '/uploads/gps.png',
    postedOnTikTok: true,
    taggedClub: true,
    usedHashtag: true,
    status: 'PENDING',
    rejectionReason: null,
    reviewedAt: null,
    reviewedById: null,
    createdAt: new Date('2026-08-21T09:00:00Z'),
    updatedAt: new Date('2026-08-21T09:00:00Z'),
    user: mockUser,
    event: { id: 'evt-10k-1', title: '10K Challenge', distanceType: '10K', eventDate: new Date() },
    challenge: null,
  };

  beforeEach(async () => {
    prisma = {
      user: {
        findUnique: jest.fn(),
        update: jest.fn(),
        count: jest.fn(),
      },
      submission: {
        findUnique: jest.fn(),
        findMany: jest.fn(),
        count: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        groupBy: jest.fn(),
      },
      event: {
        findUnique: jest.fn(),
        count: jest.fn(),
      },
      challenge: {
        findUnique: jest.fn(),
        findFirst: jest.fn(),
        update: jest.fn(),
        count: jest.fn(),
      },
      challengeParticipant: {
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
      },
      badge: {
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
      },
      userBadge: {
        findUnique: jest.fn(),
        create: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SubmissionsService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<SubmissionsService>(SubmissionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Pace Calculation', () => {
    it('should calculate pace correctly from hour and minute string', () => {
      const pace = service.calculatePace(10, '1h 00m');
      expect(pace).toBe('6:00 /km');
    });

    it('should calculate pace from colon notation MM:SS', () => {
      const pace = service.calculatePace(5, '25:00');
      expect(pace).toBe('5:00 /km');
    });

    it('should fallback cleanly on invalid input', () => {
      const pace = service.calculatePace(0, '');
      expect(pace).toBe('5:30 /km');
    });
  });

  describe('createDraft', () => {
    it('should throw NotFoundException if user does not exist', async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      await expect(
        service.createDraft('invalid-user', {
          distanceKm: 5.0,
          duration: '30m',
          runDate: new Date(),
        }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if user is SUSPENDED', async () => {
      prisma.user.findUnique.mockResolvedValue({
        ...mockUser,
        status: 'SUSPENDED',
      });
      await expect(
        service.createDraft(mockUser.id, {
          distanceKm: 5.0,
          duration: '30m',
          runDate: new Date(),
        }),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should create draft submission and calculate pace', async () => {
      prisma.user.findUnique.mockResolvedValue(mockUser);
      prisma.submission.create.mockResolvedValue({
        ...mockSubmission,
        distanceKm: 5.0,
        pace: '6:00 /km',
      });

      const result = await service.createDraft(mockUser.id, {
        distanceKm: 5.0,
        duration: '30m',
        runDate: '2026-08-21T08:00:00Z',
      });

      expect(result.status).toBe('success');
      expect(prisma.submission.create).toHaveBeenCalled();
    });
  });

  describe('uploadProofImages', () => {
    it('should throw NotFoundException if submission does not exist', async () => {
      prisma.submission.findUnique.mockResolvedValue(null);
      await expect(
        service.uploadProofImages('user-1', 'sub-invalid', {}),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if user is not author or admin', async () => {
      prisma.submission.findUnique.mockResolvedValue(mockSubmission);
      await expect(
        service.uploadProofImages('other-user', mockSubmission.id, {}, 'MEMBER'),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should update proofs for owner', async () => {
      prisma.submission.findUnique.mockResolvedValue(mockSubmission);
      prisma.submission.update.mockResolvedValue({
        ...mockSubmission,
        stravaImageUrl: '/new/strava.png',
      });

      const res = await service.uploadProofImages(mockUser.id, mockSubmission.id, {
        stravaImageUrl: '/new/strava.png',
      });

      expect(res.status).toBe('success');
      expect(prisma.submission.update).toHaveBeenCalled();
    });
  });

  describe('finalizeSubmission', () => {
    it('should finalize and set status to PENDING', async () => {
      prisma.submission.findUnique.mockResolvedValue(mockSubmission);
      prisma.submission.update.mockResolvedValue({
        ...mockSubmission,
        status: 'PENDING',
        postedOnTikTok: true,
      });

      const res = await service.finalizeSubmission(mockUser.id, mockSubmission.id, {
        postedOnTikTok: true,
      });

      expect(res.status).toBe('success');
      expect(prisma.submission.update).toHaveBeenCalled();
    });
  });

  describe('getSubmissionById', () => {
    it('should return formatted submission detail', async () => {
      prisma.submission.findUnique.mockResolvedValue(mockSubmission);

      const res = await service.getSubmissionById(mockSubmission.id, {
        id: mockUser.id,
        role: 'MEMBER',
      });

      expect(res.status).toBe('success');
      expect(res.data.member).toBe('John Doe');
      expect(res.data.distance).toBe('10.0 km');
    });

    it('should throw ForbiddenException if member accesses another runner submission', async () => {
      prisma.submission.findUnique.mockResolvedValue(mockSubmission);

      await expect(
        service.getSubmissionById(mockSubmission.id, {
          id: 'stranger-id',
          role: 'MEMBER',
        }),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('getMySubmissions', () => {
    it('should return paginated submissions for user', async () => {
      prisma.submission.count.mockResolvedValue(1);
      prisma.submission.findMany.mockResolvedValue([mockSubmission]);

      const res = await service.getMySubmissions(mockUser.id, { page: 1, limit: 10 });
      expect(res.status).toBe('success');
      expect(res.data.items).toHaveLength(1);
      expect(res.data.pagination.totalItems).toBe(1);
    });
  });

  describe('getFinisherCard', () => {
    it('should generate finisher card data with congratulations message', async () => {
      prisma.submission.findUnique.mockResolvedValue({
        ...mockSubmission,
        user: {
          ...mockUser,
          badges: [],
        },
      });

      const res = await service.getFinisherCard(mockSubmission.id);
      expect(res.status).toBe('success');
      expect(res.data.runnerName).toBe('John Doe');
      expect(res.data.distance).toBe('10.0 km');
      expect(res.data.congratulationsMessage).toContain('10K');
    });
  });

  describe('getRunnerDashboard', () => {
    it('should return runner metrics and rank', async () => {
      prisma.user.findUnique.mockResolvedValue(mockUser);
      prisma.user.count.mockResolvedValue(5);
      prisma.submission.groupBy.mockResolvedValue([{ eventId: 'evt-1' }]);
      prisma.challenge.findFirst.mockResolvedValue({
        id: 'ch-ratw-1',
        title: 'Run Around the World',
        currentProgress: 200,
        targetProgress: 500,
        progressUnit: 'km',
      });
      prisma.submission.findMany.mockResolvedValue([mockSubmission]);

      const res = await service.getRunnerDashboard(mockUser.id);
      expect(res.status).toBe('success');
      expect(res.data.lifetimeDistanceKm).toBe(42.0);
      expect(res.data.currentRank).toBe(6);
      expect(res.data.eventsJoined).toBe(1);
    });
  });

  describe('Admin Moderation: approveSubmission', () => {
    it('should approve submission, accredit user distance, and check badges', async () => {
      prisma.submission.findUnique.mockResolvedValue({
        ...mockSubmission,
        status: 'PENDING',
        challengeId: null,
      });
      prisma.submission.update.mockResolvedValue({
        ...mockSubmission,
        status: 'APPROVED',
        reviewedAt: new Date(),
      });
      prisma.user.update.mockResolvedValue({
        ...mockUser,
        totalDistanceKm: 52.0,
      });

      // Badges mock
      prisma.badge.findUnique.mockResolvedValue(null);
      prisma.badge.create.mockResolvedValue({
        id: 'badge-1',
        slug: '10k-finisher',
        name: '10K Finisher',
        description: 'Completed 10k',
        iconUrl: '/badges/10k.png',
      });
      prisma.userBadge.findUnique.mockResolvedValue(null);
      prisma.userBadge.create.mockResolvedValue({ id: 'ub-1' });
      prisma.badge.update.mockResolvedValue({});

      const res = await service.approveSubmission(mockSubmission.id, 'admin-1');
      expect(res.status).toBe('success');
      expect(res.data.submission.status).toBe('APPROVED');
      expect(res.data.userTotalDistanceKm).toBe(52.0);
      expect(prisma.user.update).toHaveBeenCalled();
    });

    it('should not duplicate distance if submission was already approved', async () => {
      prisma.submission.findUnique.mockResolvedValue({
        ...mockSubmission,
        status: 'APPROVED',
      });
      prisma.submission.update.mockResolvedValue({
        ...mockSubmission,
        status: 'APPROVED',
      });

      const res = await service.approveSubmission(mockSubmission.id, 'admin-1');
      expect(res.status).toBe('success');
      expect(prisma.user.update).not.toHaveBeenCalled();
    });
  });

  describe('Admin Moderation: rejectSubmission', () => {
    it('should reject submission and store rejection reason', async () => {
      prisma.submission.findUnique.mockResolvedValue({
        ...mockSubmission,
        status: 'PENDING',
      });
      prisma.submission.update.mockResolvedValue({
        ...mockSubmission,
        status: 'REJECTED',
        rejectionReason: 'Invalid Strava link',
        reviewedAt: new Date(),
      });

      const res = await service.rejectSubmission(mockSubmission.id, 'admin-1', {
        reason: 'Invalid Strava link',
      });

      expect(res.status).toBe('success');
      expect(res.data.status).toBe('REJECTED');
      expect(res.data.rejectionReason).toBe('Invalid Strava link');
    });

    it('should deduct accredited distance if previously approved submission is rejected', async () => {
      prisma.submission.findUnique.mockResolvedValue({
        ...mockSubmission,
        status: 'APPROVED',
      });
      prisma.user.update.mockResolvedValue({
        ...mockUser,
        totalDistanceKm: 32.0,
      });
      prisma.submission.update.mockResolvedValue({
        ...mockSubmission,
        status: 'REJECTED',
      });

      await service.rejectSubmission(mockSubmission.id, 'admin-1', {
        reason: 'Duplicate screenshot detected upon review',
      });

      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: mockUser.id },
        data: { totalDistanceKm: 32.0 },
      });
    });
  });

  describe('Admin Dashboard Stats & Recent Activity', () => {
    it('should return overview stats', async () => {
      prisma.user.count.mockResolvedValue(1284);
      prisma.submission.count.mockResolvedValue(24);
      prisma.event.count.mockResolvedValue(7);
      prisma.challenge.count.mockResolvedValue(12);

      const res = await service.getAdminDashboardStats();
      expect(res.status).toBe('success');
      expect(res.data.activeMembers).toBe(1284);
      expect(res.data.pendingSubmissions).toBe(24);
    });

    it('should return recent activities', async () => {
      prisma.submission.findMany.mockResolvedValue([mockSubmission]);

      const res = await service.getAdminRecentActivity();
      expect(res.status).toBe('success');
      expect(res.data).toHaveLength(1);
      expect(res.data[0].member).toBe('John Doe');
    });
  });
});

