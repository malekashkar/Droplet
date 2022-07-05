import { Redis } from "ioredis";
import { Mine, MineModel } from "../models/mine";

export default class {
    redis: Redis;
    key = "mine-games";

    constructor(redis: Redis) {
        this.redis = redis;
    }

    async set(messageId: string, value: Mine) {
        await this.redis.set(
            this.key + "-" + messageId,
            JSON.stringify(value)
        );
    }

    async remove(messageId: string) {
        await this.redis.del(this.key + "-" + messageId);
    }

    async get(messageId: string) {
        const val = await this.redis.get(this.key + "-" + messageId);
        if(!val) {
            const guild = await MineModel.findOne({ messageId });
            if(guild) {
                this.redis.set(
                    this.key + "-" + messageId,
                    JSON.stringify(guild)
                );
                return guild;
            }
        } else {
            return JSON.parse(val) as Mine;
        }
    }
}