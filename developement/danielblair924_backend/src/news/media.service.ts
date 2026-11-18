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
  // Disallow SVG to prevent Stored XSS via XML/SVG vectors
  private readonly allowedMimeTypes = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
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

  private verifyMagicBytes(buffer: Buffer, mimetype: string): boolean {
    if (buffer.length < 4) return false;
    // JPEG: FF D8 FF
    if (mimetype === 'image/jpeg') {
      return buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
    }
    // PNG: 89 50 4E 47
    if (mimetype === 'image/png') {
      return buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4e && buffer[3] === 0x47;
    }
    // GIF: 47 49 46 38 ('GIF8')
    if (mimetype === 'image/gif') {
      return buffer[0] === 0x47 && buffer[1] === 0x49 && buffer[2] === 0x46 && buffer[3] === 0x38;
    }
    // WEBP: RIFF....WEBP (52 49 46 46 .... 57 45 42 50)
    if (mimetype === 'image/webp') {
      return (
        buffer.length >= 12 &&
        buffer[0] === 0x52 && buffer[1] === 0x49 && buffer[2] === 0x46 && buffer[3] === 0x46 &&
        buffer[8] === 0x57 && buffer[9] === 0x45 && buffer[10] === 0x42 && buffer[11] === 0x50
      );
    }
    return false;
  }

  async saveFile(file: UploadedFile, subfolder: string = 'media'): Promise<UploadResult> {
    if (!file) {
      throw new BadRequestException('No file provided for upload.');
    }

    if (file.originalname.toLowerCase().endsWith('.svg') || file.mimetype.includes('svg')) {
      throw new BadRequestException('SVG files are strictly disallowed for security reasons.');
    }

    if (!this.allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        `Invalid file type (${file.mimetype}). Allowed types: JPG, PNG, WEBP, GIF.`,
      );
    }

    if (file.size > this.maxFileSize) {
      throw new BadRequestException('File exceeds maximum allowed size of 5MB.');
    }

    // Read buffer if from path or memory
    let fileBuffer = file.buffer;
    if (!fileBuffer && file.path) {
      fileBuffer = await fs.promises.readFile(file.path);
    }

    if (!fileBuffer || fileBuffer.length === 0) {
      throw new BadRequestException('File contents are empty or inaccessible.');
    }

    // Verify magic bytes
    if (!this.verifyMagicBytes(fileBuffer, file.mimetype)) {
      throw new BadRequestException('File magic bytes do not match declared image mime type.');
    }

    const ext = path.extname(file.originalname) || '.jpg';
    const filename = `${randomUUID()}${ext}`;
    const targetDir = path.join(this.uploadDir, subfolder);
    this.ensureDirectory(targetDir);
    const targetPath = path.join(targetDir, filename);

    await fs.promises.writeFile(targetPath, fileBuffer);

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

