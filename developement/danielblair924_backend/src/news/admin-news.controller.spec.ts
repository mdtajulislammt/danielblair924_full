import { jest } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { AdminNewsController } from './admin-news.controller.js';
import { NewsService } from './news.service.js';

describe('AdminNewsController', () => {
  let controller: AdminNewsController;
  let service: any;

  const mockPostResponse = {
    id: 'post-1',
    title: 'Marathon News',
    body: '<p>Content</p>',
    status: 'Published',
    date: 'Aug 20, 2025',
  };

  beforeEach(async () => {
    service = {
      findAll: jest.fn().mockResolvedValue({
        data: [mockPostResponse],
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1,
      }),
      findById: jest.fn().mockResolvedValue(mockPostResponse),
      create: jest.fn().mockResolvedValue(mockPostResponse),
      update: jest.fn().mockResolvedValue(mockPostResponse),
      delete: jest.fn().mockResolvedValue({
        status: 'success',
        message: 'News post deleted successfully',
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminNewsController],
      providers: [{ provide: NewsService, useValue: service }],
    }).compile();

    controller = module.get<AdminNewsController>(AdminNewsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call findAll with adminMode=true', async () => {
    const res = await controller.getAdminNews({ page: 1, limit: 10 });
    expect(service.findAll).toHaveBeenCalledWith({ page: 1, limit: 10 }, true);
    expect(res.data).toHaveLength(1);
  });

  it('should call findById with adminMode=true', async () => {
    const res = await controller.getAdminNewsById('post-1');
    expect(service.findById).toHaveBeenCalledWith('post-1', true);
    expect(res.id).toBe('post-1');
  });

  it('should call create with dto, authorId, and optional file', async () => {
    const dto = { title: 'New Event', body: '<p>Body text here</p>' };
    const res = await controller.createNewsPost(dto, 'admin-1', undefined);
    expect(service.create).toHaveBeenCalledWith(dto, 'admin-1', undefined);
    expect(res.id).toBe('post-1');
  });

  it('should call update with id, dto, and optional file', async () => {
    const dto = { title: 'Updated Title' };
    const res = await controller.updateNewsPost('post-1', dto, undefined);
    expect(service.update).toHaveBeenCalledWith('post-1', dto, undefined);
    expect(res.id).toBe('post-1');
  });

  it('should call delete with id', async () => {
    const res = await controller.deleteNewsPost('post-1');
    expect(service.delete).toHaveBeenCalledWith('post-1');
    expect(res.status).toBe('success');
  });
});
