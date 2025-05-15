import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { createClient, RedisClientType } from 'redis';
import Redlock from 'redlock';

@Injectable()
// @Injectable({ scope: Scope.REQUEST })
export class RedisService {
  // private client: RedisClientType;
  // private redlock: Redlock;
  // // async onModuleInit() {
  // //   this.client = createClient({
  // //     url: process.env.REDIS_URI || 'redis://localhost:6379',
  // //   });

  // //   await this.client.connect();

  // //   this.redlock = new Redlock([this.client], {
  // //     retryCount: 3,
  // //     retryDelay: 200,
  // //   });
  // // }

  // async onModuleDestroy() {
  //   await this.client.quit();
  // }

  // // ===== BASIC =====
  // async set(key: string, value: string, ttl?: number) {
  //   await this.client.set(key, value);
  //   if (ttl) await this.client.expire(key, ttl);
  // }

  // async get(key: string): Promise<string | null> {
  //   return this.client.get(key);
  // }

  // async delete(key: string) {
  //   await this.client.del(key);
  // }

  // async exists(key: string): Promise<boolean> {
  //   const result = await this.client.exists(key);
  //   return result > 0;
  // }

  // // ===== LIST =====
  // async lpush(key: string, values: string[], ttl?: number) {
  //   await this.client.lPush(key, values);
  //   if (ttl) await this.client.expire(key, ttl);
  // }

  // async rpop(key: string): Promise<string | null> {
  //   return this.client.rPop(key);
  // }

  // async lrange(key: string, start: number, stop: number): Promise<string[]> {
  //   return this.client.lRange(key, start, stop);
  // }

  // // ===== SET =====
  // async sadd(key: string, members: string[], ttl?: number) {
  //   await this.client.sAdd(key, members);
  //   if (ttl) await this.client.expire(key, ttl);
  // }

  // async smembers(key: string): Promise<string[]> {
  //   return this.client.sMembers(key);
  // }

  // // ===== SORTED SET =====
  // async zadd(
  //   key: string,
  //   members: { score: number; value: string }[],
  //   ttl?: number,
  // ) {
  //   await this.client.zAdd(
  //     key,
  //     members.map((m) => ({ score: m.score, value: m.value })),
  //   );
  //   if (ttl) await this.client.expire(key, ttl);
  // }

  // async zrangeByScore(
  //   key: string,
  //   min: number,
  //   max: number,
  // ): Promise<string[]> {
  //   return this.client.zRangeByScore(key, min, max);
  // }

  // // ===== HASH =====
  // async hset(key: string, data: Record<string, string>, ttl?: number) {
  //   await this.client.hSet(key, data);
  //   if (ttl) await this.client.expire(key, ttl);
  // }

  // async hgetAll(key: string): Promise<{
  //   [x: string]: {
  //     toString: {};
  //   };
  // }> {
  //   return this.client.hGetAll(key);
  // }

  // // ===== GEO =====
  // async geoAdd(
  //   key: string,
  //   points: { longitude: number; latitude: number; member: string }[],
  //   ttl?: number,
  // ) {
  //   await this.client.geoAdd(key, points);
  //   if (ttl) await this.client.expire(key, ttl);
  // }

  // async geoPos(key: string, members: string[]) {
  //   return this.client.geoPos(key, members);
  // }

  // // ===== LOCKING with Redlock =====
  // async lock(key: string, ttlMs = 5000): Promise<() => Promise<void>> {
  //   const lock = await this.redlock.acquire([`lock:${key}`], ttlMs);

  //   // Trả về hàm unlock để sử dụng bên ngoài
  //   return async () => {
  //     try {
  //       await lock.release();
  //     } catch (err) {
  //       // Nếu lock đã hết hạn hoặc bị mất, không cần throw
  //       console.warn(`Failed to release lock ${key}:`, err.message);
  //     }
  //   };
  // }
}
