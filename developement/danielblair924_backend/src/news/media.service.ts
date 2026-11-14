import { Injectable, BadRequestException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import * as fs from 'node:fs';
import * as path from 'node:path';

export interface UploadedFile {
  fieldname?: string;
  originalname: string;
  encoding?: string;
  mimetype: string;
  size: number;
  destination?: string;
  filename?: string;
  path?: string;
  buffer?: Buffer;
}

export interface UploadResult {
  url: string;
  filename: string;
  originalName: string;
  size: number;
  mimetype: string;
}

@Injectable()
export class MediaService {
  private readonly uploadDir = path.resolve(process.cwd(), 'uploads');
  private readonly allowedMimeTypes = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
    'image/svg+xml',
  ];
  private readonly maxFileSize = 5 * 1024 * 1024; // 5MB

  constructor() {
    this.ensureDirectory(this.uploadDir);
    this.ensureDirectory(path.join(this.uploadDir, 'news'));
    this.ensureDirectory(path.join(this.uploadDir, 'media'));
  }

  private ensureDirectory(dir: string): void {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  async saveFile(file: UploadedFile, subfolder: string = 'media'): Promise<UploadResult> {
    if (!file) {
      throw new BadRequestException('No file provided for upload.');
    }

    if (!this.allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        `Invalid file type (${file.mimetype}). Allowed types: JPG, PNG, WEBP, GIF, SVG.`,
      );
    }

    if (file.size > this.maxFileSize) {
      throw new BadRequestException('File exceeds maximum allowed size of 5MB.');
    }

    const ext = path.extname(file.originalname) || '.jpg';
    const filename = `${randomUUID()}${ext}`;
    const targetDir = path.join(this.uploadDir, subfolder);
    this.ensureDirectory(targetDir);
    const targetPath = path.join(targetDir, filename);

    if (file.buffer) {
      await fs.promises.writeFile(targetPath, file.buffer);
    } else if (file.path) {
      await fs.promises.copyFile(file.path, targetPath);
    } else {
      throw new BadRequestException('File contents are empty or inaccessible.');
    }

    const publicUrl = `/uploads/${subfolder}/${filename}`;

    return {
      url: publicUrl,
      filename,
      originalName: file.originalname,
      size: file.size,
      mimetype: file.mimetype,
    };
  }
}

