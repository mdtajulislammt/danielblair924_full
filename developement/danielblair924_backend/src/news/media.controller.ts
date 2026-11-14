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

@Controller()
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post('media/upload')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
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
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
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
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
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
