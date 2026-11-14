import { jest } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { AdminMembersController } from './admin-members.controller.js';
import { UsersService } from './users.service.js';

describe('AdminMembersController', () => {
  let controller: AdminMembersController;
  let usersService: any;

  beforeEach(async () => {
    usersService = {
      findAllMembers: jest.fn().mockResolvedValue({
        status: 'success',
        data: { items: [], pagination: {} },
      }),
      findMemberById: jest.fn().mockResolvedValue({
        status: 'success',
        data: { id: 'user-1' },
      }),
      createMember: jest.fn().mockResolvedValue({
        status: 'success',
        data: { id: 'user-1' },
      }),
      updateMemberStatus: jest.fn().mockResolvedValue({
        status: 'success',
        data: { id: 'user-1', status: 'INACTIVE' },
      }),
      deleteMember: jest.fn().mockResolvedValue({
        status: 'success',
        message: 'Deleted',
      }),
      findMemberSubmissions: jest.fn().mockResolvedValue({
        status: 'success',
        data: { items: [], pagination: {} },
      }),
      findMemberActivities: jest.fn().mockResolvedValue({
        status: 'success',
        data: { items: [], pagination: {} },
      }),
      findMemberBadges: jest.fn().mockResolvedValue({
        status: 'success',
        data: [{ id: 'badge-1', name: 'First 5K' }],
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminMembersController],
      providers: [{ provide: UsersService, useValue: usersService }],
    }).compile();

    controller = module.get<AdminMembersController>(AdminMembersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should get members directory', async () => {
    const query = { page: 1, limit: 10 };
    const res = await controller.getMembers(query);
    expect(usersService.findAllMembers).toHaveBeenCalledWith(query);
    expect(res.status).toBe('success');
  });

  it('should update member status', async () => {
    const res = await controller.updateStatus('user-1', { status: 'INACTIVE' as any });
    expect(usersService.updateMemberStatus).toHaveBeenCalledWith('user-1', 'INACTIVE');
    expect(res.status).toBe('success');
  });

  it('should delete member', async () => {
    const res = await controller.deleteMember('user-1');
    expect(usersService.deleteMember).toHaveBeenCalledWith('user-1');
    expect(res.status).toBe('success');
  });

  it('should get member submissions', async () => {
    const res = await controller.getMemberSubmissions('user-1', 1, 10, 'PENDING');
    expect(usersService.findMemberSubmissions).toHaveBeenCalledWith('user-1', 1, 10, 'PENDING');
    expect(res.status).toBe('success');
  });

  it('should get member activities', async () => {
    const res = await controller.getMemberActivities('user-1', 1, 10);
    expect(usersService.findMemberActivities).toHaveBeenCalledWith('user-1', 1, 10);
    expect(res.status).toBe('success');
  });

  it('should get member badges', async () => {
    const res = await controller.getMemberBadges('user-1');
    expect(usersService.findMemberBadges).toHaveBeenCalledWith('user-1');
    expect(res.status).toBe('success');
  });
});

