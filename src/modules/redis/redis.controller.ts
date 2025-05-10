import { Controller, Get, Post, Body, Delete, Query } from '@nestjs/common';
import { RedisService } from './redis.service';

@Controller('redis')
export class RedisController {
  constructor(private readonly redisService: RedisService) {}

  @Post('set')
  async set(
    @Query('key') key: string,
    @Query('expire') expire: number,
    @Body('value') value: any,
  ) {
    return this.redisService.set(key, value, expire);
  }

  @Get('get')
  async get(@Query('key') key: string) {
    return this.redisService.get(key);
  }

  @Delete('del')
  async del(@Query('key') key: string) {
    return this.redisService.delete(key);
  }

  @Get('exists')
  async exists(@Query('key') key: string) {
    return this.redisService.exists(key);
  }
}
