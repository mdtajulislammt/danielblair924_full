import { jest } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { AdminDashboardController } from './admin-dashboard.controller.js';
import { SubmissionsService } from './submissions.service.js';

describe('AdminDashboardController', () => {
  let controller: AdminDashboardController;
  let service: any;

  beforeEach(async () => {
    service = {
      getAdminDashboardStats: jest.fn(),
      getAdminRecentActivity: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminDashboardController],
      providers: [{ provide: SubmissionsService, useValue: service }],
    }).compile();

    controller = module.get<AdminDashboardController>(AdminDashboardController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return admin dashboard stats', async () => {
    service.getAdminDashboardStats.mockResolvedValue({
      status: 'success',
      data: { activeMembers: 1284, pendingSubmissions: 24 },
    });

    const res = await controller.getDashboardStats();
    expect(res.status).toBe('success');
    expect(service.getAdminDashboardStats).toHaveBeenCalled();
  });

  it('should return admin recent activity', async () => {
    service.getAdminRecentActivity.mockResolvedValue({
      status: 'success',
      data: [{ id: 'sub-1', member: 'John' }],
    });

    const res = await controller.getRecentActivity();
    expect(res.status).toBe('success');
    expect(service.getAdminRecentActivity).toHaveBeenCalled();
  });
});

