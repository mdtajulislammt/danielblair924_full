import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from './prisma.service.js';

describe('PrismaService', () => {
  let service: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrismaService],
    }).compile();

    service = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should have all 11 domain models defined on client instance', () => {
    expect(service.user).toBeDefined();
    expect(service.event).toBeDefined();
    expect(service.eventRequirements).toBeDefined();
    expect(service.challenge).toBeDefined();
    expect(service.challengeParticipant).toBeDefined();
    expect(service.submission).toBeDefined();
    expect(service.badge).toBeDefined();
    expect(service.userBadge).toBeDefined();
    expect(service.newsPost).toBeDefined();
    expect(service.notificationSettings).toBeDefined();
    expect(service.userSession).toBeDefined();
  });
});

