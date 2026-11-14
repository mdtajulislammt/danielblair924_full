import { jest } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { ChallengesController } from './challenges.controller.js';
import { AdminChallengesController } from './admin-challenges.controller.js';
import { AppChallengesController } from './app-challenges.controller.js';
import { ChallengesService } from './challenges.service.js';

describe('Challenges Controllers', () => {
  let challengesController: ChallengesController;
  let adminChallengesController: AdminChallengesController;
  let appChallengesController: AppChallengesController;
  let service: any;

  beforeEach(async () => {
    service = {
      getChallenges: jest.fn(),
      getChallengeById: jest.fn(),
      createChallenge: jest.fn(),
      updateChallenge: jest.fn(),
      deleteChallenge: jest.fn(),
      joinChallenge: jest.fn(),
      getChallengeParticipants: jest.fn(),
      getDestinations: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [
        ChallengesController,
        AdminChallengesController,
        AppChallengesController,
      ],
      providers: [{ provide: ChallengesService, useValue: service }],
    }).compile();

    challengesController = module.get<ChallengesController>(ChallengesController);
    adminChallengesController = module.get<AdminChallengesController>(AdminChallengesController);
    appChallengesController = module.get<AppChallengesController>(AppChallengesController);
  });

  describe('ChallengesController', () => {
    it('should list challenges', async () => {
      service.getChallenges.mockResolvedValue({ status: 'success', data: { items: [] } });
      const res = await challengesController.getChallenges({});
      expect(res.status).toBe('success');
      expect(service.getChallenges).toHaveBeenCalled();
    });

    it('should get RATW destinations', async () => {
      service.getDestinations.mockResolvedValue({ status: 'success', data: { destinations: [] } });
      const res = await challengesController.getRatwDestinations();
      expect(res.status).toBe('success');
      expect(service.getDestinations).toHaveBeenCalledWith();
    });

    it('should get challenge by id', async () => {
      service.getChallengeById.mockResolvedValue({ status: 'success', data: { id: 'ch-1' } });
      const res = await challengesController.getChallengeById('ch-1');
      expect(res.status).toBe('success');
      expect(service.getChallengeById).toHaveBeenCalledWith('ch-1');
    });

    it('should join challenge', async () => {
      service.joinChallenge.mockResolvedValue({ status: 'success' });
      const res = await challengesController.joinChallenge('ch-1', 'runner-1');
      expect(res.status).toBe('success');
      expect(service.joinChallenge).toHaveBeenCalledWith('ch-1', 'runner-1');
    });
  });

  describe('AdminChallengesController', () => {
    it('should list challenges for admin', async () => {
      service.getChallenges.mockResolvedValue({ status: 'success', data: { items: [] } });
      const res = await adminChallengesController.getChallenges({});
      expect(res.status).toBe('success');
      expect(service.getChallenges).toHaveBeenCalled();
    });

    it('should create a challenge', async () => {
      const dto: any = { title: 'New RATW', description: 'Desc' };
      service.createChallenge.mockResolvedValue({ status: 'success', data: { id: 'ch-2' } });
      const res = await adminChallengesController.createChallenge(dto);
      expect(res.status).toBe('success');
      expect(service.createChallenge).toHaveBeenCalledWith(dto);
    });

    it('should update a challenge', async () => {
      const dto: any = { targetProgress: 1000 };
      service.updateChallenge.mockResolvedValue({ status: 'success' });
      const res = await adminChallengesController.updateChallenge('ch-2', dto);
      expect(res.status).toBe('success');
      expect(service.updateChallenge).toHaveBeenCalledWith('ch-2', dto);
    });

    it('should delete a challenge', async () => {
      service.deleteChallenge.mockResolvedValue({ status: 'success' });
      const res = await adminChallengesController.deleteChallenge('ch-2');
      expect(res.status).toBe('success');
      expect(service.deleteChallenge).toHaveBeenCalledWith('ch-2');
    });

    it('should get destinations table for admin', async () => {
      service.getDestinations.mockResolvedValue({ status: 'success', data: {} });
      const res = await adminChallengesController.getDestinations('ch-2');
      expect(res.status).toBe('success');
      expect(service.getDestinations).toHaveBeenCalledWith('ch-2');
    });

    it('should get challenge participants for admin', async () => {
      service.getChallengeParticipants.mockResolvedValue({ status: 'success', data: {} });
      const res = await adminChallengesController.getParticipants('ch-2', 1, 20);
      expect(res.status).toBe('success');
      expect(service.getChallengeParticipants).toHaveBeenCalledWith('ch-2', 1, 20);
    });
  });

  describe('AppChallengesController', () => {
    it('should list active challenges for runner', async () => {
      service.getChallenges.mockResolvedValue({ status: 'success', data: { items: [] } });
      const res = await appChallengesController.getChallenges({}, 'runner-1');
      expect(res.status).toBe('success');
      expect(service.getChallenges).toHaveBeenCalled();
    });

    it('should get runner challenge by id', async () => {
      service.getChallengeById.mockResolvedValue({ status: 'success', data: { id: 'ch-1' } });
      const res = await appChallengesController.getChallengeById('ch-1', 'runner-1');
      expect(res.status).toBe('success');
      expect(service.getChallengeById).toHaveBeenCalledWith('ch-1', 'runner-1');
    });

    it('should join challenge via app controller', async () => {
      service.joinChallenge.mockResolvedValue({ status: 'success' });
      const res = await appChallengesController.joinChallenge('ch-1', 'runner-1');
      expect(res.status).toBe('success');
      expect(service.joinChallenge).toHaveBeenCalledWith('ch-1', 'runner-1');
    });

    it('should get ratw destinations via app controller', async () => {
      service.getDestinations.mockResolvedValue({ status: 'success', data: {} });
      const res = await appChallengesController.getRatwDestinations();
      expect(res.status).toBe('success');
      expect(service.getDestinations).toHaveBeenCalled();
    });
  });
});

