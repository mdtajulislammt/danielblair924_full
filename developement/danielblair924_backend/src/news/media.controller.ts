import {
  BadRequestException,
  Controller,
  Post,
  UploadedFile as UploadedFileDecorator,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MediaService } from './media.service.js';
import type { UploadedFile } from './media.service.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';

@Controller()
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post('media/upload')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPERADMIN', 'MEMBER')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    }),
  )
  async uploadMedia(
    @UploadedFileDecorator() file: UploadedFile,
  ) {
    if (!file) {
      throw new BadRequestException('File is required (field name: "file").');
    }
    const result = await this.mediaService.saveFile(file, 'media');
    return {
      status: 'success',
      data: result,
    };
  }

  @Post('upload')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPERADMIN', 'MEMBER')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  async uploadDirect(
    @UploadedFileDecorator() file: UploadedFile,
  ) {
    if (!file) {
      throw new BadRequestException('File is required (field name: "file").');
    }
    const result = await this.mediaService.saveFile(file, 'media');
    return {
      status: 'success',
      data: result,
    };
  }

  @Post('admin/media/upload')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPERADMIN')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  async uploadAdminMedia(
    @UploadedFileDecorator() file: UploadedFile,
  ) {
    if (!file) {
      throw new BadRequestException('File is required (field name: "file").');
    }
    const result = await this.mediaService.saveFile(file, 'media');
    return {
      status: 'success',
      data: result,
    };
  }
}
