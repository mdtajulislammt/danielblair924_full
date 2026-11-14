import { jest } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { BadgesController } from './badges.controller.js';
import { AdminBadgesController } from './admin-badges.controller.js';
import { AppBadgesController } from './app-badges.controller.js';
import { BadgesService } from './badges.service.js';

describe('Badges Controllers', () => {
  let badgesController: BadgesController;
  let adminBadgesController: AdminBadgesController;
  let appBadgesController: AppBadgesController;
  let service: any;

  beforeEach(async () => {
    service = {
      findAll: jest.fn(),
      findByIdOrSlug: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      getMyBadges: jest.fn(),
      getBadgeBySlug: jest.fn(),
      awardBadge: jest.fn(),
      revokeBadge: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [
        BadgesController,
        AdminBadgesController,
        AppBadgesController,
      ],
      providers: [{ provide: BadgesService, useValue: service }],
    }).compile();

    badgesController = module.get<BadgesController>(BadgesController);
    adminBadgesController = module.get<AdminBadgesController>(AdminBadgesController);
    appBadgesController = module.get<AppBadgesController>(AppBadgesController);
  });

  describe('BadgesController', () => {
    it('should get all badges', async () => {
      service.findAll.mockResolvedValue({ status: 'success', data: [] });
      const res = await badgesController.getBadges({});
      expect(res.status).toBe('success');
      expect(service.findAll).toHaveBeenCalled();
    });

    it('should get badge by id or slug', async () => {
      service.findByIdOrSlug.mockResolvedValue({ status: 'success', data: { slug: 'first-5k' } });
      const res = await badgesController.getBadge('first-5k');
      expect(res.status).toBe('success');
      expect(service.findByIdOrSlug).toHaveBeenCalledWith('first-5k');
    });

    it('should create badge', async () => {
      service.create.mockResolvedValue({ status: 'success', data: { name: 'New Badge' } });
      const res = await badgesController.createBadge({ name: 'New Badge', description: 'Desc 12345' });
      expect(res.status).toBe('success');
      expect(service.create).toHaveBeenCalled();
    });

    it('should update badge', async () => {
      service.update.mockResolvedValue({ status: 'success', data: { name: 'Updated' } });
      const res = await badgesController.updateBadge('first-5k', { name: 'Updated' });
      expect(res.status).toBe('success');
      expect(service.update).toHaveBeenCalledWith('first-5k', { name: 'Updated' });
    });

    it('should delete badge', async () => {
      service.delete.mockResolvedValue({ status: 'success', message: 'Deleted' });
      const res = await badgesController.deleteBadge('first-5k');
      expect(res.status).toBe('success');
      expect(service.delete).toHaveBeenCalledWith('first-5k');
    });
  });

  describe('AdminBadgesController', () => {
    it('should list admin badges with query', async () => {
      service.findAll.mockResolvedValue({ status: 'success', data: [] });
      const res = await adminBadgesController.getBadges({ page: 1, limit: 10 });
      expect(res.status).toBe('success');
      expect(service.findAll).toHaveBeenCalledWith({ page: 1, limit: 10 });
    });

    it('should get admin badge details', async () => {
      service.findByIdOrSlug.mockResolvedValue({ status: 'success', data: { id: 'badge-1' } });
      const res = await adminBadgesController.getBadge('badge-1');
      expect(res.status).toBe('success');
      expect(service.findByIdOrSlug).toHaveBeenCalledWith('badge-1');
    });

    it('should award badge to user', async () => {
      service.awardBadge.mockResolvedValue({ status: 'success', message: 'Awarded' });
      const res = await adminBadgesController.awardBadge('badge-1', { userId: 'user-1' });
      expect(res.status).toBe('success');
      expect(service.awardBadge).toHaveBeenCalledWith('user-1', 'badge-1');
    });

    it('should revoke badge from user', async () => {
      service.revokeBadge.mockResolvedValue({ status: 'success', message: 'Revoked' });
      const res = await adminBadgesController.revokeBadge('badge-1', 'user-1');
      expect(res.status).toBe('success');
      expect(service.revokeBadge).toHaveBeenCalledWith('user-1', 'badge-1');
    });
  });

  describe('AppBadgesController', () => {
    it('should get runner unlocked & locked badges', async () => {
      service.getMyBadges.mockResolvedValue({ status: 'success', data: { unlocked: [], locked: [] } });
      const res = await appBadgesController.getMyBadges('runner-1');
      expect(res.status).toBe('success');
      expect(service.getMyBadges).toHaveBeenCalledWith('runner-1');
    });

    it('should get badge detail for runner', async () => {
      service.getBadgeBySlug.mockResolvedValue({ status: 'success', data: { slug: 'first-5k' } });
      const res = await appBadgesController.getBadgeDetail('runner-1', 'first-5k');
      expect(res.status).toBe('success');
      expect(service.getBadgeBySlug).toHaveBeenCalledWith('first-5k', 'runner-1');
    });
  });
});

