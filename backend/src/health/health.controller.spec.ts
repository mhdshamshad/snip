import { Test, TestingModule } from '@nestjs/testing';
import { RedisService } from '../redis/redis.service';
import { HealthController } from './health.controller';

describe('HealthController', () => {
  let controller: HealthController;
  let pingMock: jest.Mock<Promise<'up' | 'down'>, []>;

  beforeEach(async () => {
    pingMock = jest.fn<Promise<'up' | 'down'>, []>().mockResolvedValue('up');

    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [
        {
          provide: RedisService,
          useValue: { ping: pingMock },
        },
      ],
    }).compile();

    controller = module.get<HealthController>(HealthController);
  });

  it('should return ok status with redis up', async () => {
    const result = await controller.check();

    expect(result.status).toBe('ok');
    expect(result.redis).toBe('up');
    expect(typeof result.timestamp).toBe('string');
    expect(typeof result.uptime).toBe('number');
  });

  it('should still return ok status when redis is down', async () => {
    pingMock.mockResolvedValueOnce('down');

    const result = await controller.check();

    expect(result.status).toBe('ok');
    expect(result.redis).toBe('down');
  });
});
