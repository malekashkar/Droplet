import { getModelForClass, post, pre, prop } from "@typegoose/typegoose";
import { RedisInstance } from "../redis";

@pre<DbGuild>("save", function () {
    RedisInstance.guildData.set(this.guildId, this);
})
@post<DbGuild>(["updateOne"], function (iGuild) {
    if(iGuild instanceof DbGuild) RedisInstance.guildData.set(iGuild.id, iGuild);
    if(iGuild instanceof Array) {
      for(const guild of iGuild) {
        RedisInstance.guildData.set(guild.id, guild);
      }
    }
})
@post<DbGuild>(["deleteOne"], function (iGuild) {
  if(iGuild instanceof DbGuild) RedisInstance.guildData.remove(iGuild.id);
  if(iGuild instanceof Array) {
    for(const guild of iGuild) {
      RedisInstance.guildData.remove(guild.id);
    }
  }
})
export class DbGuild {
    @prop()
    guildId: string;
    
    @prop({ default: false })
    main: boolean;

    constructor(guildId: string, main = false) {
        this.guildId = guildId;
        this.main = main;
    }
}

export const GuildModel = getModelForClass(DbGuild);