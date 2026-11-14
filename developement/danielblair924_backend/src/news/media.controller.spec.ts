import { jest } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { MediaController } from './media.controller.js';
import { MediaService } from './media.service.js';

describe('MediaController', () => {
  let controller: MediaController;
  let service: any;

  const mockUploadResult = {
    url: '/uploads/media/sample.png',
    filename: 'sample.png',
    originalName: 'banner.png',
    size: 2048,
    mimetype: 'image/png',
  };

  beforeEach(async () => {
    service = {
      saveFile: jest.fn().mockResolvedValue(mockUploadResult),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [MediaController],
      providers: [{ provide: MediaService, useValue: service }],
    }).compile();

    controller = module.get<MediaController>(MediaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('uploadMedia', () => {
    it('should save file and return success response', async () => {
      const mockFile = { originalname: 'banner.png' } as any;
      const res = await controller.uploadMedia(mockFile);

      expect(service.saveFile).toHaveBeenCalledWith(mockFile, 'media');
      expect(res.status).toBe('success');
      expect(res.data.url).toBe('/uploads/media/sample.png');
    });

    it('should throw BadRequestException if file is undefined', async () => {
      await expect(controller.uploadMedia(undefined as any)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('uploadDirect', () => {
    it('should handle /api/upload direct endpoint', async () => {
      const mockFile = { originalname: 'banner.png' } as any;
      const res = await controller.uploadDirect(mockFile);

      expect(service.saveFile).toHaveBeenCalledWith(mockFile, 'media');
      expect(res.status).toBe('success');
    });
  });

  describe('uploadAdminMedia', () => {
    it('should handle /api/admin/media/upload endpoint', async () => {
      const mockFile = { originalname: 'banner.png' } as any;
      const res = await controller.uploadAdminMedia(mockFile);

      expect(service.saveFile).toHaveBeenCalledWith(mockFile, 'media');
      expect(res.status).toBe('success');
    });
  });
});
