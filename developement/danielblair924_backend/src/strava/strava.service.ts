import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { NotificationsService } from '../notifications/notifications.service.js';

export interface StravaTokenResponse {
  token_type: string;
  expires_at: number;
  expires_in: number;
  refresh_token: string;
  access_token: string;
  athlete?: {
    id: number;
    username?: string;
    firstname?: string;
    lastname?: string;
  };
}

export interface StravaActivity {
  id: number;
  name: string;
  distance: number; // in meters
  moving_time: number; // in seconds
  elapsed_time: number;
  type: string; // "Run", "Walk", etc.
  sport_type?: string;
  start_date: string;
  map?: {
    summary_polyline?: string;
  };
}

@Injectable()
export class StravaService {
  private readonly logger = new Logger(StravaService.name);

  private readonly clientId = process.env.STRAVA_CLIENT_ID || '';
  private readonly clientSecret = process.env.STRAVA_CLIENT_SECRET || '';
  private readonly redirectUri =
    process.env.STRAVA_REDIRECT_URI ||
    'http://localhost:4000/api/strava/callback';
  private readonly webhookVerifyToken =
    process.env.STRAVA_WEBHOOK_VERIFY_TOKEN ||
    'fmc_strava_webhook_verification_token_2026';

  constructor(
    private readonly prisma: PrismaService,
    private readonly notifications: NotificationsService,
  ) {}

  /**
   * Generates official Strava OAuth authorization URL.
   */
  getAuthorizeUrl(userId: string): { url: string } {
    const scope = 'read,activity:read_all';
    const params = new URLSearchParams({
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      response_type: 'code',
      approval_prompt: 'auto',
      scope,
      state: userId, // Pass userId in state to correlate on callback
    });

    return {
      url: `https://www.strava.com/oauth/authorize?${params.toString()}`,
    };
  }

