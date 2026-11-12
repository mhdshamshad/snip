import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RedisService } from '../redis/redis.service';

export interface HealthStatus {
  status: 'ok';
  timestamp: string;
  uptime: number;
  redis: 'up' | 'down';
}

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(private readonly redisService: RedisService) {}

  @Get()
  @ApiOperation({ summary: 'Check API health' })
  @ApiResponse({ status: 200, description: 'Service is healthy' })
  async check(): Promise<HealthStatus> {
    const redis = await this.redisService.ping();

    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      redis,
    };
  }
}
