import { jest } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller.js';
import { AuthService } from './auth.service.js';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: any;

  beforeEach(async () => {
    authService = {
      register: jest.fn().mockResolvedValue({
        status: 'success',
        data: { accessToken: 'token123' },
      }),
      login: jest.fn().mockResolvedValue({
        status: 'success',
        data: { accessToken: 'token123' },
      }),
      refresh: jest.fn().mockResolvedValue({
        status: 'success',
        data: { accessToken: 'new-token123' },
      }),
      logout: jest.fn().mockResolvedValue({
        status: 'success',
        message: 'Logged out successfully',
      }),
      forgotPassword: jest.fn().mockResolvedValue({
        status: 'success',
        message: 'Dispatched',
      }),
      resetPassword: jest.fn().mockResolvedValue({
        status: 'success',
        message: 'Reset success',
      }),
      getMe: jest.fn().mockResolvedValue({
        status: 'success',
        data: { id: 'user-1', email: 'test@fmc.com' },
      }),
      verifyOtp: jest.fn().mockResolvedValue({
        status: 'success',
        data: { resetToken: 'tok-123' },
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: authService }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call authService.register', async () => {
    const dto = { email: 'test@fmc.com', password: 'Password123!' };
    const res = await controller.register(dto);
    expect(authService.register).toHaveBeenCalledWith(dto);
    expect(res.status).toBe('success');
  });

  it('should call authService.login', async () => {
    const dto = { email: 'test@fmc.com', password: 'Password123!' };
    const res = await controller.login(dto, 'Mozilla/5.0', '127.0.0.1');
    expect(authService.login).toHaveBeenCalledWith(dto, 'Mozilla/5.0', '127.0.0.1');
    expect(res.status).toBe('success');
  });

  it('should call authService.refresh', async () => {
    const res = await controller.refresh({ refreshToken: 'ref-token' });
    expect(authService.refresh).toHaveBeenCalledWith('ref-token');
    expect(res.status).toBe('success');
  });

  it('should call authService.logout', async () => {
    const res = await controller.logout('user-1', { refreshToken: 'ref-token' });
    expect(authService.logout).toHaveBeenCalledWith('user-1', 'ref-token');
    expect(res.status).toBe('success');
  });

  it('should call authService.getMe', async () => {
    const res = await controller.getMe('user-1');
    expect(authService.getMe).toHaveBeenCalledWith('user-1');
    expect(res.status).toBe('success');
  });

  it('should call authService.verifyOtp', async () => {
    const res = await controller.verifyOtp({ email: 'test@fmc.com', otp: '123456' });
    expect(authService.verifyOtp).toHaveBeenCalledWith('test@fmc.com', '123456');
    expect(res.status).toBe('success');
  });
});

