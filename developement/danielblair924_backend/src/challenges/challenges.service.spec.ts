import { jest } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { ChallengesService } from './challenges.service.js';
import { PrismaService } from '../prisma/prisma.service.js';
import {
  ChallengeScope,
  ChallengeStatus,
} from '../generated/prisma/client.js';

describe('ChallengesService', () => {
  let service: ChallengesService;
  let prisma: any;

  const mockChallenge = {
    id: 'ch-uuid-1',
    title: 'Run Around the World',
    description: 'Together we conquer 500 kilometers across the community.',
    scope: ChallengeScope.COMMUNITY_WIDE,
    status: ChallengeStatus.ACTIVE,
    currentProgress: 650.0,
    targetProgress: 500.0,
    progressUnit: 'km',
    coverImageUrl: '/images/ratw.png',
    startDate: new Date('2026-08-01T00:00:00Z'),
    endDate: new Date('2026-12-31T23:59:59Z'),
    requirements: {
      id: 'req-2',
      challengeId: 'ch-uuid-1',
      completeDistance: true,
      uploadRunningEvidence: true,
      postOnTikTok: true,
      tiktokCaptionInstructions: null,
      tagFirstMileClub: true,
      tagCollaboratingPage: false,
      collaboratingPageName: null,
      useSpecificHashtag: true,
      specificHashtag: '#RATW2026',
    },
    _count: { participants: 88, submissions: 154 },
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    prisma = {
      challenge: {
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        findFirst: jest.fn(),
        count: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
      challengeParticipant: {
        upsert: jest.fn(),
        findMany: jest.fn(),
        count: jest.fn(),
      },
      user: {
        aggregate: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChallengesService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<ChallengesService>(ChallengesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createChallenge', () => {
    it('should create a challenge with title and requirements', async () => {
      prisma.challenge.create.mockResolvedValue(mockChallenge);

      const dto = {
        title: 'Run Around the World',
        description: 'Together we conquer 500 kilometers across the community.',
        type: 'Community-wide',
        targetProgress: 500,
        progressUnit: 'km',
        requirements: {
          completeDistance: true,
          useSpecificHashtag: true,
          specificHashtag: '#RATW2026',
        },
      };

      const result = await service.createChallenge(dto as any);
      expect(result.status).toBe('success');
      expect(result.data.title).toBe('Run Around the World');
      expect(prisma.challenge.create).toHaveBeenCalled();
    });

    it('should create a challenge with challengeName fallback and individual scope', async () => {
      prisma.challenge.create.mockResolvedValue({
        ...mockChallenge,
        scope: ChallengeScope.INDIVIDUAL,
      });

      const dto = {
        challengeName: 'My Solo 50K',
        description: 'Individual monthly goal.',
        type: 'Individual',
      };

      const result = await service.createChallenge(dto as any);
      expect(result.status).toBe('success');
      expect(prisma.challenge.create).toHaveBeenCalled();
    });

    it('should throw BadRequestException if title/challengeName missing', async () => {
      await expect(
        service.createChallenge({ description: 'No title' } as any),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('getChallenges', () => {
    it('should return paginated challenges with progress percent and user participation', async () => {
      prisma.challenge.count.mockResolvedValue(1);
      prisma.challenge.findMany.mockResolvedValue([
        {
          ...mockChallenge,
          participants: [{ id: 'part-1', individualKm: 35.5 }],
        },
      ]);

      const result = await service.getChallenges(
        { page: 1, limit: 10, status: ChallengeStatus.ACTIVE },
        undefined,
        'user-runner-1',
      );

      expect(result.status).toBe('success');
      expect(result.data.items).toHaveLength(1);
      expect(result.data.items[0].isJoined).toBe(true);
      expect(result.data.items[0].userIndividualKm).toBe(35.5);
      expect(result.data.items[0].progressPercent).toBe(100); // 650/500 capped at 100
      expect(result.data.pagination.total).toBe(1);
    });
  });

  describe('getChallengeById', () => {
    it('should return challenge detail if found', async () => {
      prisma.challenge.findUnique.mockResolvedValue({
        ...mockChallenge,
        participants: [
          {
            id: 'part-1',
            individualKm: 45.0,
            joinedAt: new Date('2026-08-05T00:00:00Z'),
          },
        ],
      });

      const result = await service.getChallengeById('ch-uuid-1', 'user-runner-1');
      expect(result.status).toBe('success');
      expect(result.data.id).toBe('ch-uuid-1');
      expect(result.data.isJoined).toBe(true);
      expect(result.data.userIndividualKm).toBe(45.0);
    });

    it('should throw NotFoundException if challenge not found', async () => {
      prisma.challenge.findUnique.mockResolvedValue(null);

      await expect(service.getChallengeById('unknown-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('updateChallenge', () => {
    it('should update challenge fields', async () => {
      prisma.challenge.findUnique.mockResolvedValue(mockChallenge);
      prisma.challenge.update.mockResolvedValue({
        ...mockChallenge,
        targetProgress: 1000,
      });

      const result = await service.updateChallenge('ch-uuid-1', {
        targetProgress: 1000,
      });

      expect(result.status).toBe('success');
      expect(result.data.targetProgress).toBe(1000);
      expect(prisma.challenge.update).toHaveBeenCalled();
    });

    it('should throw NotFoundException if updating non-existent challenge', async () => {
      prisma.challenge.findUnique.mockResolvedValue(null);

      await expect(
        service.updateChallenge('non-existent', { title: 'Test' }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteChallenge', () => {
    it('should delete challenge successfully', async () => {
      prisma.challenge.findUnique.mockResolvedValue(mockChallenge);
      prisma.challenge.delete.mockResolvedValue(mockChallenge);

      const result = await service.deleteChallenge('ch-uuid-1');
      expect(result.status).toBe('success');
      expect(prisma.challenge.delete).toHaveBeenCalledWith({
        where: { id: 'ch-uuid-1' },
      });
    });

    it('should throw NotFoundException if deleting non-existent challenge', async () => {
      prisma.challenge.findUnique.mockResolvedValue(null);

      await expect(service.deleteChallenge('non-existent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('joinChallenge', () => {
    it('should upsert participant and return success', async () => {
      prisma.challenge.findUnique.mockResolvedValue(mockChallenge);
      prisma.challengeParticipant.upsert.mockResolvedValue({
        id: 'part-uuid-1',
        challengeId: 'ch-uuid-1',
        userId: 'user-runner-1',
        individualKm: 0.0,
        joinedAt: new Date(),
      });

      const result = await service.joinChallenge('ch-uuid-1', 'user-runner-1');
      expect(result.status).toBe('success');
      expect(result.data.challengeId).toBe('ch-uuid-1');
      expect(result.data.participantId).toBe('part-uuid-1');
    });

    it('should throw NotFoundException if joining non-existent challenge', async () => {
      prisma.challenge.findUnique.mockResolvedValue(null);

      await expect(
        service.joinChallenge('non-existent', 'user-runner-1'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('getChallengeParticipants', () => {
    it('should return leaderboard roster', async () => {
      prisma.challenge.findUnique.mockResolvedValue(mockChallenge);
      prisma.challengeParticipant.count.mockResolvedValue(1);
      prisma.challengeParticipant.findMany.mockResolvedValue([
        {
          id: 'part-1',
          individualKm: 198.7,
          joinedAt: new Date('2026-08-01T00:00:00Z'),
          user: {
            id: 'u-1',
            fname: 'Rakib',
            lname: 'S.',
            username: 'rakib',
            email: 'rakib@fmc.com',
            avatarUrl: '/avatars/rakib.png',
            city: 'Dhaka',
            country: 'Bangladesh',
          },
        },
      ]);

      const result = await service.getChallengeParticipants('ch-uuid-1', 1, 20);
      expect(result.status).toBe('success');
      expect(result.data.participants).toHaveLength(1);
      expect(result.data.participants[0].rank).toBe(1);
      expect(result.data.participants[0].name).toBe('Rakib S.');
      expect(result.data.participants[0].individualKm).toBe(198.7);
    });
  });

  describe('getDestinations', () => {
    it('should calculate milestone destinations dynamically based on challenge currentProgress', async () => {
      // Current progress is 650 km:
      // Bangladesh (0 km) -> Unlocked
      // India (500 km) -> Unlocked
      // Nepal (1,000 km) -> Current
      // China (2,500 km) -> Locked
      prisma.challenge.findUnique.mockResolvedValue({
        id: 'ch-uuid-1',
        currentProgress: 650.0,
      });

      const result = await service.getDestinations('ch-uuid-1');
      expect(result.status).toBe('success');
      expect(result.data.currentCollectiveKm).toBe(650.0);

      const dests = result.data.destinations;
      expect(dests[0].destination).toBe('Bangladesh');
      expect(dests[0].status).toBe('Unlocked');

      expect(dests[1].destination).toBe('India');
      expect(dests[1].status).toBe('Unlocked');

      expect(dests[2].destination).toBe('Nepal');
      expect(dests[2].status).toBe('Current');

      expect(dests[3].destination).toBe('China');
      expect(dests[3].status).toBe('Locked');
    });

    it('should fallback to active RATW challenge if challengeId not specified', async () => {
      prisma.challenge.findFirst.mockResolvedValue({
        id: 'ch-active-ratw',
        currentProgress: 1200.0,
      });

      const result = await service.getDestinations();
      expect(result.status).toBe('success');
      expect(result.data.currentCollectiveKm).toBe(1200.0);
      expect(result.data.destinations[2].status).toBe('Unlocked'); // Nepal (1000km) unlocked!
      expect(result.data.destinations[3].status).toBe('Current'); // China (2500km) current!
    });
  });
});

