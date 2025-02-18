import Redis from 'redis';
import { logger } from '../utils/logger';
import dotenv from 'dotenv';
import { RedisMemoryServer } from 'redis-memory-server';

dotenv.config();

const redisServer = new RedisMemoryServer();
const redisClient = Redis.createClient();

redisClient.on('error', (err) => {
  logger.error('Redis Client Error:', err);
});

redisClient.on('connect', () => {
  logger.info('Connected to Redis successfully');
});

export const connectToRedis = async () => {
  try {
    await redisClient.connect();
  } catch (error) {
    logger.error('Failed to connect to Redis:', error);
    process.exit(1);
  }
};

export default redisClient;