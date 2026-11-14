import { jest } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { AdminSettingsController } from './admin-settings.controller.js';
import { SettingsController } from './settings.controller.js';
import { SettingsService } from './settings.service.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';

describe('AdminSettingsController & SettingsController', () => {
  let adminController: AdminSettingsController;
  let settingsController: SettingsController;
  let settingsService: any;

  const mockAdminId = 'admin-uuid-1';
  const mockUserId = 'user-uuid-1';

  beforeEach(async () => {
    settingsService = {
      getAdminSettings: jest.fn(),
      updateAdminAccount: jest.fn(),
      getNotifications: jest.fn(),
      updateNotifications: jest.fn(),
      getActiveSessions: jest.fn(),
      revokeSession: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminSettingsController, SettingsController],
      providers: [
        { provide: SettingsService, useValue: settingsService },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => true })
      .compile();

    adminController = module.get<AdminSettingsController>(AdminSettingsController);
    settingsController = module.get<SettingsController>(SettingsController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('AdminSettingsController', () => {
    it('GET /api/admin/settings should call getAdminSettings', async () => {
      const mockResult = {
        account: { id: mockAdminId, name: 'Super Admin', email: 'admin@fmc.com' },
        notifications: { newSubmissionAlert: true },
        security: { sessions: [] },
      };
      settingsService.getAdminSettings.mockResolvedValue(mockResult);

      const result = await adminController.getSettings(mockAdminId);

      expect(settingsService.getAdminSettings).toHaveBeenCalledWith(mockAdminId);
      expect(result).toBe(mockResult);
    });

    it('PATCH /api/admin/settings/account should call updateAdminAccount', async () => {
      const dto = { name: 'Super Admin Updated', email: 'admin@fmc.com' };
      const mockResult = { message: 'Updated', account: dto };
      settingsService.updateAdminAccount.mockResolvedValue(mockResult);

      const result = await adminController.updateAccount(mockAdminId, dto);

      expect(settingsService.updateAdminAccount).toHaveBeenCalledWith(mockAdminId, dto);
      expect(result).toBe(mockResult);
    });

    it('PATCH /api/admin/settings/notifications should call updateNotifications', async () => {
      const dto = { newSubmissionAlert: false, weeklySummaryEmail: true };
      const mockResult = { message: 'Updated', notifications: dto };
      settingsService.updateNotifications.mockResolvedValue(mockResult);

      const result = await adminController.updateNotifications(mockAdminId, dto);

      expect(settingsService.updateNotifications).toHaveBeenCalledWith(mockAdminId, dto);
      expect(result).toBe(mockResult);
    });

    it('GET /api/admin/settings/sessions should call getActiveSessions', async () => {
      const mockSessions = [{ id: 'sess-1', device: 'Chrome on macOS' }];
      settingsService.getActiveSessions.mockResolvedValue(mockSessions);

      const result = await adminController.getSessions(mockAdminId);

      expect(settingsService.getActiveSessions).toHaveBeenCalledWith(mockAdminId);
      expect(result).toBe(mockSessions);
    });

    it('DELETE /api/admin/settings/sessions/:id should call revokeSession', async () => {
      const mockResult = { success: true, message: 'Session revoked successfully' };
      settingsService.revokeSession.mockResolvedValue(mockResult);

      const result = await adminController.revokeSession(mockAdminId, 'sess-1');

      expect(settingsService.revokeSession).toHaveBeenCalledWith(mockAdminId, 'sess-1');
      expect(result).toBe(mockResult);
    });
  });

  describe('SettingsController', () => {
    it('GET /api/settings/notifications should call getNotifications', async () => {
      const mockNotifs = { newSubmissionAlert: true, weeklySummaryEmail: false };
      settingsService.getNotifications.mockResolvedValue(mockNotifs);

      const result = await settingsController.getNotifications(mockUserId);

      expect(settingsService.getNotifications).toHaveBeenCalledWith(mockUserId);
      expect(result).toBe(mockNotifs);
    });

    it('PATCH /api/settings/notifications should call updateNotifications', async () => {
      const dto = { weeklySummaryEmail: true };
      const mockResult = { message: 'Updated', notifications: dto };
      settingsService.updateNotifications.mockResolvedValue(mockResult);

      const result = await settingsController.updateNotifications(mockUserId, dto);

      expect(settingsService.updateNotifications).toHaveBeenCalledWith(mockUserId, dto);
      expect(result).toBe(mockResult);
    });

    it('GET /api/settings/sessions should call getActiveSessions', async () => {
      const mockSessions = [{ id: 'sess-2', device: 'Safari on iPhone' }];
      settingsService.getActiveSessions.mockResolvedValue(mockSessions);

      const result = await settingsController.getSessions(mockUserId);

      expect(settingsService.getActiveSessions).toHaveBeenCalledWith(mockUserId);
      expect(result).toBe(mockSessions);
    });

    it('DELETE /api/settings/sessions/:id should call revokeSession', async () => {
      const mockResult = { success: true };
      settingsService.revokeSession.mockResolvedValue(mockResult);

      const result = await settingsController.revokeSession(mockUserId, 'sess-2');

      expect(settingsService.revokeSession).toHaveBeenCalledWith(mockUserId, 'sess-2');
      expect(result).toBe(mockResult);
    });
  });
});

