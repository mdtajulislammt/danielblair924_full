import { jest } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { RunnerController } from './runner.controller.js';
import { SubmissionsService } from './submissions.service.js';

describe('RunnerController', () => {
  let controller: RunnerController;
  let service: any;

  beforeEach(async () => {
    service = {
      getRunnerDashboard: jest.fn(),
      getMySubmissions: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [RunnerController],
      providers: [{ provide: SubmissionsService, useValue: service }],
    }).compile();

    controller = module.get<RunnerController>(RunnerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should get runner dashboard', async () => {
    service.getRunnerDashboard.mockResolvedValue({
      status: 'success',
      data: { lifetimeDistanceKm: 84.0 },
    });

    const res = await controller.getDashboard('user-1');
    expect(res.status).toBe('success');
    expect(service.getRunnerDashboard).toHaveBeenCalledWith('user-1');
  });

  it('should get runner activities', async () => {
    service.getMySubmissions.mockResolvedValue({
      status: 'success',
      data: { items: [] },
    });

    const res = await controller.getActivities('user-1', { page: 1, limit: 10 });
    expect(res.status).toBe('success');
    expect(service.getMySubmissions).toHaveBeenCalledWith('user-1', { page: 1, limit: 10 });
  });
});

