import redis from 'redis'

export let redisClient
export const connectToRedis = async () => {
  try {
     redisClient = redis.createClient({
        url: 'redis://redis:6379'
        });
     await redisClient.connect();
    console.log("redis connected")
  } catch (error) {
    console.error('Error connecting to Redis:', error);
  }
};
