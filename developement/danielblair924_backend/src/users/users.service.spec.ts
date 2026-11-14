import { jest } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service.js';
import { PrismaService } from '../prisma/prisma.service.js';

describe('UsersService', () => {
  let service: UsersService;
  let prisma: any;

  const mockUser = {
    id: 'user-uuid-1',
    email: 'john@fmc.com',
    username: 'runner_john',
    fname: 'John',
    lname: 'Doe',
    dateOfBirth: '1995-05-15',
    city: 'Dhaka',
    country: 'Bangladesh',
    organization: 'First Mile Club',
    avatarUrl: '/avatars/john.png',
    role: 'MEMBER',
    status: 'ACTIVE',
    totalDistanceKm: 84.5,
    joinDate: new Date(),
    recipientName: 'John Doe',
    recipientZipCode: '1205',
    recipientCountry: 'Bangladesh',
    recipientState: 'Dhaka',
    recipientCity: 'Dhaka',
    recipientAddress: 'House 10, Road 5',
    recipientPhoneNumber: '+8801700000000',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    prisma = {
      user: {
        findUnique: jest.fn(),
        findFirst: jest.fn(),
        findMany: jest.fn(),
        count: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getProfile', () => {
    it('should return member profile', async () => {
      prisma.user.findUnique.mockResolvedValue({
        ...mockUser,
        _count: { submissions: 5, badges: 3, challengeEntries: 2 },
      });

      const result = await service.getProfile('user-uuid-1');
      expect(result.status).toBe('success');
      expect(result.data.email).toBe('john@fmc.com');
      expect(result.data.totalDistanceKm).toBe(84.5);
    });

    it('should throw NotFoundException if user does not exist', async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      await expect(service.getProfile('missing-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('updateProfile', () => {
    it('should update profile fields successfully', async () => {
      prisma.user.findUnique.mockResolvedValue(mockUser);
      prisma.user.update.mockResolvedValue({
        ...mockUser,
        fname: 'Johnny',
        city: 'Chittagong',
      });

      const result = await service.updateProfile('user-uuid-1', {
        fname: 'Johnny',
        city: 'Chittagong',
      });

      expect(result.status).toBe('success');
      expect(result.data.fname).toBe('Johnny');
      expect(prisma.user.update).toHaveBeenCalled();
    });
  });

  describe('updateShipping', () => {
    it('should update runner shipping details', async () => {
      prisma.user.findUnique.mockResolvedValue(mockUser);
      prisma.user.update.mockResolvedValue({
        id: 'user-uuid-1',
        recipientName: 'Recipient Johnny',
        recipientAddress: 'New Street 12',
      });

      const result = await service.updateShipping('user-uuid-1', {
        recipient_name: 'Recipient Johnny',
        recipient_address: 'New Street 12',
      });

      expect(result.status).toBe('success');
      expect(result.data.recipientName).toBe('Recipient Johnny');
    });
  });

  describe('findAllMembers', () => {
    it('should return paginated members list', async () => {
      prisma.user.count.mockResolvedValue(25);
      prisma.user.findMany.mockResolvedValue([mockUser]);

      const result = await service.findAllMembers({ page: 1, limit: 10 });
      expect(result.status).toBe('success');
      expect(result.data.items.length).toBe(1);
      expect(result.data.pagination.totalItems).toBe(25);
      expect(result.data.pagination.totalPages).toBe(3);
      expect(result.data.pagination.currentPage).toBe(1);
    });
  });

  describe('updateMemberStatus', () => {
    it('should update member status', async () => {
      prisma.user.findUnique.mockResolvedValue(mockUser);
      prisma.user.update.mockResolvedValue({
        id: 'user-uuid-1',
        email: mockUser.email,
        status: 'INACTIVE',
      });

      const result = await service.updateMemberStatus('user-uuid-1', 'INACTIVE' as any);
      expect(result.status).toBe('success');
      expect(result.data.status).toBe('INACTIVE');
    });
  });
});
