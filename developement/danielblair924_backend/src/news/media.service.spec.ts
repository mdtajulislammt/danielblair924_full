import { jest } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { MediaService } from './media.service.js';
import * as fs from 'node:fs';

describe('MediaService', () => {
  let service: MediaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MediaService],
    }).compile();

    service = module.get<MediaService>(MediaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('saveFile', () => {
    it('should throw BadRequestException if no file is provided', async () => {
      await expect(service.saveFile(null as any)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException if file mimetype is not allowed', async () => {
      const mockPdf = {
        originalname: 'document.pdf',
        mimetype: 'application/pdf',
        size: 1024,
        buffer: Buffer.from('test'),
      };

      await expect(service.saveFile(mockPdf as any)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException if file size exceeds 5MB', async () => {
      const mockLargeFile = {
        originalname: 'large.png',
        mimetype: 'image/png',
        size: 6 * 1024 * 1024,
        buffer: Buffer.from('large'),
      };

      await expect(service.saveFile(mockLargeFile as any)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should save a valid image buffer and return public URL', async () => {
      jest.spyOn(fs.promises, 'writeFile').mockResolvedValue(undefined as any);

      const mockImage = {
        originalname: 'banner.png',
        mimetype: 'image/png',
        size: 2048,
        buffer: Buffer.from('image bytes'),
      };

      const result = await service.saveFile(mockImage as any, 'news');

      expect(result.originalName).toBe('banner.png');
      expect(result.mimetype).toBe('image/png');
      expect(result.size).toBe(2048);
      expect(result.url).toMatch(/^\/uploads\/news\/[a-z0-9-]+\.png$/i);
    });
  });
});
