import { jest } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service.js';
import { PrismaService } from '../prisma/prisma.service.js';
import bcrypt from 'bcryptjs';

describe('AuthService', () => {
  let service: AuthService;
  let prisma: any;
  let jwt: any;

  const mockUser = {
    id: 'user-uuid-1',
    email: 'runner@fmc.com',
    username: 'runner_john',
    passwordHash: bcrypt.hashSync('Password123!', 10),
    fname: 'John',
    lname: 'Doe',
    role: 'MEMBER',
    status: 'ACTIVE',
    avatarUrl: null,
    createdAt: new Date(),
  };

  beforeEach(async () => {
    prisma = {
      user: {
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
      },
      userSession: {
        create: jest.fn().mockResolvedValue({ id: 'session-1' }),
        findFirst: jest.fn(),
        update: jest.fn(),
        deleteMany: jest.fn().mockResolvedValue({ count: 1 }),
      },
    };

    jwt = {
      sign: jest.fn().mockReturnValue('mock-jwt-token'),
      verify: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: prisma },
        { provide: JwtService, useValue: jwt },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it('should register a new member successfully', async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      prisma.user.create.mockResolvedValue(mockUser);

      const result = await service.register({
        email: 'runner@fmc.com',
        password: 'Password123!',
        username: 'runner_john',
        fname: 'John',
        lname: 'Doe',
      });

      expect(result.status).toBe('success');
      expect(result.data.accessToken).toBe('mock-jwt-token');
      expect(result.data.refreshToken).toBe('mock-jwt-token');
      expect(result.data.user.email).toBe('runner@fmc.com');
      expect(prisma.userSession.create).toHaveBeenCalled();
    });

    it('should throw ConflictException if email exists', async () => {
      prisma.user.findUnique.mockResolvedValue(mockUser);

      await expect(
        service.register({
          email: 'runner@fmc.com',
          password: 'Password123!',
        }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('login', () => {
    it('should login with valid credentials', async () => {
      prisma.user.findUnique.mockResolvedValue(mockUser);

      const result = await service.login({
        email: 'runner@fmc.com',
        password: 'Password123!',
      });

      expect(result.status).toBe('success');
      expect(result.data.accessToken).toBe('mock-jwt-token');
      expect(result.data.user.id).toBe('user-uuid-1');
    });

    it('should throw UnauthorizedException with invalid password', async () => {
      prisma.user.findUnique.mockResolvedValue(mockUser);

      await expect(
        service.login({
          email: 'runner@fmc.com',
          password: 'WrongPassword',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if user not found', async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      await expect(
        service.login({
          email: 'notfound@fmc.com',
          password: 'Password123!',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if user is SUSPENDED', async () => {
      prisma.user.findUnique.mockResolvedValue({
        ...mockUser,
        status: 'SUSPENDED',
      });

      await expect(
        service.login({
          email: 'runner@fmc.com',
          password: 'Password123!',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('logout', () => {
    it('should delete user sessions on logout', async () => {
      const result = await service.logout('user-uuid-1');
      expect(result.status).toBe('success');
      expect(prisma.userSession.deleteMany).toHaveBeenCalledWith({
        where: { userId: 'user-uuid-1' },
      });
    });
  });

  describe('getMe', () => {
    it('should return user profile data when found', async () => {
      prisma.user.findUnique.mockResolvedValue(mockUser);
      const res = await service.getMe('user-uuid-1');
      expect(res.status).toBe('success');
      expect(res.data.id).toBe(mockUser.id);
    });

    it('should throw NotFoundException when user not found', async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      await expect(service.getMe('missing-id')).rejects.toThrow();
    });
  });

  describe('verifyOtp', () => {
    it('should verify OTP and return reset token', async () => {
      prisma.user.findUnique.mockResolvedValue(mockUser);
      const res = await service.verifyOtp('runner@fmc.com', '123456');
      expect(res.status).toBe('success');
      expect(res.data.resetToken).toBeDefined();
    });

    it('should throw BadRequestException if OTP is too short', async () => {
      await expect(service.verifyOtp('runner@fmc.com', '12')).rejects.toThrow();
    });
  });
});
