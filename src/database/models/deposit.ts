import { getModelForClass, prop } from "@typegoose/typegoose";

export class Deposit {
  @prop()
  userId: string;

  @prop()
  address: string;

  @prop()
  amount: number;

  @prop()
  status: "PENDING" | "COMPLETED";

  @prop()
  createdAt: Date;

  @prop()
  confirmations?: number;

  constructor(
    userId: string,
    address: string,
    amount: number,
    status: "PENDING" | "COMPLETED",
    createdAt: Date
  ) {
    this.userId = userId;
    this.address = address;
    this.amount = amount;
    this.status = status;
    this.createdAt = createdAt;
  }
}

export const DepositModel = getModelForClass(Deposit);
