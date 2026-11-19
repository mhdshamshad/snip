import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { Throttle } from '@nestjs/throttler';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { GoogleAuthDto } from './dto/google-auth.dto';
import { RegisterDto } from './dto/register.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { ResendOtpDto } from './dto/resend-otp.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { RequestEmailChangeDto } from './dto/request-email-change.dto';
import { VerifyEmailChangeDto } from './dto/verify-email-change.dto';
import { CurrentUser } from './decorators/current-user.decorator';
import { AuthGuard } from './guards/auth.guard';
import {
  clearRefreshCookie,
  REFRESH_COOKIE_NAME,
  setRefreshCookie,
} from '../shared/utils/cookie.util';
import { Env, Environment } from '../config/env.validation';

@Controller('auth')
export class AuthController {
  private readonly isProduction: boolean;
  private readonly refreshTtl: number;

  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService<Env, true>,
  ) {
    this.isProduction =
      this.configService.get('NODE_ENV', { infer: true }) ===
      Environment.Production;

    this.refreshTtl =
      this.configService.get('REFRESH_TOKEN_EXPIRES_IN_DAYS', { infer: true }) *
      86400000; // 24 * 60 * 60 * 1000
  }

  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken, user } =
      await this.authService.login(dto);

    setRefreshCookie(res, refreshToken, this.isProduction, this.refreshTtl);

    return { accessToken, user };
  }

  @Throttle({ default: { limit: 10, ttl: 60_000 } })
  @HttpCode(HttpStatus.OK)
  @Post('google')
  async googleLogin(
    @Body() dto: GoogleAuthDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken, user } =
      await this.authService.googleLogin(dto);

    setRefreshCookie(res, refreshToken, this.isProduction, this.refreshTtl);
    return { accessToken, user };
  }

  @Throttle({ default: { limit: 3, ttl: 60_000 } })
  @Post('register')
  async register(@Body() dto: RegisterDto) {
    await this.authService.register(dto);
    return {
      message: 'Verification code sent to your email',
    };
  }

  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  @HttpCode(HttpStatus.OK)
  @Post('verify-otp')
  async verifyOtp(
    @Body() dto: VerifyOtpDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken, user } =
      await this.authService.verifyOtp(dto);
    setRefreshCookie(res, refreshToken, this.isProduction, this.refreshTtl);
    return { accessToken, user };
  }

  @Throttle({ default: { limit: 3, ttl: 60_000 } })
  @HttpCode(HttpStatus.OK)
  @Post('resend-otp')
  async resendOtp(@Body() dto: ResendOtpDto) {
    return this.authService.resendOtp(dto);
  }

  @Throttle({ default: { limit: 3, ttl: 60_000 } })
  @HttpCode(HttpStatus.OK)
  @Post('forgot-password')
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    await this.authService.forgotPassword(dto);
    return {
      message: 'reset code has been sent this email',
    };
  }

  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  @HttpCode(HttpStatus.OK)
  @Post('reset-password')
  async resetPassword(@Body() dto: ResetPasswordDto) {
    await this.authService.resetPassword(dto);
    return {
      message:
        'Password reset successful. Please sign in with your new password.',
    };
  }

  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const rawRefreshToken = req.cookies?.[REFRESH_COOKIE_NAME] as
      string | undefined;
    const rawAccessToken = req.headers.authorization?.split(' ')[1];
    clearRefreshCookie(res, this.isProduction);
    const { user, accessToken, refreshToken } = await this.authService.refresh(
      rawRefreshToken ?? '',
      rawAccessToken,
    );
    setRefreshCookie(res, refreshToken, this.isProduction, this.refreshTtl);

    return {
      accessToken,
      user,
    };
  }

  @HttpCode(HttpStatus.OK)
  @Post('logout')
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const rawRefreshToken = req.cookies?.[REFRESH_COOKIE_NAME] as
      string | undefined;
    const rawAccessToken = req.headers.authorization?.split(' ')[1];

    await this.authService.logout(rawRefreshToken, rawAccessToken);
    clearRefreshCookie(res, this.isProduction);
    return { message: 'Logged out successfully' };
  }

  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('logout-all')
  async logoutAll(
    @CurrentUser('id') userId: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.authService.logoutAll(userId);
    clearRefreshCookie(res, this.isProduction);
    return { message: 'Logged out from all devices successfully' };
  }

  @UseGuards(AuthGuard)
  @Get('me')
  async getMe(@CurrentUser('id') userId: string) {
    return this.authService.getMe(userId);
  }

  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('email-change')
  async requestEmailChange(
    @CurrentUser('id') userId: string,
    @Body() { email }: RequestEmailChangeDto,
  ) {
    await this.authService.requestEmailChange(userId, email);
    return { message: 'Verification code sent to your new email address' };
  }

  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @Patch('email-change/verify')
  async verifyEmailChange(
    @CurrentUser('id') userId: string,
    @Body() dto: VerifyEmailChangeDto,
  ) {
    const user = await this.authService.verifyEmailChange(userId, dto);
    return {
      user,
      message: 'Email address updated successfully',
    };
  }

  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @Patch('password')
  async changePassword(
    @Res({ passthrough: true }) res: Response,
    @CurrentUser('id') userId: string,
    @CurrentUser('deviceId') deviceId: string,
    @Body() dto: ChangePasswordDto,
  ) {
    const { accessToken, refreshToken, user } =
      await this.authService.changePassword(userId, deviceId, dto);
    setRefreshCookie(res, refreshToken, this.isProduction, this.refreshTtl);
    return {
      accessToken,
      user,
      message: 'Password updated successfully',
    };
  }
}
