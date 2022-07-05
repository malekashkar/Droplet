import IORedis, { Redis } from "ioredis";
import Logger from "../utils/logger";
import guildData from "./cache/guildData";
import mineGames from "./cache/mineGames";

import userData from "./cache/userData";

class Cache {
    public static redisInstance: Redis;

    public static userData: userData;
    public static guildData: guildData;
    public static mineGames: mineGames;

    private constructor() {}

    public static getInstance() {
        if (!Cache.redisInstance) {
            Logger.info("REDIS", "Connecting to the redis server...");

            this.redisInstance = new IORedis({
                host: process.env.REDIS_HOST,
                port: parseInt(process.env.REDIS_PORT),
                password: process.env.REDIS_PASSWORD
            });
            this.redisInstance.on("error", (err) => Logger.error("REDIS", err));

            this.userData = new userData(this.redisInstance);
            this.guildData = new guildData(this.redisInstance);
            this.mineGames = new mineGames(this.redisInstance);
        }

        return this;
    }
}

export const RedisInstance = Cache.getInstance();