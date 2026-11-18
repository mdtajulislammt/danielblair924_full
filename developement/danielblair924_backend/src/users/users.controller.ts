import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service.js';
import { UpdateProfileDto } from './dto/update-profile.dto.js';
import { UpdateShippingDto } from './dto/update-shipping.dto.js';
import { ChangePasswordDto } from '../auth/dto/change-password.dto.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UserQueryDto } from './dto/user-query.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import { Roles } from '../auth/decorators/roles.decorator.js';

@Controller('user')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // 1. Get current logged in user details
  @Get('me')
  async getMe(@CurrentUser('id') userId: string) {
    return this.usersService.getProfile(userId);
  }

  // 2. Profile alias for runner app: GET /api/users/profile or GET /api/user/profile
  @Get('profile')
  async getProfile(@CurrentUser('id') userId: string) {
    return this.usersService.getProfile(userId);
  }

  // 3. Update personal details
  @Patch()
  async updateMe(
    @CurrentUser('id') userId: string,
    @Body() dto: UpdateProfileDto,
  ) {
    return this.usersService.updateProfile(userId, dto);
  }

  // 4. Update profile alias: PATCH /api/user/profile
  @Patch('profile')
  async updateProfile(
    @CurrentUser('id') userId: string,
    @Body() dto: UpdateProfileDto,
  ) {
    return this.usersService.updateProfile(userId, dto);
  }

  // 4b. Update avatar: PATCH /api/user/avatar
  @Patch('avatar')
  async updateAvatar(
    @CurrentUser('id') userId: string,
    @Body() body: { avatarUrl?: string; avatar?: string },
  ) {
    const avatarUrl = body.avatarUrl || body.avatar || '';
    return this.usersService.updateProfile(userId, { avatarUrl });
  }

  // 5. Update shipping recipient profile: PUT /api/user/profile/shipping
  @Put('profile/shipping')
  async updateShipping(
    @CurrentUser('id') userId: string,
    @Body() dto: UpdateShippingDto,
  ) {
    return this.usersService.updateShipping(userId, dto);
  }

  // 6. Change password: PATCH /api/user/password
  @HttpCode(HttpStatus.OK)
  @Patch('password')
  async changePassword(
    @CurrentUser('id') userId: string,
    @Body() dto: ChangePasswordDto,
  ) {
    return this.usersService.changePassword(
      userId,
      dto.currentPassword,
      dto.newPassword,
    );
  }

  // 7. Public runner profile by username
  @Get('profile/:username')
  async getByUsername(@Param('username') username: string) {
    return this.usersService.findByUsername(username);
  }

  // 8. Admin get all users: GET /api/user
  @Get()
  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'SUPERADMIN')
  async findAll(@Query() query: UserQueryDto) {
    return this.usersService.findAllMembers(query);
  }

  // 9. Admin create user: POST /api/user
  @Post()
  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'SUPERADMIN')
  async create(
    @Body() dto: CreateUserDto,
    @CurrentUser() currentUser: { role: string },
  ) {
    return this.usersService.createMember(dto, currentUser?.role);
  }

  // 10. Admin get single user: GET /api/user/:id
  @Get(':id')
  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'SUPERADMIN')
  async findOne(@Param('id') id: string) {
    return this.usersService.findMemberById(id);
  }

  // 11. Confirm / set password: PATCH /api/user/:id/password
  // Allowed only for self (with current password verification) or admin/superadmin via RolesGuard
  @Patch(':id/password')
  async confirmPassword(
    @Param('id') id: string,
    @CurrentUser() currentUser: { id: string; role: string },
    @Body() body: { currentPassword?: string; password?: string; newPassword?: string; token?: string },
  ) {
    const isSelf = currentUser && currentUser.id === id;
    const isAdmin = currentUser && (currentUser.role === 'ADMIN' || currentUser.role === 'SUPERADMIN');

    if (!isSelf && !isAdmin) {
      throw new UnauthorizedException('You can only update your own password unless you are an administrator');
    }

    const newPass = body.password || body.newPassword;
    if (!newPass) {
      throw new BadRequestException('New password is required');
    }

    if (isSelf && !isAdmin) {
      if (!body.currentPassword) {
        throw new BadRequestException('Current password is required to change password');
      }
      return this.usersService.changePassword(id, body.currentPassword, newPass);
    }

    // Admin reset
    return this.usersService.confirmPassword(id, body.token || '', newPass);
  }

  // 12. Delete user: DELETE /api/user/:id
  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'SUPERADMIN')
  async remove(@Param('id') id: string) {
    return this.usersService.deleteMember(id);
  }
}

