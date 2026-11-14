import { jest } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { EventsService } from './events.service.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { EventStatus } from '../generated/prisma/client.js';

describe('EventsService', () => {
  let service: EventsService;
  let prisma: any;

  const mockEvent = {
    id: 'evt-uuid-1',
    title: 'Run For Life 2026',
    description: 'Annual community 10K running challenge.',
    eventDate: new Date('2026-09-10T08:00:00Z'),
    distanceType: '10K',
    coverImageUrl: '/images/run-for-life.png',
    status: EventStatus.PUBLISHED,
    category: '10K',
    registeredCount: 42,
    requirements: {
      id: 'req-1',
      eventId: 'evt-uuid-1',
      completeDistance: true,
      uploadRunningEvidence: true,
      postOnTikTok: true,
      tiktokCaptionInstructions: 'Tag @firstmileclub',
      tagFirstMileClub: true,
      tagCollaboratingPage: false,
      collaboratingPageName: null,
      useSpecificHashtag: true,
      specificHashtag: '#RunForLife2026',
    },
    _count: { submissions: 15 },
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    prisma = {
      event: {
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        count: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
      submission: {
        findFirst: jest.fn(),
        findMany: jest.fn(),
        count: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventsService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<EventsService>(EventsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createEvent', () => {
    it('should create an event with title and requirements', async () => {
      prisma.event.create.mockResolvedValue(mockEvent);

      const dto = {
        title: 'Run For Life 2026',
        description: 'Annual community 10K running challenge.',
        eventDate: '2026-09-10T08:00:00Z',
        distanceType: '10K',
        requirements: {
          completeDistance: true,
          uploadRunningEvidence: true,
          postOnTikTok: true,
          tagFirstMileClub: true,
          useSpecificHashtag: true,
          specificHashtag: '#RunForLife2026',
        },
      };

      const result = await service.createEvent(dto);
      expect(result.status).toBe('success');
      expect(result.data.title).toBe('Run For Life 2026');
      expect(prisma.event.create).toHaveBeenCalled();
    });

    it('should create an event with eventName fallback', async () => {
      prisma.event.create.mockResolvedValue(mockEvent);

      const dto = {
        eventName: 'Run For Life 2026',
        description: 'Annual community 10K running challenge.',
      };

      const result = await service.createEvent(dto);
      expect(result.status).toBe('success');
      expect(prisma.event.create).toHaveBeenCalled();
    });

    it('should throw BadRequestException if title/eventName missing', async () => {
      await expect(
        service.createEvent({ description: 'No title' } as any),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('getEvents', () => {
    it('should return paginated events with filters', async () => {
      prisma.event.count.mockResolvedValue(1);
      prisma.event.findMany.mockResolvedValue([mockEvent]);

      const result = await service.getEvents({
        page: 1,
        limit: 10,
        status: EventStatus.PUBLISHED,
        category: '10K',
        search: 'Life',
      });

      expect(result.status).toBe('success');
      expect(result.data.items).toHaveLength(1);
      expect(result.data.items[0].title).toBe('Run For Life 2026');
      expect(result.data.pagination.total).toBe(1);
    });
  });

  describe('getEventById', () => {
    it('should return event details if found', async () => {
      prisma.event.findUnique.mockResolvedValue(mockEvent);
      prisma.submission.findFirst.mockResolvedValue({ id: 'sub-1' });

      const result = await service.getEventById('evt-uuid-1', 'user-1');
      expect(result.status).toBe('success');
      expect(result.data.isJoined).toBe(true);
      expect(result.data.hasSubmitted).toBe(true);
      expect(result.data.id).toBe('evt-uuid-1');
    });

    it('should throw NotFoundException if event does not exist', async () => {
      prisma.event.findUnique.mockResolvedValue(null);

      await expect(service.getEventById('unknown-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('updateEvent', () => {
    it('should update event and requirements', async () => {
      prisma.event.findUnique.mockResolvedValue(mockEvent);
      prisma.event.update.mockResolvedValue({
        ...mockEvent,
        title: 'Updated Event Title',
      });

      const result = await service.updateEvent('evt-uuid-1', {
        title: 'Updated Event Title',
        requirements: { specificHashtag: '#NewTag' },
      });

      expect(result.status).toBe('success');
      expect(result.data.title).toBe('Updated Event Title');
    });

    it('should throw NotFoundException on updating non-existent event', async () => {
      prisma.event.findUnique.mockResolvedValue(null);

      await expect(
        service.updateEvent('non-existent', { title: 'Test' }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteEvent', () => {
    it('should delete event successfully', async () => {
      prisma.event.findUnique.mockResolvedValue(mockEvent);
      prisma.event.delete.mockResolvedValue(mockEvent);

      const result = await service.deleteEvent('evt-uuid-1');
      expect(result.status).toBe('success');
      expect(prisma.event.delete).toHaveBeenCalledWith({
        where: { id: 'evt-uuid-1' },
      });
    });

    it('should throw NotFoundException if deleting non-existent event', async () => {
      prisma.event.findUnique.mockResolvedValue(null);

      await expect(service.deleteEvent('non-existent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('joinEvent', () => {
    it('should increment registeredCount when runner joins', async () => {
      prisma.event.findUnique.mockResolvedValue(mockEvent);
      prisma.event.update.mockResolvedValue({
        ...mockEvent,
        registeredCount: 43,
      });

      const result = await service.joinEvent('evt-uuid-1', 'runner-user-1');
      expect(result.status).toBe('success');
      expect(result.data.registeredCount).toBe(43);
      expect(prisma.event.update).toHaveBeenCalled();
    });

    it('should throw NotFoundException if joining non-existent event', async () => {
      prisma.event.findUnique.mockResolvedValue(null);

      await expect(
        service.joinEvent('non-existent', 'runner-1'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('getEventParticipants', () => {
    it('should return participants for an event', async () => {
      prisma.event.findUnique.mockResolvedValue(mockEvent);
      prisma.submission.count.mockResolvedValue(1);
      prisma.submission.findMany.mockResolvedValue([
        {
          id: 'sub-1',
          distanceKm: 10.0,
          duration: '50m',
          pace: '5:00/km',
          status: 'APPROVED',
          createdAt: new Date('2026-08-20T10:00:00Z'),
          user: {
            id: 'u-1',
            fname: 'Alice',
            lname: 'Walker',
            username: 'alicew',
            email: 'alice@example.com',
            avatarUrl: null,
            totalDistanceKm: 100.0,
            joinDate: new Date(),
          },
        },
      ]);

      const result = await service.getEventParticipants('evt-uuid-1');
      expect(result.status).toBe('success');
      expect(result.data.participants).toHaveLength(1);
      expect(result.data.participants[0].name).toBe('Alice Walker');
      expect(result.data.participants[0].initials).toBe('AL');
    });
  });
});