  /**
   * Exchange authorization code for Strava access & refresh tokens.
   */
  async exchangeToken(userId: string, code: string) {
    if (!this.clientId || !this.clientSecret) {
      throw new BadRequestException('Strava credentials are not configured');
    }

    try {
      const response = await fetch('https://www.strava.com/oauth/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_id: this.clientId,
          client_secret: this.clientSecret,
          code,
          grant_type: 'authorization_code',
        }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        this.logger.error(`Strava token exchange failed: ${errorData}`);
        throw new BadRequestException('Failed to exchange Strava authorization code');
      }

      const data = (await response.json()) as StravaTokenResponse;
      const athleteId = data.athlete?.id?.toString();
      const expiresAt = new Date(data.expires_at * 1000);

      const updatedUser = await this.prisma.user.update({
        where: { id: userId },
        data: {
          stravaAthleteId: athleteId,
          stravaAccessToken: data.access_token,
          stravaRefreshToken: data.refresh_token,
          stravaTokenExpiresAt: expiresAt,
          isStravaConnected: true,
        },
        select: {
          id: true,
          email: true,
          username: true,
          stravaAthleteId: true,
          isStravaConnected: true,
        },
      });

      return {
        status: 'success' as const,
        message: 'Strava account linked successfully',
        data: updatedUser,
      };
    } catch (err: any) {
      if (err instanceof BadRequestException) throw err;
      this.logger.error(`Error exchanging token: ${err.message}`);
      throw new BadRequestException('Error linking Strava account');
    }
  }

  /**
   * Get valid access token, auto-refreshing if expired.
   */
  async getValidAccessToken(userId: string): Promise<string> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        stravaAccessToken: true,
        stravaRefreshToken: true,
        stravaTokenExpiresAt: true,
      },
    });

    if (!user || !user.stravaAccessToken || !user.stravaRefreshToken) {
      throw new BadRequestException('Strava is not connected for this user');
    }

    const now = new Date();
    // If token expires in less than 5 minutes or is already expired, refresh it
    if (!user.stravaTokenExpiresAt || user.stravaTokenExpiresAt.getTime() - now.getTime() < 300000) {
      return this.refreshAccessToken(userId, user.stravaRefreshToken);
    }

    return user.stravaAccessToken;
  }

  /**
   * Refreshes the Strava OAuth access token.
   */
  private async refreshAccessToken(userId: string, refreshToken: string): Promise<string> {
    try {
      const response = await fetch('https://www.strava.com/oauth/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_id: this.clientId,
          client_secret: this.clientSecret,
          grant_type: 'refresh_token',
          refresh_token: refreshToken,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to refresh Strava token');
      }

      const data = (await response.json()) as StravaTokenResponse;
      const expiresAt = new Date(data.expires_at * 1000);

      await this.prisma.user.update({
        where: { id: userId },
        data: {
          stravaAccessToken: data.access_token,
          stravaRefreshToken: data.refresh_token,
          stravaTokenExpiresAt: expiresAt,
        },
      });

      return data.access_token;
    } catch (err: any) {
      this.logger.error(`Failed to refresh Strava token for user ${userId}: ${err.message}`);
      throw new BadRequestException('Failed to refresh Strava authentication token');
    }
  }

  /**
   * Disconnects Strava account for user.
   */
  async disconnect(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || !user.isStravaConnected) {
      return {
        status: 'success' as const,
        message: 'Strava is already disconnected',
      };
    }

    // Try deauthorizing on Strava side
    if (user.stravaAccessToken) {
      try {
        await fetch('https://www.strava.com/oauth/deauthorize', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${user.stravaAccessToken}`,
          },
        });
      } catch (err: any) {
        this.logger.warn(`Could not deauthorize on Strava server: ${err.message}`);
      }
    }

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        stravaAthleteId: null,
        stravaAccessToken: null,
        stravaRefreshToken: null,
        stravaTokenExpiresAt: null,
        isStravaConnected: false,
      },
    });

    return {
      status: 'success' as const,
      message: 'Strava disconnected successfully',
    };
  }

  /**
   * Get Strava connection status for a user.
   */
  async getStatus(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        isStravaConnected: true,
        stravaAthleteId: true,
        stravaTokenExpiresAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      status: 'success' as const,
      data: {
        isConnected: user.isStravaConnected,
        athleteId: user.stravaAthleteId,
      },
    };
  }

  /**
   * Webhook verification challenge validation.
   */
  verifyWebhookChallenge(mode: string, token: string, challenge: string): { 'hub.challenge': string } {
    if (mode === 'subscribe' && token === this.webhookVerifyToken) {
      this.logger.log('Strava webhook challenge successfully verified');
      return { 'hub.challenge': challenge };
    }
    throw new BadRequestException('Invalid webhook verification token');
  }

  /**
   * Process incoming Strava Webhook activity event.
   */
  async handleWebhookEvent(event: any) {
    this.logger.log(`Received Strava webhook event: ${JSON.stringify(event)}`);

    // We only care about new activity creation
    if (event.object_type !== 'activity' || event.aspect_type !== 'create') {
      return { status: 'ignored', reason: 'Not an activity creation event' };
    }

    const athleteId = event.owner_id?.toString();
    const activityId = event.object_id?.toString();

    if (!athleteId || !activityId) {
      return { status: 'ignored', reason: 'Missing athlete or activity ID' };
    }

    // Find linked user
    const user = await this.prisma.user.findUnique({
      where: { stravaAthleteId: athleteId },
    });

    if (!user) {
      this.logger.warn(`No user found with stravaAthleteId: ${athleteId}`);
      return { status: 'ignored', reason: 'No matching runner in First Mile Club' };
    }

    // Check if submission already exists for this Strava activity
    const existing = await this.prisma.submission.findUnique({
      where: { stravaActivityId: activityId },
    });

    if (existing) {
      this.logger.log(`Activity ${activityId} already synced for user ${user.id}`);
      return { status: 'already_processed', submissionId: existing.id };
    }

    // Fetch detailed activity from Strava API
    try {
      const accessToken = await this.getValidAccessToken(user.id);
      const activityRes = await fetch(`https://www.strava.com/api/v3/activities/${activityId}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (!activityRes.ok) {
        this.logger.error(`Failed to fetch activity ${activityId}: ${activityRes.statusText}`);
        return { status: 'error', reason: 'Failed to fetch activity from Strava' };
      }

      const activity = (await activityRes.json()) as StravaActivity;

      // Filter: only Runs or Walks count toward First Mile Club
      const isRunOrWalk =
        activity.type === 'Run' ||
        activity.type === 'Walk' ||
        activity.sport_type === 'Run' ||
        activity.sport_type === 'TrailRun' ||
        activity.sport_type === 'VirtualRun' ||
        activity.sport_type === 'Walk';

      if (!isRunOrWalk) {
        this.logger.log(`Ignoring non-running Strava activity: ${activity.type}`);
        return { status: 'ignored', reason: `Activity type ${activity.type} is not a run/walk` };
      }

      // Convert distance to kilometers (Strava returns meters)
      const distanceKm = parseFloat((activity.distance / 1000).toFixed(2));
      if (distanceKm <= 0.05) {
        return { status: 'ignored', reason: 'Distance too short' };
      }

      // Format duration and pace
      const durationSeconds = activity.moving_time || activity.elapsed_time || 0;
      const hours = Math.floor(durationSeconds / 3600);
      const minutes = Math.floor((durationSeconds % 3600) / 60);
      const seconds = durationSeconds % 60;
      const durationStr =
        hours > 0
          ? `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
          : `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

      // Calculate pace
      const secPerKm = durationSeconds / distanceKm;
      const paceMin = Math.floor(secPerKm / 60);
      const paceSec = Math.round(secPerKm % 60);
      const paceStr = `${paceMin}:${paceSec.toString().padStart(2, '0')} /km`;

      // Find active community challenge (e.g. RATW) to credit
      const activeChallenge = await this.prisma.challenge.findFirst({
        where: { status: 'ACTIVE', scope: 'COMMUNITY_WIDE' },
      });

      // Execute auto-sync and accreditation inside an atomic transaction
      const result = await this.prisma.$transaction(async (tx) => {
        // 1. Create APPROVED submission directly
        const sub = await tx.submission.create({
          data: {
            userId: user.id,
            challengeId: activeChallenge?.id || null,
            activityType: activity.type === 'Walk' ? 'WALKING' : 'RUNNING',
            distanceKm,
            duration: durationStr,
            pace: paceStr,
            runDate: new Date(activity.start_date || Date.now()),
            stravaActivityId: activityId,
            source: 'STRAVA_AUTO',
            summaryPolyline: activity.map?.summary_polyline || null,
            status: 'APPROVED',
            reviewedAt: new Date(),
          },
        });

        // 2. Increment runner's total distance
        await tx.user.update({
          where: { id: user.id },
          data: {
            totalDistanceKm: { increment: distanceKm },
          },
        });

        // 3. Update community challenge progress
        if (activeChallenge) {
          await tx.challenge.update({
            where: { id: activeChallenge.id },
            data: {
              currentProgress: { increment: distanceKm },
            },
          });

          // Ensure participant record exists
          const existingParticipant = await tx.challengeParticipant.findUnique({
            where: {
              challengeId_userId: {
                challengeId: activeChallenge.id,
                userId: user.id,
              },
            },
          });

          if (existingParticipant) {
            await tx.challengeParticipant.update({
              where: { id: existingParticipant.id },
              data: {
                individualKm: { increment: distanceKm },
              },
            });
          } else {
            await tx.challengeParticipant.create({
              data: {
                challengeId: activeChallenge.id,
                userId: user.id,
                individualKm: distanceKm,
              },
            });
          }
        }

        return sub;
      });

      this.logger.log(
        `Successfully auto-synced Strava run: ${distanceKm} km for runner ${user.email} (Submission ${result.id})`,
      );

      // Notify runner of auto-synced run
      void this.notifications
        .notifyUser(
          user.id,
          'STRAVA_RUN_SYNCED',
          'Strava activity synced ⚡',
          `Your ${distanceKm} km Strava run was automatically synced and approved!`,
          { route: 'run_history', submissionId: result.id },
        )
        .catch((err) => this.logger.error(`Failed to send STRAVA_RUN_SYNCED notification: ${err?.message}`));

      return {
        status: 'synced',
        submissionId: result.id,
        distanceKm,
      };
    } catch (err: any) {
      this.logger.error(`Error processing Strava activity ${activityId}: ${err.message}`);
      return { status: 'error', reason: err.message };
    }
  }
}

