import { createClient, SetOptions } from "redis";
import config from "../config";

const redisClient = createClient({
  url: config.redis.redisAuthClient,
});

const redisPubClient = createClient({
  url: config.redis.redisAuthClient,
});

const redisSubClient = createClient({
  url: config.redis.redisAuthClient,
});

redisClient.on("error", (error) => console.log("Redis Error", error));
redisClient.on("connect", (error) => console.log("Redis Connected"));

const connect = async (): Promise<void> => {
  await redisClient.connect();
  await redisPubClient.connect();
  await redisSubClient.connect();
};

const set = async (
  key: string,
  value: string,
  options?: SetOptions
): Promise<void> => {
  await redisClient.set(key, value, options);
};

const get = async (key: string): Promise<string | null> => {
  return await redisClient.get(key);
};

const del = async (key: string): Promise<void> => {
  await redisClient.del(key);
};

const setAccessToken = async(userId:string,token:string):Promise<void> => {
    const key = `access-token:${userId}`;
    await redisClient.set(key,token, {EX:Number(config.redis.expires_in)})
}

const getAccessToken = async(userId:string):Promise<string | null> =>{
    const key = `access-token:${userId}`;
    return await redisClient.get(key)
}

const deleteAccessToken = async(userId:string):Promise<void> =>{
    const key = `access-token:${userId}`;
    await redisClient.del(key)
}

const disconnect = async (): Promise<void> => {
  await redisClient.quit();
  await redisPubClient.quit();
  await redisSubClient.quit();
};

const unsubscribe = async(channel:string):Promise<void>=>{
  await redisClient.unsubscribe(channel);
  console.log(`Unsubscribed from channel: ${channel}`);
}
export const RedisClient = {
  connect,
  set,
  get,
  del,
  setAccessToken,
  getAccessToken,
  deleteAccessToken,
  disconnect,
  publish: redisPubClient.publish.bind(redisPubClient),
  subscribe: redisSubClient.subscribe.bind(redisSubClient),
  unsubscribe,
};
