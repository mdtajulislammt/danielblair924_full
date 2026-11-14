import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service.js';
import { RegisterDto } from './dto/register.dto.js';
import { LoginDto } from './dto/login.dto.js';
import { ResetPasswordDto } from './dto/reset-password.dto.js';

@Injectable()
export class AuthService {
  private readonly jwtSecret = process.env.JWT_SECRET || 'fmc-super-secret-jwt-key-2026';
  private readonly refreshSecret = process.env.JWT_REFRESH_SECRET || 'fmc-refresh-secret-jwt-key-2026';

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existingEmail = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase().trim() },
    });
    if (existingEmail) {
      throw new ConflictException('A user with this email address already exists');
    }

    if (dto.username) {
      const existingUsername = await this.prisma.user.findUnique({
        where: { username: dto.username.toLowerCase().trim() },
      });
      if (existingUsername) {
        throw new ConflictException('Username is already taken');
      }
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(dto.password, saltRounds);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email.toLowerCase().trim(),
        username: dto.username ? dto.username.toLowerCase().trim() : dto.email.split('@')[0],
        passwordHash,
        fname: dto.fname || null,
        lname: dto.lname || null,
        role: 'MEMBER',
        status: 'ACTIVE',
      },
      select: {
        id: true,
        email: true,
        username: true,
        fname: true,
        lname: true,
        role: true,
        status: true,
        avatarUrl: true,
        createdAt: true,
      },
    });

    const tokens = await this.generateTokens(user.id, user.email, user.role);

    // Save session
    await this.prisma.userSession.create({
      data: {
        userId: user.id,
        device: 'Web / Mobile Client',
        location: 'Initial Registration',
        isCurrent: true,
        refreshToken: tokens.refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      },
    });

    return {
      status: 'success',
      data: {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        user,
      },
      message: 'Account registered successfully',
    };
  }

  async login(dto: LoginDto, userAgent = 'Unknown Device', ip = 'Local') {
    const email = dto.email.toLowerCase().trim();
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isMatch = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid email or password');
    }

    if (user.status === 'SUSPENDED') {
      throw new UnauthorizedException('Your account has been suspended. Please contact support.');
    }

    const tokens = await this.generateTokens(user.id, user.email, user.role);

    // Record session
    await this.prisma.userSession.create({
      data: {
        userId: user.id,
        device: userAgent || 'Browser Device',
        location: ip || 'Remote Client',
        isCurrent: true,
        refreshToken: tokens.refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    const safeUser = {
      id: user.id,
      email: user.email,
      username: user.username,
      fname: user.fname,
      lname: user.lname,
      role: user.role,
      status: user.status,
      avatarUrl: user.avatarUrl,
    };

    return {
      status: 'success',
      data: {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        user: safeUser,
      },
      message: 'Login successful',
    };
  }

  async refresh(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.refreshSecret,
      });

      const session = await this.prisma.userSession.findFirst({
        where: {
          refreshToken,
          userId: payload.sub,
          expiresAt: { gt: new Date() },
        },
        include: { user: true },
      });

      if (!session || !session.user || session.user.status === 'SUSPENDED') {
        throw new UnauthorizedException('Session expired or invalid');
      }

      const tokens = await this.generateTokens(
        session.user.id,
        session.user.email,
        session.user.role,
      );

      // Rotate refresh token on the session
      await this.prisma.userSession.update({
        where: { id: session.id },
        data: {
          refreshToken: tokens.refreshToken,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
      });

      return {
        status: 'success',
        data: {
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
        },
        message: 'Tokens refreshed successfully',
      };
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  async logout(userId: string, refreshToken?: string) {
    if (refreshToken) {
      await this.prisma.userSession.deleteMany({
        where: { userId, refreshToken },
      });
    } else {
      await this.prisma.userSession.deleteMany({
        where: { userId },
      });
    }

    return {
      status: 'success',
      data: null,
      message: 'Successfully logged out',
    };
  }

  async getMe(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        username: true,
        fname: true,
        lname: true,
        role: true,
        status: true,
        avatarUrl: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      status: 'success',
      data: user,
    };
  }

  async forgotPassword(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    // Generate a reset token if user found
    let resetToken = 'mock-reset-token';
    if (user) {
      resetToken = this.jwtService.sign(
        { sub: user.id, type: 'password_reset' },
        { secret: this.jwtSecret, expiresIn: '1h' },
      );
    }

    return {
      status: 'success',
      data: {
        // Returned for development convenience
        resetToken: process.env.NODE_ENV !== 'production' ? resetToken : undefined,
      },
      message: 'If the email exists, a password reset link has been dispatched.',
    };
  }

  async verifyOtp(email?: string, otp?: string) {
    if (!otp || otp.trim().length < 4) {
      throw new BadRequestException('Invalid OTP code. Must be at least 4 digits');
    }

    let resetToken = 'mock-reset-token';
    if (email) {
      const user = await this.prisma.user.findUnique({
        where: { email: email.toLowerCase().trim() },
      });
      if (user) {
        resetToken = this.jwtService.sign(
          { sub: user.id, type: 'password_reset' },
          { secret: this.jwtSecret, expiresIn: '1h' },
        );
      }
    }

    return {
      status: 'success',
      data: {
        resetToken,
        message: 'OTP verified successfully',
      },
    };
  }

  async resetPassword(dto: ResetPasswordDto) {
    try {
      const payload = this.jwtService.verify(dto.token, {
        secret: this.jwtSecret,
      });

      if (payload.type !== 'password_reset' || !payload.sub) {
        throw new BadRequestException('Invalid password reset token');
      }

      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
      });
      if (!user) {
        throw new NotFoundException('User not found');
      }

      const passwordHash = await bcrypt.hash(dto.password, 10);
      await this.prisma.user.update({
        where: { id: user.id },
        data: { passwordHash },
      });

      // Revoke existing sessions
      await this.prisma.userSession.deleteMany({
        where: { userId: user.id },
      });

      return {
        status: 'success',
        data: null,
        message: 'Password has been reset successfully',
      };
    } catch {
      throw new BadRequestException('Invalid or expired password reset token');
    }
  }

  private async generateTokens(userId: string, email: string, role: string) {
    const payload = { sub: userId, email, role };
    const accessToken = this.jwtService.sign(payload, {
      secret: this.jwtSecret,
      expiresIn: '1d',
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.refreshSecret,
      expiresIn: '7d',
    });

    return { accessToken, refreshToken };
  }
}

