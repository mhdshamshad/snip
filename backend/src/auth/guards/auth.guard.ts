import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { Env } from '../../config/env.validation';
import { AuthenticatedUser, JwtPayload } from '../../shared/types/auth.types';
import { RedisService } from '../../redis/redis.service';
import { REDIS_KEYS } from '../../shared/constants/redis.constants';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService<Env, true>,
    private readonly redisService: RedisService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = request.headers.authorization?.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('Please sign in to continue.');
    }

    try {
      const accessSecret = this.configService.getOrThrow('JWT_ACCESS_SECRET', {
        infer: true,
      });

      const payload = await this.jwtService.verifyAsync<JwtPayload>(token, {
        secret: accessSecret,
      });

      const [isBlacklisted, loggedOutAt, deviceLoggedOutAt] = await Promise.all(
        [
          this.redisService.get(REDIS_KEYS.AUTH.BLACKLISTED_TOKEN(token)),
          this.redisService.get(
            REDIS_KEYS.AUTH.USER_LOGGED_OUT_AT(payload.sub),
          ),
          this.redisService.get(
            REDIS_KEYS.AUTH.DEVICE_LOGGED_OUT_AT(payload.sub, payload.deviceId),
          ),
        ],
      );

      if (
        isBlacklisted ||
        (loggedOutAt && payload.iat < Number(loggedOutAt)) ||
        (deviceLoggedOutAt && payload.iat < Number(deviceLoggedOutAt))
      ) {
        throw new UnauthorizedException(
          'Your session has expired. Please sign in again.',
        );
      }
      (request as Request & { user: AuthenticatedUser }).user = {
        id: payload.sub,
        deviceId: payload.deviceId,
      };

      return true;
    } catch (err) {
      if (err instanceof UnauthorizedException) {
        throw err;
      }
      throw new UnauthorizedException(
        'Your session has expired. Please sign in again.',
      );
    }
  }
}
