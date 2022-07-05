import { Redis } from "ioredis";
import { DbGuild, GuildModel } from "../models/guild";

export default class {
    redis: Redis;
    key = "guildData";

    constructor(redis: Redis) {
        this.redis = redis;
    }

    async set(guildId: string, value: DbGuild) {
        await this.redis.set(
            this.key + "-" + guildId,
            JSON.stringify(value)
        );
    }

    async remove(guildId: string) {
        await this.redis.del(this.key + "-" + guildId);
    }

    async get(guildId: string) {
        const val = await this.redis.get(this.key + "-" + guildId);
        if(!val) {
            const guild = await GuildModel.findOne({ guildId });
            if(guild) {
                this.redis.set(
                    this.key + "-" + guildId,
                    JSON.stringify(guild)
                );
                return guild;
            }
        } else {
            return JSON.parse(val) as DbGuild;
        }
    }
}