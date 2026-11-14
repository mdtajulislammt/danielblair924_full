import { jest } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { NewsService, formatNewsDate } from './news.service.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { MediaService } from './media.service.js';

describe('NewsService', () => {
  let service: NewsService;
  let prisma: any;
  let mediaService: any;

  const mockDate = new Date('2025-08-20T12:00:00.000Z');

  const mockAuthor = {
    id: 'admin-1',
    fname: 'Super',
    lname: 'Admin',
    username: 'superadmin',
    email: 'admin@fmc.com',
    avatarUrl: '/uploads/avatars/admin.png',
  };

  const mockPost = {
    id: 'post-1',
    title: 'Community Marathon Update & Announcements',
    body: '<p>Welcome runners to the annual FMC marathon!</p>',
    coverImageUrl: '/uploads/news/cover-1.jpg',
    status: 'PUBLISHED',
    publishDate: mockDate,
    authorId: mockAuthor.id,
    author: mockAuthor,
    createdAt: mockDate,
    updatedAt: mockDate,
  };

  const mockDraftPost = {
    id: 'post-2',
    title: 'Upcoming September Events Schedule',
    body: '<p>Draft details of upcoming runs.</p>',
    coverImageUrl: null,
    status: 'DRAFT',
    publishDate: new Date('2026-09-01T00:00:00.000Z'),
    authorId: mockAuthor.id,
    author: mockAuthor,
    createdAt: mockDate,
    updatedAt: mockDate,
  };

  beforeEach(async () => {
    prisma = {
      newsPost: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
        count: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
    };

    mediaService = {
      saveFile: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NewsService,
        { provide: PrismaService, useValue: prisma },
        { provide: MediaService, useValue: mediaService },
      ],
    }).compile();

    service = module.get<NewsService>(NewsService);
  });

  describe('formatNewsDate helper', () => {
    it('should format date to "Month Day, Year"', () => {
      expect(formatNewsDate(mockDate)).toBe('Aug 20, 2025');
    });
  });

  describe('findAll', () => {
    it('should return published posts for public runners', async () => {
      prisma.newsPost.count.mockResolvedValue(1);
      prisma.newsPost.findMany.mockResolvedValue([mockPost]);

      const result = await service.findAll({ page: 1, limit: 10 }, false);

      expect(prisma.newsPost.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            status: 'PUBLISHED',
            publishDate: expect.any(Object),
          }),
        }),
      );
      expect(result.data).toHaveLength(1);
      expect(result.data[0].status).toBe('Published');
      expect(result.data[0].date).toBe('Aug 20, 2025');
      expect(result.data[0].icon).toBe('/uploads/news/cover-1.jpg');
      expect(result.total).toBe(1);
      expect(result.totalPages).toBe(1);
    });

    it('should allow admins to view all posts including drafts', async () => {
      prisma.newsPost.count.mockResolvedValue(2);
      prisma.newsPost.findMany.mockResolvedValue([mockPost, mockDraftPost]);

      const result = await service.findAll({ page: 1, limit: 10 }, true);

      expect(prisma.newsPost.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {},
        }),
      );
      expect(result.data).toHaveLength(2);
      expect(result.data[1].status).toBe('Draft');
    });

    it('should filter by status when admin requests specific status', async () => {
      prisma.newsPost.count.mockResolvedValue(1);
      prisma.newsPost.findMany.mockResolvedValue([mockDraftPost]);

      const result = await service.findAll(
        { page: 1, limit: 10, status: 'draft' },
        true,
      );

      expect(prisma.newsPost.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { status: 'DRAFT' },
        }),
      );
      expect(result.data[0].status).toBe('Draft');
    });

    it('should filter by search query in title or body', async () => {
      prisma.newsPost.count.mockResolvedValue(1);
      prisma.newsPost.findMany.mockResolvedValue([mockPost]);

      await service.findAll({ search: 'Marathon' }, true);

      expect(prisma.newsPost.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            OR: [
              { title: { contains: 'Marathon', mode: 'insensitive' } },
              { body: { contains: 'Marathon', mode: 'insensitive' } },
            ],
          },
        }),
      );
    });
  });

  describe('findById', () => {
    it('should return published post for public runner', async () => {
      prisma.newsPost.findUnique.mockResolvedValue(mockPost);

      const result = await service.findById('post-1', false);

      expect(result.id).toBe('post-1');
      expect(result.title).toBe(mockPost.title);
      expect(result.author?.name).toBe('Super Admin');
    });

    it('should throw NotFoundException if post not found', async () => {
      prisma.newsPost.findUnique.mockResolvedValue(null);

      await expect(service.findById('non-existent', false)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw NotFoundException if public runner requests draft post', async () => {
      prisma.newsPost.findUnique.mockResolvedValue(mockDraftPost);

      await expect(service.findById('post-2', false)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should allow admin to view draft post', async () => {
      prisma.newsPost.findUnique.mockResolvedValue(mockDraftPost);

      const result = await service.findById('post-2', true);

      expect(result.id).toBe('post-2');
      expect(result.status).toBe('Draft');
    });
  });

  describe('create', () => {
    it('should create a published post with provided fields', async () => {
      prisma.newsPost.create.mockResolvedValue(mockPost);

      const result = await service.create(
        {
          title: 'Community Marathon Update & Announcements',
          body: '<p>Welcome runners to the annual FMC marathon!</p>',
          coverImageUrl: '/uploads/news/cover-1.jpg',
        },
        'admin-1',
      );

      expect(prisma.newsPost.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            title: 'Community Marathon Update & Announcements',
            status: 'PUBLISHED',
            authorId: 'admin-1',
          }),
        }),
      );
      expect(result.id).toBe('post-1');
    });

    it('should create a draft post when isDraft=true', async () => {
      prisma.newsPost.create.mockResolvedValue(mockDraftPost);

      await service.create(
        {
          title: 'Upcoming September Events Schedule',
          body: '<p>Draft details of upcoming runs.</p>',
          isDraft: true,
        },
        'admin-1',
      );

      expect(prisma.newsPost.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            status: 'DRAFT',
          }),
        }),
      );
    });

    it('should upload coverImage file if file is passed', async () => {
      mediaService.saveFile.mockResolvedValue({
        url: '/uploads/news/uploaded-pic.png',
      });
      prisma.newsPost.create.mockResolvedValue({
        ...mockPost,
        coverImageUrl: '/uploads/news/uploaded-pic.png',
      });

      const mockFile = {
        originalname: 'photo.png',
        mimetype: 'image/png',
        size: 1024,
        buffer: Buffer.from('test'),
      };

      const result = await service.create(
        {
          title: 'Photo Announcement',
          body: '<p>Check out our event photos.</p>',
        },
        'admin-1',
        mockFile as any,
      );

      expect(mediaService.saveFile).toHaveBeenCalledWith(mockFile, 'news');
      expect(result.coverImageUrl).toBe('/uploads/news/uploaded-pic.png');
    });
  });

  describe('update', () => {
    it('should update news post fields', async () => {
      prisma.newsPost.findUnique.mockResolvedValue(mockPost);
      prisma.newsPost.update.mockResolvedValue({
        ...mockPost,
        title: 'Updated Marathon Announcements',
      });

      const result = await service.update('post-1', {
        title: 'Updated Marathon Announcements',
      });

      expect(prisma.newsPost.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'post-1' },
          data: expect.objectContaining({
            title: 'Updated Marathon Announcements',
          }),
        }),
      );
      expect(result.title).toBe('Updated Marathon Announcements');
    });

    it('should throw NotFoundException when updating non-existent post', async () => {
      prisma.newsPost.findUnique.mockResolvedValue(null);

      await expect(
        service.update('non-existent', { title: 'Updated' }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should upload new coverImage file if passed in update', async () => {
      prisma.newsPost.findUnique.mockResolvedValue(mockPost);
      mediaService.saveFile.mockResolvedValue({
        url: '/uploads/news/new-cover.jpg',
      });
      prisma.newsPost.update.mockResolvedValue({
        ...mockPost,
        coverImageUrl: '/uploads/news/new-cover.jpg',
      });

      const mockFile = {
        originalname: 'new.jpg',
        mimetype: 'image/jpeg',
        size: 2048,
        buffer: Buffer.from('img'),
      };

      const result = await service.update(
        'post-1',
        {},
        mockFile as any,
      );

      expect(mediaService.saveFile).toHaveBeenCalledWith(mockFile, 'news');
      expect(result.coverImageUrl).toBe('/uploads/news/new-cover.jpg');
    });
  });

  describe('delete', () => {
    it('should delete post if found', async () => {
      prisma.newsPost.findUnique.mockResolvedValue(mockPost);
      prisma.newsPost.delete.mockResolvedValue(mockPost);

      const result = await service.delete('post-1');

      expect(prisma.newsPost.delete).toHaveBeenCalledWith({
        where: { id: 'post-1' },
      });
      expect(result.status).toBe('success');
      expect(result.deletedId).toBe('post-1');
    });

    it('should throw NotFoundException if deleting non-existent post', async () => {
      prisma.newsPost.findUnique.mockResolvedValue(null);

      await expect(service.delete('non-existent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
