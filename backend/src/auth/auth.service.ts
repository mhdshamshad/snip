import {
  BadRequestException,
  ConflictException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService, type JwtSignOptions } from '@nestjs/jwt';
import { randomBytes, randomUUID } from 'crypto';
import { OAuth2Client, type TokenPayload } from 'google-auth-library';
import {
  type IUserRepository,
  USER_REPOSITORY,
} from '../users/repositories/IUserRepository';
import { LoginDto } from './dto/login.dto';
import { GoogleAuthDto } from './dto/google-auth.dto';
import { RegisterDto } from './dto/register.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { ResendOtpDto } from './dto/resend-otp.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { comparePassword, hashPassword } from '../shared/utils/password.util';
import { generateOtp6Digit } from '../shared/utils/otp.util';
import { Env, Environment } from '../config/env.validation';
import { JwtPayload } from '../shared/types/auth.types';
import { RedisService } from '../redis/redis.service';
import { toUserResponse, UserResponse } from '../users/dto/user-response.dto';
import {
  EMAIL_CHANGE_WINDOW_SECONDS,
  OTP_TTL_SECONDS,
  REDIS_KEYS,
} from '../shared/constants/redis.constants';
import { EMAIL_SERVICE, type IEmailService } from '../email/email.interface';
import { ChangePasswordDto } from './dto/change-password.dto';
import { VerifyEmailChangeDto } from './dto/verify-email-change.dto';

interface PendingRegistration {
  name: string;
  email: string;
  passwordHash: string;
  otp: string;
}

