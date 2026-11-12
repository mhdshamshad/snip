import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Redis } from 'ioredis';
import { AppConfig } from '../config/configuration';

@Injectable()
export class RedisService implements OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);
  readonly client: Redis;

  constructor(configService: ConfigService<AppConfig, true>) {
    this.client = new Redis(
      configService.getOrThrow('redisUrl', { infer: true }),
      {
        enableOfflineQueue: false,
        maxRetriesPerRequest: 1,
        commandTimeout: 300,
        connectTimeout: 2000,
        retryStrategy: (times) => Math.min(times * 200, 3000),
      },
    );

    this.client.on('error', (err: Error) => {
      this.logger.warn(`Redis error: ${err.message}`);
    });
  }

  async get(key: string): Promise<string | null> {
    try {
      return await this.client.get(key);
    } catch (err) {
      this.logger.warn(
        `Redis GET failed for "${key}": ${this.formatError(err)}`,
      );
      return null;
    }
  }

  async set(key: string, value: string, ttlSeconds?: number): Promise<void> {
    try {
      if (ttlSeconds !== undefined) {
        await this.client.set(key, value, 'EX', ttlSeconds);
        return;
      }
      await this.client.set(key, value);
    } catch (err) {
      this.logger.warn(
        `Redis SET failed for "${key}": ${this.formatError(err)}`,
      );
    }
  }

  async delete(key: string): Promise<void> {
    try {
      await this.client.del(key);
    } catch (err) {
      this.logger.warn(
        `Redis DEL failed for "${key}": ${this.formatError(err)}`,
      );
    }
  }

  async ping(): Promise<'up' | 'down'> {
    try {
      const response = await this.client.ping();
      return response === 'PONG' ? 'up' : 'down';
    } catch {
      return 'down';
    }
  }

  async onModuleDestroy(): Promise<void> {
    await this.client.quit().catch(() => {
      this.client.disconnect();
    });
  }

  private formatError(err: unknown): string {
    return err instanceof Error ? err.message : String(err);
  }
}
