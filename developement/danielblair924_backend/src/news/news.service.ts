import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { MediaService, UploadedFile } from './media.service.js';
import { CreateNewsDto } from './dto/create-news.dto.js';
import { UpdateNewsDto } from './dto/update-news.dto.js';
import { NewsQueryDto } from './dto/news-query.dto.js';

export function formatNewsDate(date: Date): string {
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  const month = months[date.getUTCMonth()];
  const day = date.getUTCDate();
  const year = date.getUTCFullYear();
  return `${month} ${day}, ${year}`;
}

@Injectable()
export class NewsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mediaService: MediaService,
  ) {}

  /**
   * Helper to format NewsPost records into standardized API & frontend responses.
   */
  private formatPost(post: any) {
    const isPublished = post.status === 'PUBLISHED';
    const authorName = post.author
      ? `${post.author.fname || ''} ${post.author.lname || ''}`.trim() ||
        post.author.username
      : 'FMC Admin';

    return {
      id: post.id,
      title: post.title,
      body: post.body,
      coverImageUrl: post.coverImageUrl,
      icon: post.coverImageUrl || 'badge1.png',
      date: formatNewsDate(new Date(post.publishDate)),
      publishDate: new Date(post.publishDate).toISOString(),
      status: isPublished ? 'Published' : 'Draft',
      statusCode: post.status,
      author: post.author
        ? {
            id: post.author.id,
            name: authorName,
            username: post.author.username,
            email: post.author.email,
            avatarUrl: post.author.avatarUrl,
          }
        : null,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    };
  }

  /**
   * List news articles.
   * If `adminMode` is false, only published articles with publishDate <= now are returned.
   * If `adminMode` is true, all articles or articles matching query.status are returned.
   */
  async findAll(query: NewsQueryDto, adminMode = false) {
    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.max(1, Math.min(100, Number(query.limit) || 10));
    const skip = (page - 1) * limit;

    const where: any = {};

    if (!adminMode) {
      where.status = 'PUBLISHED';
      where.publishDate = { lte: new Date() };
    } else if (query.status && query.status.toUpperCase() !== 'ALL') {
      where.status = query.status.toUpperCase();
    }

    if (query.search?.trim()) {
      const search = query.search.trim();
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { body: { contains: search, mode: 'insensitive' } },
      ];
    }

    const sortOrder = query.sort === 'asc' ? 'asc' : 'desc';

    const [total, posts] = await Promise.all([
      this.prisma.newsPost.count({ where }),
      this.prisma.newsPost.findMany({
        where,
        skip,
        take: limit,
        orderBy: { publishDate: sortOrder },
        include: {
          author: {
            select: {
              id: true,
              fname: true,
              lname: true,
              username: true,
              email: true,
              avatarUrl: true,
            },
          },
        },
      }),
    ]);

    return {
      data: posts.map((p) => this.formatPost(p)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    };
  }

  /**
   * Retrieve a single news article by ID.
   * If not admin, enforces publishDate <= now and status == 'PUBLISHED'.
   */
  async findById(id: string, adminMode = false) {
    const post = await this.prisma.newsPost.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            fname: true,
            lname: true,
            username: true,
            email: true,
            avatarUrl: true,
          },
        },
      },
    });

    if (!post) {
      throw new NotFoundException(`News article with ID '${id}' not found.`);
    }

    if (!adminMode) {
      const isPublished = post.status === 'PUBLISHED';
      const isPastOrPresent = new Date(post.publishDate) <= new Date();
      if (!isPublished || !isPastOrPresent) {
        throw new NotFoundException(
          `News article with ID '${id}' not found or not yet published.`,
        );
      }
    }

    return this.formatPost(post);
  }

  /**
   * Create a new news post.
   */
  async create(dto: CreateNewsDto, authorId?: string, file?: UploadedFile) {
    let coverImageUrl = dto.coverImageUrl || dto.coverImage || null;

    if (file) {
      const upload = await this.mediaService.saveFile(file, 'news');
      coverImageUrl = upload.url;
    }

    const isDraft =
      dto.isDraft === true || dto.status?.toUpperCase() === 'DRAFT';
    const status = isDraft ? 'DRAFT' : 'PUBLISHED';

    let publishDate = new Date();
    if (dto.publishDate) {
      const parsed = new Date(dto.publishDate);
      if (!isNaN(parsed.getTime())) {
        publishDate = parsed;
      }
    }

    const post = await this.prisma.newsPost.create({
      data: {
        title: dto.title,
        body: dto.body,
        coverImageUrl,
        status,
        publishDate,
        authorId: authorId || null,
      },
      include: {
        author: {
          select: {
            id: true,
            fname: true,
            lname: true,
            username: true,
            email: true,
            avatarUrl: true,
          },
        },
      },
    });

    return this.formatPost(post);
  }

  /**
   * Update an existing news post.
   */
  async update(id: string, dto: UpdateNewsDto, file?: UploadedFile) {
    const existing = await this.prisma.newsPost.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException(`News article with ID '${id}' not found.`);
    }

    let coverImageUrl = existing.coverImageUrl;
    if (file) {
      const upload = await this.mediaService.saveFile(file, 'news');
      coverImageUrl = upload.url;
    } else if (dto.coverImageUrl !== undefined) {
      coverImageUrl = dto.coverImageUrl;
    } else if (dto.coverImage !== undefined) {
      coverImageUrl = dto.coverImage;
    }

    let status = existing.status;
    if (dto.isDraft !== undefined) {
      status = dto.isDraft ? 'DRAFT' : 'PUBLISHED';
    } else if (dto.status !== undefined) {
      status = dto.status.toUpperCase() === 'DRAFT' ? 'DRAFT' : 'PUBLISHED';
    }

    let publishDate = existing.publishDate;
    if (dto.publishDate) {
      const parsed = new Date(dto.publishDate);
      if (!isNaN(parsed.getTime())) {
        publishDate = parsed;
      }
    }

    const updated = await this.prisma.newsPost.update({
      where: { id },
      data: {
        ...(dto.title && { title: dto.title }),
        ...(dto.body && { body: dto.body }),
        coverImageUrl,
        status,
        publishDate,
      },
      include: {
        author: {
          select: {
            id: true,
            fname: true,
            lname: true,
            username: true,
            email: true,
            avatarUrl: true,
          },
        },
      },
    });

    return this.formatPost(updated);
  }

  /**
   * Delete a news post.
   */
  async delete(id: string) {
    const existing = await this.prisma.newsPost.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException(`News article with ID '${id}' not found.`);
    }

    await this.prisma.newsPost.delete({
      where: { id },
    });

    return {
      status: 'success',
      message: 'News post deleted successfully',
      deletedId: id,
    };
  }
}

