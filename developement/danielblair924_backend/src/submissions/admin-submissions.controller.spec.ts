import { jest } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { AdminSubmissionsController } from './admin-submissions.controller.js';
import { SubmissionsService } from './submissions.service.js';

describe('AdminSubmissionsController', () => {
  let controller: AdminSubmissionsController;
  let service: any;

  beforeEach(async () => {
    service = {
      getAdminSubmissions: jest.fn(),
      getSubmissionById: jest.fn(),
      approveSubmission: jest.fn(),
      rejectSubmission: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminSubmissionsController],
      providers: [{ provide: SubmissionsService, useValue: service }],
    }).compile();

    controller = module.get<AdminSubmissionsController>(AdminSubmissionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should get submissions queue', async () => {
    service.getAdminSubmissions.mockResolvedValue({
      status: 'success',
      data: { items: [], pagination: { totalItems: 0 } },
    });

    const res = await controller.getSubmissions({ status: 'PENDING' });
    expect(res.status).toBe('success');
    expect(service.getAdminSubmissions).toHaveBeenCalledWith({ status: 'PENDING' });
  });

  it('should get submission detail', async () => {
    service.getSubmissionById.mockResolvedValue({
      status: 'success',
      data: { id: 'sub-1', member: 'John' },
    });

    const res = await controller.getSubmissionDetail('sub-1');
    expect(res.status).toBe('success');
    expect(service.getSubmissionById).toHaveBeenCalledWith('sub-1');
  });

  it('should approve submission', async () => {
    service.approveSubmission.mockResolvedValue({
      status: 'success',
      data: { submission: { id: 'sub-1', status: 'APPROVED' } },
    });

    const res = await controller.approveSubmission('sub-1', 'admin-1');
    expect(res.status).toBe('success');
    expect(service.approveSubmission).toHaveBeenCalledWith('sub-1', 'admin-1');
  });

  it('should reject submission', async () => {
    service.rejectSubmission.mockResolvedValue({
      status: 'success',
      data: { id: 'sub-1', status: 'REJECTED' },
    });

    const res = await controller.rejectSubmission('sub-1', 'admin-1', {
      reason: 'Incomplete Strava screenshot',
    });
    expect(res.status).toBe('success');
    expect(service.rejectSubmission).toHaveBeenCalledWith('sub-1', 'admin-1', {
      reason: 'Incomplete Strava screenshot',
    });
  });
});

