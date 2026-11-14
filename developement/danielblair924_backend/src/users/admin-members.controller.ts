import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service.js';
import { UserQueryDto } from './dto/user-query.dto.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateStatusDto } from './dto/update-status.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';

@Controller('admin/members')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN', 'SUPERADMIN')
export class AdminMembersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getMembers(@Query() query: UserQueryDto) {
    return this.usersService.findAllMembers(query);
  }

  @Post()
  async createMember(@Body() dto: CreateUserDto) {
    return this.usersService.createMember(dto);
  }

  @Get(':id')
  async getMemberById(@Param('id') id: string) {
    return this.usersService.findMemberById(id);
  }

  @Get(':id/badges')
  async getMemberBadges(@Param('id') id: string) {
    return this.usersService.findMemberBadges(id);
  }

  @Get(':id/submissions')
  async getMemberSubmissions(
    @Param('id') id: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('status') status?: string,
  ) {
    return this.usersService.findMemberSubmissions(id, page, limit, status);
  }

  @Get(':id/activities')
  async getMemberActivities(
    @Param('id') id: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.usersService.findMemberActivities(id, page, limit);
  }

  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateStatusDto,
  ) {
    return this.usersService.updateMemberStatus(id, dto.status);
  }

  @Delete(':id')
  async deleteMember(@Param('id') id: string) {
    return this.usersService.deleteMember(id);
  }
}

