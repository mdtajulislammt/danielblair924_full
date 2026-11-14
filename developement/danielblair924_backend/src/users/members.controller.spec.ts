import { jest } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { MembersController } from './members.controller.js';
import { UsersService } from './users.service.js';

describe('MembersController', () => {
  let controller: MembersController;
  let usersService: any;

  beforeEach(async () => {
    usersService = {
      getLeaderboard: jest.fn().mockResolvedValue({
        status: 'success',
        data: {
          items: [
            { id: 'u-1', rank: 1, name: 'Runner 1', score: '100.0 KM', avatarUrl: '' },
          ],
          currentUser: null,
        },
      }),
      getMemberStats: jest.fn().mockResolvedValue({
        status: 'success',
        data: {
          lifetimeDistanceKm: 120.5,
          eventsJoined: 3,
          badgesEarned: 5,
          currentRank: 2,
        },
      }),
      getProfile: jest.fn().mockResolvedValue({
        status: 'success',
        data: { id: 'u-1', email: 'test@example.com' },
      }),
      updateProfile: jest.fn().mockResolvedValue({
        status: 'success',
        data: { id: 'u-1', fname: 'Updated' },
      }),
      findMemberById: jest.fn().mockResolvedValue({
        status: 'success',
        data: { id: 'u-1', username: 'runner1' },
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [MembersController],
      providers: [
        {
          provide: UsersService,
          useValue: usersService,
        },
      ],
    }).compile();

    controller = module.get<MembersController>(MembersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should get leaderboard', async () => {
    const res = await controller.getLeaderboard('thisMonth', 10, 'u-1');
    expect(res).toBeDefined();
    expect(usersService.getLeaderboard).toHaveBeenCalledWith('thisMonth', 'u-1', 10);
  });

  it('should get member stats', async () => {
    const res = await controller.getMyStats('u-1');
    expect(res).toBeDefined();
    expect(usersService.getMemberStats).toHaveBeenCalledWith('u-1');
  });

  it('should get profile', async () => {
    const res = await controller.getMe('u-1');
    expect(res).toBeDefined();
    expect(usersService.getProfile).toHaveBeenCalledWith('u-1');
  });

  it('should update profile', async () => {
    const res = await controller.updateMe('u-1', { fname: 'Updated' } as any);
    expect(res).toBeDefined();
    expect(usersService.updateProfile).toHaveBeenCalledWith('u-1', { fname: 'Updated' });
  });

  it('should get member by id', async () => {
    const res = await controller.getMemberById('u-1');
    expect(res).toBeDefined();
    expect(usersService.findMemberById).toHaveBeenCalledWith('u-1');
  });
});

