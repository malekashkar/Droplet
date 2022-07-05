import { getModelForClass, prop } from "@typegoose/typegoose";

export class DbCheck {
    @prop()
    channelId: string;

    @prop()
    transactionId: string;

    constructor(channelId: string, transactionId: string) {
      this.channelId = channelId;
      this.transactionId = transactionId;
    }
}

export const CheckModel = getModelForClass(DbCheck);