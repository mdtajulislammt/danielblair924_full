import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import type { Response } from 'express';
import { StravaService } from './strava.service.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import { StravaExchangeTokenDto } from './dto/strava.dto.js';

@Controller('strava')
export class StravaController {
  constructor(private readonly stravaService: StravaService) {}

  /**
   * Returns official Strava authorize URL for the authenticated user.
   */
  @Get('auth-url')
  @UseGuards(JwtAuthGuard)
  getAuthUrl(@CurrentUser() user: any) {
    return this.stravaService.getAuthorizeUrl(user.id);
  }

  /**
   * OAuth callback redirect from Strava.
   * If called via browser GET redirect, exchanges code and redirects to app deep-link or status page.
   */
  @Get('callback')
  async handleCallback(
    @Query('code') code: string,
    @Query('state') state: string,
    @Query('error') error: string,
    @Res() res: Response,
  ) {
    if (error || !code) {
      return res.status(HttpStatus.BAD_REQUEST).send(`
        <html>
          <body style="font-family: sans-serif; text-align: center; padding: 40px; background: #0f172a; color: white;">
            <h2 style="color: #ef4444;">Strava Connection Cancelled or Failed</h2>
            <p>${error || 'No authorization code provided'}</p>
            <p>You may close this window and return to First Mile Club app.</p>
          </body>
        </html>
      `);
    }

    try {
      // state contains the userId passed during getAuthUrl
      await this.stravaService.exchangeToken(state, code);

      return res.status(HttpStatus.OK).send(`
        <html>
          <body style="font-family: sans-serif; text-align: center; padding: 50px; background: #0b0f19; color: white;">
            <div style="max-width: 450px; margin: auto; padding: 30px; border-radius: 16px; background: #1e293b; border: 1px solid #334155;">
              <h1 style="color: #FC5200; margin-bottom: 8px;">Strava Connected!</h1>
              <p style="color: #94a3b8; font-size: 16px; line-height: 1.5;">
                Your Strava account has been successfully linked to <strong>First Mile Club</strong>.
              </p>
              <div style="margin: 24px 0; padding: 16px; background: #0f172a; border-radius: 12px; font-size: 14px; color: #10b981;">
                ✔ Automatic run syncing is now active
              </div>
              <p style="color: #64748b; font-size: 13px;">You can now close this tab and return to the First Mile Club app.</p>
            </div>
          </body>
        </html>
      `);
    } catch (err: any) {
      return res.status(HttpStatus.BAD_REQUEST).send(`
        <html>
          <body style="font-family: sans-serif; text-align: center; padding: 40px; background: #0f172a; color: white;">
            <h2 style="color: #ef4444;">Connection Failed</h2>
            <p style="color: #94a3b8;">${err.message || 'Unable to complete Strava token exchange.'}</p>
            <p style="color: #64748b;">Please try again from the First Mile Club settings screen.</p>
          </body>
        </html>
      `);
    }
  }

  /**
   * Direct token exchange endpoint for native app in-app token exchange.
   */
  @Post('exchange')
  @UseGuards(JwtAuthGuard)
  async exchangeToken(
    @CurrentUser() user: any,
    @Body() dto: StravaExchangeTokenDto,
  ) {
    return this.stravaService.exchangeToken(user.id, dto.code);
  }

  /**
   * Check connection status for current runner.
   */
  @Get('status')
  @UseGuards(JwtAuthGuard)
  async getStatus(@CurrentUser() user: any) {
    return this.stravaService.getStatus(user.id);
  }

  /**
   * Disconnect Strava account.
   */
  @Post('disconnect')
  @UseGuards(JwtAuthGuard)
  async disconnect(@CurrentUser() user: any) {
    return this.stravaService.disconnect(user.id);
  }

  /**
   * Strava Webhook Handshake Verification (GET).
   */
  @Get('webhook')
  verifyWebhook(
    @Query('hub.mode') mode: string,
    @Query('hub.verify_token') token: string,
    @Query('hub.challenge') challenge: string,
  ) {
    return this.stravaService.verifyWebhookChallenge(mode, token, challenge);
  }

  /**
   * Strava Webhook Event Receiver (POST).
   */
  @Post('webhook')
  @HttpCode(HttpStatus.OK)
  async handleWebhook(@Body() event: any) {
    // Process asynchronously and acknowledge receipt to Strava immediately
    this.stravaService.handleWebhookEvent(event).catch(() => {});
    return { received: true };
  }
}

