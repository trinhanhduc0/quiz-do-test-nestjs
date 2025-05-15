import {
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
  Logger,
} from '@nestjs/common';
import { createClient, RedisClientType } from 'redis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);
  private client: RedisClientType;

  async onModuleInit() {
    this.client = createClient({
      url: process.env.REDIS_URI || 'redis://localhost:6379',
    });

    this.client.on('error', (err) => {
      this.logger.error(`Redis error: ${err}`);
    });

    await this.client.connect();
    this.logger.log('Redis connected');
  }

  async onModuleDestroy() {
    if (this.client) {
      await this.client.quit();
      this.logger.log('Redis connection closed');
    }
  }

  async set(key: string, value: any, ttl: number) {
    await this.client.set(key, value, {
      EX: ttl,
    });
  }

  async get(key: string) {
    const val = await this.client.get(key);
    return val ? JSON.parse(val) : null;
  }

  async delete(key: string) {
    await this.client.del(key);
  }

  async exists(key: string): Promise<boolean> {
    const exists = await this.client.exists(key);
    return exists === 1;
  }
}
