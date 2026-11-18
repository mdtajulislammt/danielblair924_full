import { jest } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { StravaService } from './strava.service.js';
import { StravaController } from './strava.controller.js';
import { PrismaService } from '../prisma/prisma.service.js';

describe('StravaService & StravaController', () => {
  let service: StravaService;
  let controller: StravaController;
  let prisma: PrismaService;

  const mockPrisma = {
    user: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    submission: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
    challenge: {
      findFirst: jest.fn(),
      update: jest.fn(),
    },
    challengeParticipant: {
      findUnique: jest.fn(),
      update: jest.fn(),
      create: jest.fn(),
    },
    $transaction: jest.fn((callback) => callback(mockPrisma)),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StravaController],
      providers: [
        StravaService,
        {
          provide: PrismaService,
          useValue: mockPrisma,
        },
      ],
    }).compile();

    service = module.get<StravaService>(StravaService);
    controller = module.get<StravaController>(StravaController);
    prisma = module.get<PrismaService>(PrismaService);
    jest.clearAllMocks();
  });

  describe('getAuthorizeUrl', () => {
    it('should generate valid Strava oauth authorize url', () => {
      const res = controller.getAuthUrl({ id: 'user-123' });
      expect(res.url).toContain('https://www.strava.com/oauth/authorize');
      expect(res.url).toContain('state=user-123');
      expect(res.url).toContain('read%2Cactivity%3Aread_all');
    });
  });

  describe('getStatus', () => {
    it('should return Strava connection status for user', async () => {
      (mockPrisma.user.findUnique as jest.Mock).mockResolvedValue({
        id: 'user-123',
        isStravaConnected: true,
        stravaAthleteId: 'athlete-999',
        stravaTokenExpiresAt: new Date(),
      });

      const res = await controller.getStatus({ id: 'user-123' });
      expect(res.status).toBe('success');
      expect(res.data.isConnected).toBe(true);
      expect(res.data.athleteId).toBe('athlete-999');
    });
  });

  describe('disconnect', () => {
    it('should disconnect connected user', async () => {
      (mockPrisma.user.findUnique as jest.Mock).mockResolvedValue({
        id: 'user-123',
        isStravaConnected: true,
        stravaAccessToken: 'test-token',
      });
      (mockPrisma.user.update as jest.Mock).mockResolvedValue({
        id: 'user-123',
        isStravaConnected: false,
      });

      const res = await controller.disconnect({ id: 'user-123' });
      expect(res.status).toBe('success');
      expect(mockPrisma.user.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'user-123' },
          data: expect.objectContaining({ isStravaConnected: false }),
        }),
      );
    });
  });

  describe('verifyWebhook', () => {
    it('should verify webhook subscription challenge', () => {
      const challenge = 'test-challenge-123';
      const verifyToken = 'fmc_strava_webhook_verification_token_2026';
      const res = controller.verifyWebhook('subscribe', verifyToken, challenge);
      expect(res['hub.challenge']).toBe(challenge);
    });
  });

  describe('handleWebhook', () => {
    it('should acknowledge receipt immediately', async () => {
      const res = await controller.handleWebhook({
        object_type: 'activity',
        aspect_type: 'create',
        object_id: 12345,
        owner_id: 9999,
      });
      expect(res.received).toBe(true);
    });
  });
});
