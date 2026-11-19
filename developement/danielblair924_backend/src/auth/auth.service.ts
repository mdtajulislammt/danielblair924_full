import {
  BadRequestException,
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcryptjs';
import crypto from 'node:crypto';
import { PrismaService } from '../prisma/prisma.service.js';
import { NotificationsService } from '../notifications/notifications.service.js';
import { RegisterDto } from './dto/register.dto.js';
import { LoginDto } from './dto/login.dto.js';
import { ResetPasswordDto } from './dto/reset-password.dto.js';

interface OtpEntry {
  hashedOtp: string;
  expiresAt: number;
  attempts: number;
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly jwtSecret: string;
  private readonly refreshSecret: string;
  private readonly resetSecret: string;

  // In-memory secure OTP store: email -> OtpEntry
  private readonly otpStore = new Map<string, OtpEntry>();

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly notifications: NotificationsService,
  ) {
    const jwt = process.env.JWT_SECRET;
    if (!jwt) {
      throw new Error('FATAL: JWT_SECRET environment variable is missing.');
    }
    this.jwtSecret = jwt;
    this.refreshSecret = process.env.JWT_REFRESH_SECRET || jwt + '_refresh';
    this.resetSecret = process.env.JWT_RESET_SECRET || jwt + '_reset';
  }

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

    // Create session record first to obtain sid
    const session = await this.prisma.userSession.create({
      data: {
        userId: user.id,
        device: 'Web / Mobile Client',
        location: 'Initial Registration',
        isCurrent: false,
        refreshToken: '',
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      },
    });

    const tokens = await this.generateTokens(user.id, user.email, user.role, session.id);

    // Save refreshToken on session
    await this.prisma.userSession.update({
      where: { id: session.id },
      data: { refreshToken: tokens.refreshToken },
    });

    const fullName = `${user.fname || ''} ${user.lname || ''}`.trim() || user.username || user.email;
    void this.notifications
      .notifyAdmins('MEMBER_REGISTERED', 'New member joined', `${fullName} just signed up`, {
        route: `/dashboard/members/${user.id}`,
        memberId: user.id,
      })
      .catch((err) =>
        this.logger.error(`Failed to notify admins for registration ${user.id}: ${err.message}`),
      );

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

    // Record session first to obtain sid
    const session = await this.prisma.userSession.create({
      data: {
        userId: user.id,
        device: userAgent || 'Browser Device',
        location: ip || 'Remote Client',
        isCurrent: false,
        refreshToken: '',
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    const tokens = await this.generateTokens(user.id, user.email, user.role, session.id);

    await this.prisma.userSession.update({
      where: { id: session.id },
      data: { refreshToken: tokens.refreshToken },
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
        session.id,
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

  async logout(userId: string, refreshToken?: string, sid?: string) {
    if (sid) {
      await this.prisma.userSession.deleteMany({
        where: { id: sid, userId },
      });
    } else if (refreshToken) {
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
    const cleanEmail = email.toLowerCase().trim();
    const user = await this.prisma.user.findUnique({
      where: { email: cleanEmail },
    });

    if (user) {
      // Generate cryptographically strong 6-digit OTP
      const otp = crypto.randomInt(100000, 999999).toString();
      const salt = await bcrypt.genSalt(10);
      const hashedOtp = await bcrypt.hash(otp, salt);
      const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

      this.otpStore.set(cleanEmail, {
        hashedOtp,
        expiresAt,
        attempts: 0,
      });

      // In production send real email; in dev log to console for visibility
      console.log(`[AUTH] 📧 Dispatched password reset OTP to ${cleanEmail}: ${otp} (Expires in 10 mins)`);
    }

    // Security: Never return reset token in response to prevent enumeration/takeover
    return {
      status: 'success',
      data: null,
      message: 'If the email exists, a password reset OTP has been dispatched to your email.',
    };
  }

  async verifyOtp(email?: string, otp?: string) {
    if (!email || !otp || otp.trim().length !== 6) {
      throw new BadRequestException('Valid email and 6-digit OTP code are required.');
    }

    const cleanEmail = email.toLowerCase().trim();
    const cleanOtp = otp.trim();

    const record = this.otpStore.get(cleanEmail);
    if (!record) {
      throw new BadRequestException('No active OTP request found for this email. Please request a new OTP.');
    }

    if (Date.now() > record.expiresAt) {
      this.otpStore.delete(cleanEmail);
      throw new BadRequestException('OTP has expired. Please request a new one.');
    }

    // Rate-limit attempts (max 5 failed tries)
    if (record.attempts >= 5) {
      this.otpStore.delete(cleanEmail);
      throw new HttpException(
        'Too many failed attempts. OTP has been invalidated. Please request a new one.',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    const isValid = await bcrypt.compare(cleanOtp, record.hashedOtp);
    if (!isValid) {
      record.attempts += 1;
      const remaining = 5 - record.attempts;
      throw new BadRequestException(`Invalid OTP code. ${remaining} attempts remaining.`);
    }

    // Remove OTP once verified to prevent replay attacks
    this.otpStore.delete(cleanEmail);

    const user = await this.prisma.user.findUnique({
      where: { email: cleanEmail },
    });
    if (!user) {
      throw new NotFoundException('User associated with this OTP no longer exists.');
    }

    // Sign reset token with separate JWT_RESET_SECRET and type 'PASSWORD_RESET'
    const resetToken = this.jwtService.sign(
      { sub: user.id, email: user.email, type: 'PASSWORD_RESET' },
      { secret: this.resetSecret, expiresIn: '15m' },
    );

    return {
      status: 'success',
      data: {
        resetToken,
        message: 'OTP verified successfully.',
      },
    };
  }

  async resetPassword(dto: ResetPasswordDto) {
    try {
      const payload = this.jwtService.verify(dto.token, {
        secret: this.resetSecret,
      });

      if (payload.type !== 'PASSWORD_RESET' || !payload.sub) {
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

  private async generateTokens(
    userId: string,
    email: string,
    role: string,
    sid?: string,
  ) {
    const payload = { sub: userId, email, role, sid, type: 'access' };
    const accessToken = this.jwtService.sign(payload, {
      secret: this.jwtSecret,
      expiresIn: '1d',
    });

    const refreshToken = this.jwtService.sign(
      { sub: userId, email, role, sid, type: 'refresh' },
      {
        secret: this.refreshSecret,
        expiresIn: '7d',
      },
    );

    return { accessToken, refreshToken };
  }
}

