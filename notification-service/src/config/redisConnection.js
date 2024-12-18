import redis from 'redis'

export let publisher
export let subscriber
export let redisClient
export const connectToRedis = async () => {
    try {
        redisClient = redis.createClient({
            url: 'redis://redis:6379'
        });
        
        await redisClient.connect();
        publisher = redisClient.duplicate()
        await publisher.connect()
        subscriber = redisClient.duplicate()
        await subscriber.connect()
        console.log("redis connected")

    } catch (error) {
        console.error('Error connecting to Redis:', error);
    }
};


