import express, { Request, Response } from "express";
import { config as dotenv } from "dotenv";
import bodyParser from "body-parser";
import Logger from "./utils/logger";
import { DepositModel } from "./database/models/deposit";
import App from ".";
import embeds from "./utils/embeds";
import { UserModel } from "./database/models/user";
import { btcToUsd } from "./utils/bitcoin";

dotenv();

export default async function (discordApp: App) {
  const app = express();
  const PORT = process.env.PORT || 3000;

  app.use(bodyParser.json());
  app.listen(PORT, () => {
    Logger.info("API", `🚀 The API has launhched on port ${PORT}.`);
  });
  app.post(
    "/payments/completed",
    async (req, res) => await verifyPayment(req, res, discordApp)
  );
}

async function verifyPayment(req: Request, res: Response, app: App) {
  const body = req.body;
  if (body.type === "wallet:addresses:new-payment") {
    const depositData = await DepositModel.findOne({
      address: body.data.address,
    });
    if (depositData && depositData.status !== "COMPLETED") {
      const btcAmount = Number(
        Number(body.additional_data.amount.amount).toFixed(8)
      );
      const amount = await btcToUsd(btcAmount);

      const user = await app.discordBot.users.fetch(depositData.userId);
      const userData =
        (await UserModel.findOne({
          userId: depositData.userId,
        })) ||
        (await UserModel.create({
          userId: depositData.userId,
        }));

      if (btcAmount >= depositData.amount) {
        if (user) {
          user
            .send({
                embeds: [
                    embeds.normal(
                        `Deposit Complete`,
                        `Your deposit for **${amount} USD** or **${btcAmount} BTC** has been sent through and added to your balance.`
                    )
                ]
            })
            .catch(() => {});
        }
      } else {
        if (user) {
          user
            .send({
                embeds: [
                    embeds.normal(
                        `Deposit Error`,
                        `We received a payment of **${btcAmount} BTC** doesn't meet your deposit requirement of **${depositData.amount} USD**. However, we will add the **${btcAmount} BTC** to your balance.`
                    )
                ]
            })
            .catch(() => {});
        }
      }

      userData.balance += btcAmount;
      await userData.save();

      depositData.status = "COMPLETED";
      await depositData.save();
    }
  }
  return res.status(200).json({
    success: true,
  });
}
