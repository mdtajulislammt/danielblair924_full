import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service.js';

@WebSocketGateway({
  cors: {
    origin: (process.env.CORS_ORIGINS || 'http://localhost:3000,http://localhost:3001,https://firstmileclub.co.uk')
      .split(',')
      .map((s) => s.trim()),
    credentials: true,
  },
  path: '/socket.io',
})
export class NotificationsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(NotificationsGateway.name);

  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  async handleConnection(client: Socket) {
    try {
      const authHeader = client.handshake.headers.authorization;
      const token =
        client.handshake.auth?.token ||
        (authHeader && authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null);

      if (!token) {
        this.logger.debug(`Rejecting unauthenticated websocket client: ${client.id}`);
        client.disconnect(true);
        return;
      }

      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET || 'fmc-jwt-super-secret-key-production-ready',
      });

      if (!payload || payload.type !== 'access' || !payload.sub) {
        client.disconnect(true);
        return;
      }

      // If token contains session id (sid), check session validity
      if (payload.sid) {
        const session = await this.prisma.userSession.findUnique({
          where: { id: payload.sid },
        });
        if (!session || session.expiresAt <= new Date()) {
          this.logger.debug(`Rejecting websocket client with expired/revoked session: ${client.id}`);
          client.disconnect(true);
          return;
        }
      }

      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
        select: { id: true, role: true, status: true },
      });

      if (!user || user.status === 'SUSPENDED') {
        client.disconnect(true);
        return;
      }

      // Attach user to socket data and join individual user room
      client.data.userId = user.id;
      client.data.role = user.role;
      client.join(`user:${user.id}`);

      // If user is ADMIN or SUPERADMIN, also join admins room
      if (user.role === 'ADMIN' || user.role === 'SUPERADMIN') {
        client.join('admins');
      }

      this.logger.debug(`Websocket client connected: ${client.id} (user: ${user.id}, role: ${user.role})`);
    } catch (err: any) {
      this.logger.debug(`Failed websocket authentication for ${client.id}: ${err?.message}`);
      client.disconnect(true);
    }
  }

  handleDisconnect(client: Socket) {
    this.logger.debug(`Websocket client disconnected: ${client.id}`);
  }

  emitToUser(userId: string, event: string, data: any) {
    if (this.server) {
      this.server.to(`user:${userId}`).emit(event, data);
    }
  }

  emitToAdmins(event: string, data: any) {
    if (this.server) {
      this.server.to('admins').emit(event, data);
    }
  }
}

