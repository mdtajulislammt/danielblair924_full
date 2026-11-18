import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateEventDto } from './dto/create-event.dto.js';
import { UpdateEventDto } from './dto/update-event.dto.js';
import { EventQueryDto } from './dto/event-query.dto.js';
import { EventStatus, Prisma } from '../generated/prisma/client.js';

@Injectable()
export class EventsService {
  constructor(private readonly prisma: PrismaService) {}

  async createEvent(dto: CreateEventDto) {
    const title = dto.title || dto.eventName;
    if (!title || !title.trim()) {
      throw new BadRequestException('Event title or eventName is required');
    }

    let parsedDate: Date | null = null;
    if (dto.eventDate) {
      const d = new Date(dto.eventDate);
      if (!isNaN(d.getTime())) {
        parsedDate = d;
      }
    }

    const event = await this.prisma.event.create({
      data: {
        title: title.trim(),
        description: dto.description,
        eventDate: parsedDate,
        distanceType: dto.distanceType || null,
        coverImageUrl: dto.coverImageUrl || null,
        category: dto.category || 'General',
        status: dto.status || EventStatus.DRAFT,
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
      data: event,
    };
  }

  async getEvents(query: EventQueryDto, defaultStatus?: EventStatus) {
    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.max(1, Math.min(100, Number(query.limit) || 10));
    const skip = (page - 1) * limit;

    const where: Prisma.EventWhereInput = {};

    if (query.status) {
      where.status = query.status;
    } else if (defaultStatus) {
      where.status = defaultStatus;
    }

    if (query.category) {
      where.category = { equals: query.category, mode: 'insensitive' };
    }

    if (query.distanceType) {
      where.distanceType = { equals: query.distanceType, mode: 'insensitive' };
    }

    if (query.search) {
      where.OR = [
        { title: { contains: query.search, mode: 'insensitive' } },
        { description: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    const [total, rawEvents] = await Promise.all([
      this.prisma.event.count({ where }),
      this.prisma.event.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          requirements: true,
          _count: {
            select: {
              submissions: true,
            },
          },
        },
      }),
    ]);

    const items = rawEvents.map((evt) => ({
      id: evt.id,
      title: evt.title,
      eventName: evt.title,
      description: evt.description,
      eventDate: evt.eventDate,
      distanceType: evt.distanceType,
      coverImageUrl: evt.coverImageUrl,
      status: evt.status,
      category: evt.category,
      registeredCount: evt.registeredCount,
      submissionsCount: evt._count.submissions,
      requirements: evt.requirements,
      createdAt: evt.createdAt,
      updatedAt: evt.updatedAt,
    }));

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

  async getEventById(id: string, userId?: string) {
    const event = await this.prisma.event.findUnique({
      where: { id },
      include: {
        requirements: true,
        _count: {
          select: {
            submissions: true,
          },
        },
      },
    });

    if (!event) {
      throw new NotFoundException(`Event with ID '${id}' not found`);
    }

    let isJoined = false;
    let hasSubmitted = false;

    if (userId) {
      const userSubmission = await this.prisma.submission.findFirst({
        where: {
          eventId: id,
          userId,
        },
      });
      if (userSubmission) {
        hasSubmitted = true;
        isJoined = true;
      }
    }

    return {
      status: 'success' as const,
      data: {
        id: event.id,
        title: event.title,
        eventName: event.title,
        description: event.description,
        eventDate: event.eventDate,
        distanceType: event.distanceType,
        coverImageUrl: event.coverImageUrl,
        status: event.status,
        category: event.category,
        registeredCount: event.registeredCount,
        submissionsCount: event._count.submissions,
        requirements: event.requirements,
        isJoined,
        hasSubmitted,
        createdAt: event.createdAt,
        updatedAt: event.updatedAt,
      },
    };
  }

  async updateEvent(id: string, dto: UpdateEventDto) {
    const existing = await this.prisma.event.findUnique({
      where: { id },
      include: { requirements: true },
    });

    if (!existing) {
      throw new NotFoundException(`Event with ID '${id}' not found`);
    }

    const data: Prisma.EventUpdateInput = {};

    const title = dto.title || dto.eventName;
    if (title) {
      data.title = title.trim();
    }
    if (dto.description !== undefined) {
      data.description = dto.description;
    }
    if (dto.eventDate !== undefined) {
      if (dto.eventDate) {
        const d = new Date(dto.eventDate);
        data.eventDate = isNaN(d.getTime()) ? null : d;
      } else {
        data.eventDate = null;
      }
    }
    if (dto.distanceType !== undefined) {
      data.distanceType = dto.distanceType || null;
    }
    if (dto.coverImageUrl !== undefined) {
      data.coverImageUrl = dto.coverImageUrl || null;
    }
    if (dto.category !== undefined) {
      data.category = dto.category || 'General';
    }
    if (dto.status !== undefined) {
      data.status = dto.status;
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

    const updated = await this.prisma.event.update({
      where: { id },
      data,
      include: { requirements: true },
    });

    return {
      status: 'success' as const,
      data: updated,
    };
  }

  async deleteEvent(id: string) {
    const existing = await this.prisma.event.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException(`Event with ID '${id}' not found`);
    }

    await this.prisma.event.delete({
      where: { id },
    });

    return {
      status: 'success' as const,
      message: `Event '${existing.title}' successfully deleted`,
    };
  }

  async joinEvent(eventId: string, userId: string) {
    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!event) {
      throw new NotFoundException(`Event with ID '${eventId}' not found`);
    }

    // Check if user already joined this event to prevent duplicate entries
    const existingEntry = await this.prisma.eventParticipant.findUnique({
      where: {
        eventId_userId: {
          eventId,
          userId,
        },
      },
    });

    if (existingEntry) {
      throw new ConflictException(`You have already joined '${event.title}'`);
    }

    // Atomic transaction: create participant record and increment registeredCount
    const { updatedEvent } = await this.prisma.$transaction(async (tx) => {
      await tx.eventParticipant.create({
        data: {
          eventId,
          userId,
        },
      });

      const updated = await tx.event.update({
        where: { id: eventId },
        data: {
          registeredCount: {
            increment: 1,
          },
        },
      });

      return { updatedEvent: updated };
    });

    return {
      status: 'success' as const,
      message: `Successfully registered for event '${event.title}'`,
      data: {
        eventId: updatedEvent.id,
        title: updatedEvent.title,
        registeredCount: updatedEvent.registeredCount,
      },
    };
  }

  async checkIn(eventId: string, userId?: string) {
    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!event) {
      throw new NotFoundException(`Event with ID '${eventId}' not found`);
    }

    const now = new Date();

    if (userId) {
      // Upsert participant record with real NFC check-in timestamp
      await this.prisma.eventParticipant.upsert({
        where: {
          eventId_userId: {
            eventId,
            userId,
          },
        },
        update: {
          checkedIn: true,
          checkedInAt: now,
        },
        create: {
          eventId,
          userId,
          checkedIn: true,
          checkedInAt: now,
        },
      });
    }

    return {
      status: 'success' as const,
      message: `Real-time NFC check-in confirmed for '${event.title}'`,
      data: {
        eventId: event.id,
        eventTitle: event.title,
        checkedInAt: now.toISOString(),
        userId,
      },
    };
  }

  async checkInLatest(userId?: string) {
    const event = await this.prisma.event.findFirst({
      where: { status: EventStatus.PUBLISHED },
      orderBy: { eventDate: 'asc' },
    });

    if (!event) {
      throw new NotFoundException('No active published event found for check-in');
    }

    return this.checkIn(event.id, userId);
  }

  async getEventParticipants(eventId: string, page = 1, limit = 10) {
    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!event) {
      throw new NotFoundException(`Event with ID '${eventId}' not found`);
    }

    const pageNum = Math.max(1, Number(page) || 1);
    const limitNum = Math.max(1, Math.min(100, Number(limit) || 10));
    const skip = (pageNum - 1) * limitNum;

    const [total, submissions] = await Promise.all([
      this.prisma.submission.count({
        where: { eventId },
      }),
      this.prisma.submission.findMany({
        where: { eventId },
        skip,
        take: limitNum,
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
              totalDistanceKm: true,
              joinDate: true,
            },
          },
        },
      }),
    ]);

    const participants = submissions.map((sub) => {
      const name =
        sub.user.fname || sub.user.lname
          ? `${sub.user.fname || ''} ${sub.user.lname || ''}`.trim()
          : sub.user.username || sub.user.email;
      const initials = (name.slice(0, 2) || 'RM').toUpperCase();

      return {
        id: sub.user.id,
        submissionId: sub.id,
        name,
        initials,
        email: sub.user.email,
        avatarUrl: sub.user.avatarUrl,
        joinDate: sub.createdAt.toISOString().split('T')[0],
        distanceKm: sub.distanceKm,
        submissionStatus: sub.status,
        duration: sub.duration,
        pace: sub.pace,
      };
    });

    return {
      status: 'success' as const,
      data: {
        event: {
          id: event.id,
          title: event.title,
          registeredCount: event.registeredCount,
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
}
