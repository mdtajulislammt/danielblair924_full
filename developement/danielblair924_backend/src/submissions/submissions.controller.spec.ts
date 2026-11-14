import { jest } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { SubmissionsController } from './submissions.controller.js';
import { SubmissionsService } from './submissions.service.js';

describe('SubmissionsController', () => {
  let controller: SubmissionsController;
  let service: any;

  beforeEach(async () => {
    service = {
      createDraft: jest.fn(),
      uploadProofImages: jest.fn(),
      finalizeSubmission: jest.fn(),
      getMySubmissions: jest.fn(),
      getFinisherCard: jest.fn(),
      getSubmissionById: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [SubmissionsController],
      providers: [{ provide: SubmissionsService, useValue: service }],
    }).compile();

    controller = module.get<SubmissionsController>(SubmissionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create draft submission', async () => {
    service.createDraft.mockResolvedValue({ status: 'success', data: { id: 'sub-1' } });
    const dto: any = { distanceKm: 5.0, duration: '25m', runDate: '2026-08-21' };
    const res = await controller.createDraft('user-1', dto);
    expect(res.status).toBe('success');
    expect(service.createDraft).toHaveBeenCalledWith('user-1', dto);
  });

  it('should upload proof images', async () => {
    service.uploadProofImages.mockResolvedValue({ status: 'success' });
    const res = await controller.uploadProofImages('user-1', 'MEMBER', 'sub-1', {
      stravaImageUrl: '/strava.png',
    });
    expect(res.status).toBe('success');
    expect(service.uploadProofImages).toHaveBeenCalledWith('user-1', 'sub-1', {
      stravaImageUrl: '/strava.png',
    }, 'MEMBER');
  });

  it('should finalize submission', async () => {
    service.finalizeSubmission.mockResolvedValue({ status: 'success' });
    const res = await controller.finalizeSubmission('user-1', 'MEMBER', 'sub-1', {
      postedOnTikTok: true,
    });
    expect(res.status).toBe('success');
    expect(service.finalizeSubmission).toHaveBeenCalled();
  });

  it('should get my submissions', async () => {
    service.getMySubmissions.mockResolvedValue({ status: 'success', data: { items: [] } });
    const res = await controller.getMySubmissions('user-1', {});
    expect(res.status).toBe('success');
    expect(service.getMySubmissions).toHaveBeenCalled();
  });

  it('should get finisher card', async () => {
    service.getFinisherCard.mockResolvedValue({ status: 'success', data: { runnerName: 'John' } });
    const res = await controller.getFinisherCard('sub-1');
    expect(res.status).toBe('success');
    expect(service.getFinisherCard).toHaveBeenCalledWith('sub-1');
  });

  it('should get submission by id', async () => {
    service.getSubmissionById.mockResolvedValue({ status: 'success', data: { id: 'sub-1' } });
    const res = await controller.getSubmissionById('sub-1', { id: 'user-1', role: 'MEMBER' });
    expect(res.status).toBe('success');
    expect(service.getSubmissionById).toHaveBeenCalledWith('sub-1', { id: 'user-1', role: 'MEMBER' });
  });
});

