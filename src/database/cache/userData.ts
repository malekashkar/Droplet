import { Redis } from "ioredis";
import { DbUser, UserModel } from "../models/user";

export default class {
    redis: Redis;
    key = "userData";

    constructor(redis: Redis) {
        this.redis = redis;
    }

    async set(userId: string, value: DbUser) {
        await this.redis.set(
            this.key + "-" + userId,
            JSON.stringify(value)
        );
    }

    async remove(userId: string) {
        await this.redis.del(this.key + "-" + userId);
    }

    async get(userId: string) {
        const val = await this.redis.get(this.key + "-" + userId);
        if(!val) {
            const user = await UserModel.findOne({ userId });
            if(user) {
                this.redis.set(
                    this.key + "-" + userId,
                    JSON.stringify(user)
                );
                return user;
            }
        } else {
            const parsedData = JSON.parse(val) as DbUser;
            return Object.assign(new DbUser(parsedData.userId), JSON.parse(val)) as DbUser;
        }
    }
}