import { jest } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller.js';
import { UsersService } from './users.service.js';

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: any;

  beforeEach(async () => {
    usersService = {
      getProfile: jest.fn().mockResolvedValue({
        status: 'success',
        data: { id: 'user-1', email: 'john@fmc.com' },
      }),
      updateProfile: jest.fn().mockResolvedValue({
        status: 'success',
        data: { id: 'user-1', fname: 'Johnny' },
      }),
      updateShipping: jest.fn().mockResolvedValue({
        status: 'success',
        data: { id: 'user-1', recipientName: 'Johnny' },
      }),
      changePassword: jest.fn().mockResolvedValue({
        status: 'success',
        message: 'Password changed',
      }),
      findByUsername: jest.fn().mockResolvedValue({
        status: 'success',
        data: { username: 'runner_john' },
      }),
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
        data: { id: 'user-new' },
      }),
      deleteMember: jest.fn().mockResolvedValue({
        status: 'success',
        message: 'Deleted',
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [{ provide: UsersService, useValue: usersService }],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should get current user profile (getMe)', async () => {
    const res = await controller.getMe('user-1');
    expect(usersService.getProfile).toHaveBeenCalledWith('user-1');
    expect(res.status).toBe('success');
  });

  it('should update current user profile (updateMe)', async () => {
    const dto = { fname: 'Johnny' };
    const res = await controller.updateMe('user-1', dto);
    expect(usersService.updateProfile).toHaveBeenCalledWith('user-1', dto);
    expect(res.status).toBe('success');
  });

  it('should update shipping details', async () => {
    const dto = { recipientName: 'Johnny' };
    const res = await controller.updateShipping('user-1', dto);
    expect(usersService.updateShipping).toHaveBeenCalledWith('user-1', dto);
    expect(res.status).toBe('success');
  });

  it('should find all members for admin', async () => {
    const query = { page: 1, limit: 10 };
    const res = await controller.findAll(query);
    expect(usersService.findAllMembers).toHaveBeenCalledWith(query);
    expect(res.status).toBe('success');
  });
});

