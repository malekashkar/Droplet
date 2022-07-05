import { getModelForClass, prop } from "@typegoose/typegoose";

export class Mine {
  @prop()
  userId: string;

  @prop({ unique: true })
  messageId: string;

  @prop()
  channelId: string;

  @prop()
  bet: number;

  @prop({ type: [Number] })
  grid: number[]

  @prop({ type: [Number] })
  clicked: number[];

  @prop({ default: false })
  ended: boolean;

  constructor(
    userId: string,
    messageId: string,
    channelId: string,
    bet: number,
    grid: number[],
    clicked: number[]
  ) {
    this.userId = userId;
    this.messageId = messageId;
    this.channelId = channelId;
    this.bet = bet;
    this.grid = grid;
    this.clicked = clicked;
  }
}

export const MineModel = getModelForClass(Mine);
