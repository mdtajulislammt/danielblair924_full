import { jest } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { NewsController } from './news.controller.js';
import { NewsService } from './news.service.js';

describe('NewsController', () => {
  let controller: NewsController;
  let service: any;

  const mockPostResponse = {
    id: 'post-1',
    title: 'Public Marathon Announcement',
    body: '<p>Details</p>',
    status: 'Published',
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
      delete: jest.fn().mockResolvedValue({ status: 'success' }),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [NewsController],
      providers: [{ provide: NewsService, useValue: service }],
    }).compile();

    controller = module.get<NewsController>(NewsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should get published news (adminMode=false)', async () => {
    const res = await controller.getPublishedNews({ page: 1, limit: 10 });
    expect(service.findAll).toHaveBeenCalledWith(
      { page: 1, limit: 10 },
      false,
    );
    expect(res.data).toHaveLength(1);
  });

  it('should get single news by id (adminMode=false)', async () => {
    const res = await controller.getNewsById('post-1');
    expect(service.findById).toHaveBeenCalledWith('post-1', false);
    expect(res.id).toBe('post-1');
  });

  it('should allow admin to create news via /news endpoint', async () => {
    const dto = { title: 'New', body: '<p>Body</p>' };
    const res = await controller.createNews(dto, 'admin-1', undefined);
    expect(service.create).toHaveBeenCalledWith(dto, 'admin-1', undefined);
    expect(res.id).toBe('post-1');
  });

  it('should allow admin to update news via /news/:id endpoint', async () => {
    const dto = { title: 'Updated' };
    const res = await controller.updateNews('post-1', dto, undefined);
    expect(service.update).toHaveBeenCalledWith('post-1', dto, undefined);
    expect(res.id).toBe('post-1');
  });

  it('should allow admin to delete news via /news/:id endpoint', async () => {
    const res = await controller.deleteNews('post-1');
    expect(service.delete).toHaveBeenCalledWith('post-1');
    expect(res.status).toBe('success');
  });
});