interface PendingEmailChange {
  email: string;
  otp: string;
}
const SESSION_EXPIRED = 'Your session has expired. Please sign in again.';
const MAX_OTP_ATTEMPTS = 5;
const MAX_EMAIL_CHANGES_PER_WINDOW = 2;

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly googleClient = new OAuth2Client();
  private readonly refreshTtl: number;

  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepo: IUserRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService<Env, true>,
    private readonly redisService: RedisService,
    @Inject(EMAIL_SERVICE)
    private readonly emailService: IEmailService,
  ) {
    this.refreshTtl =
      this.configService.get('REFRESH_TOKEN_EXPIRES_IN_DAYS', { infer: true }) *
      86400; // 24 * 60 * 60
  }

  async register(dto: RegisterDto) {
    const { name, email, password } = dto;

    const existingUser = await this.userRepo.findByEmail(email);
    if (existingUser) {
      throw new ConflictException('Email already in use');
    }
    const otp = generateOtp6Digit();
    const [passwordHash] = await Promise.all([
      hashPassword(password),
      this._sendOtpEmail(
        email,
        otp,
        'Verify your Snip account',
        'Welcome to Snip! Use the code below to complete your registration.',
      ),
    ]);

    const pendingData: PendingRegistration = {
      name,
      email,
      passwordHash,
      otp,
    };

    await Promise.all([
      this.redisService.set(
        REDIS_KEYS.AUTH.REGISTER_OTP(email),
        JSON.stringify(pendingData),
        OTP_TTL_SECONDS,
      ),
      this.redisService.delete(REDIS_KEYS.AUTH.REGISTER_OTP_ATTEMPTS(email)),
    ]);
  }

  async verifyOtp({ email, otp }: VerifyOtpDto) {
    const otpKey = REDIS_KEYS.AUTH.REGISTER_OTP(email);
    const attemptsKey = REDIS_KEYS.AUTH.REGISTER_OTP_ATTEMPTS(email);

    const [attempts, pending] = await Promise.all([
      this.redisService.incr(attemptsKey, OTP_TTL_SECONDS),
      this._getPending(email),
    ]);

    if (!pending) {
      throw new BadRequestException(
        'Invalid or expired verification code. Please register again.',
      );
    }
    if (pending.otp !== otp) {
      throw new BadRequestException(
        `Invalid verification code. ${MAX_OTP_ATTEMPTS - attempts + 1} attempt(s) remaining.`,
      );
    }

    if (attempts > MAX_OTP_ATTEMPTS) {
      await this.redisService.delete(otpKey);

      throw new HttpException(
        'Too many failed attempts. Please register again.',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }
    if (await this.userRepo.findByEmail(email)) {
      throw new ConflictException('Email already in use');
    }

    const user = await this.userRepo.create({
      name: pending.name,
      email: pending.email,
      passwordHash: pending.passwordHash,
    });

    const deviceId = randomUUID();
    const [tokens] = await Promise.all([
      this._createSession(user.id, deviceId),
      this.redisService.delete(otpKey),
      this.redisService.delete(attemptsKey),
    ]);

    return {
      ...tokens,
      user: toUserResponse(user),
    };
  }

  async resendOtp(dto: ResendOtpDto) {
    const { email } = dto;

    const pending = await this._getPending(email);
    if (!pending) {
      throw new BadRequestException(
        'No pending registration found. Please register again.',
      );
    }

    pending.otp = generateOtp6Digit();

    await Promise.all([
      this.redisService.set(
        REDIS_KEYS.AUTH.REGISTER_OTP(email),
        JSON.stringify(pending),
        OTP_TTL_SECONDS,
      ),
      this.redisService.delete(REDIS_KEYS.AUTH.REGISTER_OTP_ATTEMPTS(email)),
      this._sendOtpEmail(
        email,
        pending.otp,
        'Your new Snip verification code',
        'Welcome to Snip! Use the code below to complete your registration.',
      ),
    ]);

    return {
      message: 'A new verification code has been sent to your email',
    };
  }

  async forgotPassword({ email }: ForgotPasswordDto): Promise<void> {
    const user = await this.userRepo.findByEmail(email);
    if (!user) return;

    const otp = generateOtp6Digit();

    await Promise.all([
      this.redisService.set(
        REDIS_KEYS.AUTH.PASSWORD_RESET(email),
        otp,
        OTP_TTL_SECONDS,
      ),
      this.redisService.delete(REDIS_KEYS.AUTH.PASSWORD_RESET_ATTEMPTS(email)),
      this._sendOtpEmail(
        email,
        otp,
        'Reset your Snip password',
        'You requested to reset your Snip password. Use the code below to continue.',
      ),
    ]);
  }

  async resetPassword({
    email,
    otp,
    newPassword,
  }: ResetPasswordDto): Promise<void> {
    const otpKey = REDIS_KEYS.AUTH.PASSWORD_RESET(email);
    const attemptsKey = REDIS_KEYS.AUTH.PASSWORD_RESET_ATTEMPTS(email);

    const [attempts, storedOtp] = await Promise.all([
      this.redisService.incr(attemptsKey, OTP_TTL_SECONDS),
      this.redisService.get(otpKey),
    ]);

    if (attempts > MAX_OTP_ATTEMPTS) {
      await this.redisService.delete(otpKey);
      throw new HttpException(
        'Too many failed attempts. Please request a new code.',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }
    if (!storedOtp) {
      throw new BadRequestException(
        'Invalid or expired verification code. Please request a new code.',
      );
    }
    if (storedOtp !== otp) {
      throw new BadRequestException(
        `Invalid verification code. ${MAX_OTP_ATTEMPTS - attempts + 1} attempt(s) remaining.`,
      );
    }

    const [user, passwordHash] = await Promise.all([
      this.userRepo.findByEmail(email),
      hashPassword(newPassword),
    ]);
    if (!user) {
      throw new BadRequestException(
        'Unable to reset password. Please request a new code.',
      );
    }

    await this.userRepo.update(user.id, { passwordHash });

    await Promise.all([
      this.redisService.delete(otpKey),
      this.redisService.delete(attemptsKey),
      this.logoutAll(user.id),
    ]);
  }

  async login(dto: LoginDto) {
    const { email, password } = dto;
    const user = await this.userRepo.findByEmail(email);
    if (!user || !(await comparePassword(password, user.passwordHash))) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const deviceId = randomUUID();
    const tokens = await this._createSession(user.id, deviceId);

    return {
      ...tokens,
      user: toUserResponse(user),
    };
  }

  async googleLogin({ idToken }: GoogleAuthDto) {
    const googleClientIds = this.configService
      .get('GOOGLE_CLIENT_ID', { infer: true })
      .split(',')
      .map((id) => id.trim());

    let payload: TokenPayload | undefined;
    try {
      const ticket = await this.googleClient.verifyIdToken({
        idToken,
        audience: googleClientIds,
      });
      payload = ticket.getPayload();
    } catch (error: unknown) {
      this.logger.warn('Google ID token verification failed', {
        errorName: error instanceof Error ? error.name : 'UnknownError',
      });
      throw new UnauthorizedException(
        'Google authentication failed. Please try again.',
      );
    }

    if (!payload?.email || payload.email_verified !== true) {
      throw new UnauthorizedException(
        'A verified Google email address is required.',
      );
    }
    const email = payload.email.trim().toLowerCase();
    const deviceId = randomUUID();

    const user = await this.userRepo.findByEmail(email);

    if (user) {
      return {
        ...(await this._createSession(user.id, deviceId)),
        user: toUserResponse(user),
      };
    }

    const passwordHash = await hashPassword(randomBytes(32).toString('hex'));
    const newUser = await this.userRepo.create({
      name: (payload.name ?? email.split('@')[0]).slice(0, 30),
      email,
      passwordHash,
    });

    const tokens = await this._createSession(newUser.id, deviceId);
    return {
      ...tokens,
      user: toUserResponse(newUser),
    };
  }

  async refresh(refreshToken: string, oldAccessToken?: string) {
    let payload: JwtPayload;
    try {
      payload = await this.jwtService.verifyAsync<JwtPayload>(refreshToken, {
        secret: this.configService.getOrThrow('JWT_REFRESH_SECRET', {
          infer: true,
        }),
      });
    } catch {
      throw new UnauthorizedException(SESSION_EXPIRED);
    }

    const { sub: userId, deviceId, iat } = payload;

    const [loggedOutAt, storedToken] = await Promise.all([
      this.redisService.get(REDIS_KEYS.AUTH.USER_LOGGED_OUT_AT(userId)),
      this.redisService.get(REDIS_KEYS.AUTH.REFRESH_TOKEN(userId, deviceId)),
    ]);

    if (
      storedToken !== refreshToken ||
      (loggedOutAt && iat < Number(loggedOutAt))
    ) {
      throw new UnauthorizedException(SESSION_EXPIRED);
    }

    const user = await this.userRepo.findById(userId);
    if (!user) {
      throw new UnauthorizedException('User no longer exists');
    }

    const [tokens] = await Promise.all([
      this._createSession(user.id, deviceId),
      this._blacklistAccessToken(oldAccessToken),
    ]);

    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      user: toUserResponse(user),
    };
  }

  async logout(refreshToken?: string, accessToken?: string) {
    const nowInSeconds = Math.floor(Date.now() / 1000);
    const token = refreshToken ?? accessToken;
    const sessionPayload = token
      ? (this.jwtService.decode(token) as JwtPayload | null)
      : null;
    const operations: Promise<void>[] = [
      this._blacklistAccessToken(accessToken),
    ];

    if (sessionPayload?.sub && sessionPayload.deviceId) {
      const { sub, deviceId } = sessionPayload;
      operations.push(
        this.redisService.set(
          REDIS_KEYS.AUTH.DEVICE_LOGGED_OUT_AT(sub, deviceId),
          nowInSeconds.toString(),
          this.refreshTtl,
        ),
        this.redisService.delete(REDIS_KEYS.AUTH.REFRESH_TOKEN(sub, deviceId)),
      );
    }

    await Promise.all(operations);
  }

  async logoutAll(userId: string) {
    const invalidationCutoff = Math.floor(Date.now() / 1000) + 1;

    const [, keys] = await Promise.all([
      this.redisService.set(
        REDIS_KEYS.AUTH.USER_LOGGED_OUT_AT(userId),
        invalidationCutoff.toString(),
        this.refreshTtl,
      ),
      this.redisService.client
        .keys(REDIS_KEYS.AUTH.REFRESH_PATTERN(userId))
        .catch(() => [] as string[]),
    ]);

    if (keys.length > 0) {
      void this.redisService.client.del(...keys).catch(() => undefined);
    }
  }

  async getMe(userId: string): Promise<UserResponse> {
    const user = await this.userRepo.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return toUserResponse(user);
  }

  async changePassword(
    userId: string,
    deviceId: string,
    { currentPassword, newPassword }: ChangePasswordDto,
  ) {
    const user = await this.userRepo.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!(await comparePassword(currentPassword, user.passwordHash))) {
      throw new BadRequestException('Current password is incorrect');
    }
    const invalidationCutoff = Math.floor(Date.now() / 1000) + 1;

    const [passwordHash] = await Promise.all([
      hashPassword(newPassword),
      this.redisService.set(
        REDIS_KEYS.AUTH.USER_LOGGED_OUT_AT(userId),
        invalidationCutoff.toString(),
        this.refreshTtl,
      ),
    ]);
    await this.userRepo.update(userId, { passwordHash });
    const { accessToken, refreshToken } = await this._createSession(
      userId,
      deviceId,
      invalidationCutoff,
    );

    return {
      accessToken,
      refreshToken,
      user: toUserResponse(user),
    };
  }

  async requestEmailChange(userId: string, email: string) {
    const attemptsKey = REDIS_KEYS.AUTH.EMAIL_CHANGE_LIMIT(userId);

    const [user, existingUser, emailChanges] = await Promise.all([
      this.userRepo.findById(userId),
      this.userRepo.findByEmail(email),
      this.redisService.get(attemptsKey),
    ]);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (email === user.email) {
      throw new BadRequestException('This is already your current email');
    }
    if (existingUser) {
      throw new ConflictException('Email already in use');
    }
    if (emailChanges && Number(emailChanges) > MAX_EMAIL_CHANGES_PER_WINDOW) {
      throw new HttpException(
        `You can change your email up to ${MAX_EMAIL_CHANGES_PER_WINDOW} times within a 
        ${EMAIL_CHANGE_WINDOW_SECONDS / (24 * 60 * 60)}-day period.`,
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    const otp = generateOtp6Digit();
    const pending: PendingEmailChange = { email, otp };

    await Promise.all([
      this.redisService.set(
        REDIS_KEYS.AUTH.EMAIL_CHANGE_OTP(userId),
        JSON.stringify(pending),
        OTP_TTL_SECONDS,
      ),
      this.redisService.delete(
        REDIS_KEYS.AUTH.EMAIL_CHANGE_OTP_ATTEMPTS(userId),
      ),
      this._sendOtpEmail(
        email,
        otp,
        'Verify your new Snip email address',
        'Use the code below to confirm your new email address.',
      ),
    ]);
  }

  async verifyEmailChange(
    userId: string,
    { email, otp }: VerifyEmailChangeDto,
  ) {
    const otpKey = REDIS_KEYS.AUTH.EMAIL_CHANGE_OTP(userId);
    const attemptsKey = REDIS_KEYS.AUTH.EMAIL_CHANGE_OTP_ATTEMPTS(userId);
    const [attempts, rawPending] = await Promise.all([
      this.redisService.incr(attemptsKey, OTP_TTL_SECONDS),
      this.redisService.get(otpKey),
    ]);

    if (attempts > MAX_OTP_ATTEMPTS) {
      await Promise.all([
        this.redisService.delete(otpKey),
        this.redisService.delete(attemptsKey),
      ]);
      throw new HttpException(
        'Too many verification attempts. Please request a new code.',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }
    if (!rawPending) {
      throw new BadRequestException(
        'No pending email change. Request a new verification code.',
      );
    }

    let pending: PendingEmailChange;
    try {
      pending = JSON.parse(rawPending) as PendingEmailChange;
    } catch {
      throw new BadRequestException('Invalid email verification state');
    }

    if (pending.email !== email || pending.otp !== otp) {
      throw new BadRequestException(
        `Invalid verification code. ${MAX_OTP_ATTEMPTS - attempts} attempt(s) remaining.`,
      );
    }
    const user = await this.userRepo.update(userId, { email });
    await Promise.all([
      this.redisService.delete(otpKey),
      this.redisService.delete(attemptsKey),
      this.redisService.incr(
        REDIS_KEYS.AUTH.EMAIL_CHANGE_LIMIT(userId),
        EMAIL_CHANGE_WINDOW_SECONDS,
      ),
    ]);

    return toUserResponse(user);
  }
  
  private async _createSession(
    userId: string,
    deviceId: string,
    issuedAt?: number,
  ) {
    const payload = {
      sub: userId,
      deviceId,
      ...(issuedAt === undefined ? {} : { iat: issuedAt }),
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.getOrThrow('JWT_ACCESS_SECRET', {
          infer: true,
        }),
        expiresIn: this.configService.getOrThrow('JWT_ACCESS_EXPIRES_IN', {
          infer: true,
        }) as JwtSignOptions['expiresIn'],
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.getOrThrow('JWT_REFRESH_SECRET', {
          infer: true,
        }),
        expiresIn: this.refreshTtl,
      }),
    ]);

    await this.redisService.set(
      REDIS_KEYS.AUTH.REFRESH_TOKEN(userId, deviceId),
      refreshToken,
      this.refreshTtl,
    );

    return { accessToken, refreshToken };
  }

  private async _getPending(
    email: string,
  ): Promise<PendingRegistration | null> {
    const raw = await this.redisService.get(
      REDIS_KEYS.AUTH.REGISTER_OTP(email),
    );
    if (!raw) return null;

    try {
      return JSON.parse(raw) as PendingRegistration;
    } catch {
      throw new BadRequestException('Invalid verification state');
    }
  }

  private async _blacklistAccessToken(token?: string): Promise<void> {
    if (!token) return;
    const payload = this.jwtService.decode(token) as JwtPayload | null;
    const ttl = payload?.exp ? payload.exp - Math.floor(Date.now() / 1000) : 0;
    if (ttl > 0) {
      await this.redisService.set(
        REDIS_KEYS.AUTH.BLACKLISTED_TOKEN(token),
        'revoked',
        ttl,
      );
    }
  }

  private async _sendOtpEmail(
    email: string,
    otp: string,
    subject: string,
    intro: string,
  ) {
    const minutes = OTP_TTL_SECONDS / 60;
    await this.emailService.sendEmail({
      to: email,
      subject,
      text: `${intro} Your code is: ${otp}. It will expire in ${minutes} minutes.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 24px; border: 1px solid #e4e4e7; border-radius: 8px;">
          <h2 style="color: #09090b; margin-top: 0;">${subject}</h2>
          <p style="color: #71717a; font-size: 15px;">${intro}</p>
          <div style="text-align: center; margin: 28px 0;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #ea580c; background-color: #fff7ed; padding: 12px 24px; border-radius: 6px; border: 1px dashed #fed7aa;">
              ${otp}
            </span>
          </div>
          <p style="color: #71717a; font-size: 13px;">This code will expire in ${minutes} minutes. If you did not request it, you can safely ignore this email.</p>
        </div>
      `,
    });

    if (
      this.configService.get('NODE_ENV', { infer: true }) ===
      Environment.Development
    ) {
      this.logger.log(`Generated OTP for ${email}: ${otp}`);
    }
  }
}
