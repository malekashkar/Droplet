import { getModelForClass, index, post, pre, prop } from "@typegoose/typegoose";
import { RedisInstance } from "../redis";

@index({ id: 1 }, { unique: true })
@pre<DbUser>(["save"], function() {
  RedisInstance.userData.set(this.id, this);
})
@post<DbUser>(["updateOne"], function (iUser) {
  if(iUser instanceof DbUser) RedisInstance.userData.set(iUser.id, iUser);
  if(iUser instanceof Array) {
    for(const user of iUser) {
      RedisInstance.userData.set(user.id, user);
    }
  }
})
@post<DbUser>(["deleteOne"], function (iUser) {
  if(iUser instanceof DbUser) RedisInstance.userData.remove(iUser.id);
  if(iUser instanceof Array) {
    for(const user of iUser) {
      RedisInstance.userData.remove(user.id);
    }
  }
})
export class DbUser {
  @prop({ unique: true })
  userId: string;

  @prop()
  country: string;

  @prop({ default: 0 })
  balance: number;

  @prop({ default: false })
  private: boolean;

  constructor(userId: string, country?: string) {
    this.userId = userId;
    this.country = country;
  }
}

export const UserModel = getModelForClass(DbUser);
