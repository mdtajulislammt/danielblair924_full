import { jest } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { AppNewsController } from './app-news.controller.js';
import { NewsService } from './news.service.js';

describe('AppNewsController', () => {
  let controller: AppNewsController;
  let service: any;

  const mockPost = {
    id: 'post-1',
    title: 'Mobile News Announcement',
    body: '<p>Mobile Content</p>',
    status: 'Published',
  };

  beforeEach(async () => {
    service = {
      findAll: jest.fn().mockResolvedValue({
        data: [mockPost],
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1,
      }),
      findById: jest.fn().mockResolvedValue(mockPost),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppNewsController],
      providers: [{ provide: NewsService, useValue: service }],
    }).compile();

    controller = module.get<AppNewsController>(AppNewsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should retrieve mobile runner news feed', async () => {
    const res = await controller.getMobileNewsFeed({ page: 1, limit: 10 });
    expect(service.findAll).toHaveBeenCalledWith({ page: 1, limit: 10 }, false);
    expect(res.data).toHaveLength(1);
    expect(res.data[0].id).toBe('post-1');
  });

  it('should retrieve mobile runner news detail', async () => {
    const res = await controller.getMobileNewsDetail('post-1');
    expect(service.findById).toHaveBeenCalledWith('post-1', false);
    expect(res.id).toBe('post-1');
  });
});
