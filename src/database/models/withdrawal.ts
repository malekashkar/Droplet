import { getModelForClass, prop } from "@typegoose/typegoose";

export class Withdrawal {
  @prop()
  userId: string;

  @prop()
  address: string;

  @prop()
  amount: number;

  @prop()
  createdAt: Date;

  constructor(
    userId: string,
    address: string,
    amount: number,
    createdAt: Date
  ) {
    this.userId = userId;
    this.address = address;
    this.amount = amount;
    this.createdAt = createdAt;
  }
}

export const WithdrawalModel = getModelForClass(Withdrawal);
