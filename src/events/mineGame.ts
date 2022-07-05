import { DocumentType } from "@typegoose/typegoose";
import { ClientEvents, Interaction, MessageActionRow, MessageButton, MessageEditOptions } from "discord.js";
import _ from "lodash";
import Event from ".";
import { Mine, MineModel } from "../database/models/mine";
import { UserModel } from "../database/models/user";
import { settings } from "../settings";
import embeds from "../utils/embeds";

export default class MineClickEvent extends Event {
    eventNames: (keyof ClientEvents)[] = ["interactionCreate"];

    async handle(interaction: Interaction) {
        if(!interaction.isButton() || interaction.guildId !== settings.guildID) return;
        
        const message = await interaction.channel.messages.fetch(interaction.message.id).catch(() => {});
        if(!message || !message.editable) return;

        const mineGame = await MineModel.findOne({ userId: interaction.user.id, messageId: interaction.message.id, ended: false });
        if(!mineGame) return;

        if(interaction.customId == "cashout") await message.edit(await this.endProcess(false, mineGame));
        else {
            mineGame.clicked[Number(/[0-9]+/gm.exec(interaction.customId)[0])] = 1;
            await mineGame.save();
            await message.edit(await this.generateMessageInfo(mineGame));
        }
    }

    async generateMessageInfo(mines: DocumentType<Mine>): Promise<MessageEditOptions> {
        if(mines.grid == mines.clicked) this.endProcess(false, mines);

        const components: MessageActionRow[] = [];
        for(let i = 0; i < 4; i++) {
            const actionRow = new MessageActionRow();
            for(let j = 0; j < 4; j++) {
                const location = (i * 4) + j; // 5 MAX buttons per row
                const spot = mines.grid[location];
                const clicked = mines.clicked[location];

                // User Clicked Bomb
                if(spot == 1 && clicked == 1) return await this.endProcess(true, mines);
                else if(clicked == 1 && spot == 0) actionRow.addComponents(
                    new MessageButton()
                        .setCustomId(location.toString())
                        .setLabel("🟩")
                        .setStyle("SUCCESS")
                )
                else actionRow.addComponents(
                    new MessageButton()
                        .setCustomId(location.toString())
                        .setLabel("‎")
                        .setStyle("SECONDARY")
                )
            }
            components.push(actionRow);
        }

        const completeComponent = new MessageActionRow().addComponents(
            new MessageButton()
                .setCustomId("cashout")
                .setLabel("Complete Game!")
                .setStyle("PRIMARY")
        );

        const bombs = mines.grid.filter(x => x == 1).length;
        const netProfit = (Math.floor((this.profitMultiplier(mines) * mines.bet) - mines.bet) * 100) / 100;
        const embedInfo = embeds.normal(
            `Bet Amount: ${mines.bet}\n` +
            `Net Profit: \`${netProfit}\`\n` +
            `Bombs: ${bombs}\n` +
            `Next Multiplier: \`${this.profitMultiplier(mines)}\``,
            "Mine Game"
        );

        return {
            components: (components.concat(completeComponent)),
            embeds: [embedInfo]
        };
    }

    async endProcess(lost = false, mines: DocumentType<Mine>): Promise<MessageEditOptions> {
        const components: MessageActionRow[] = [];
        for(let i = 0; i < 4; i++) {
            const actionRow = new MessageActionRow();
            for(let j = 0; j < 4; j++) {
                const location = (i * 4) + j; // 5 MAX buttons per row
                const spot = mines.grid[location];
                const clicked = mines.clicked[location];

                // User Clicked Bomb
                if(clicked == 1 && spot == 1) actionRow.addComponents(
                    new MessageButton()
                        .setCustomId(location.toString())
                        .setLabel("💣")
                        .setStyle("DANGER")
                )
                else if(clicked == 0 && spot == 1) actionRow.addComponents(
                    new MessageButton()
                        .setCustomId(location.toString())
                        .setLabel("💣")
                        .setStyle("SECONDARY")
                )
                else if(clicked == 1 && spot == 0) actionRow.addComponents(
                    new MessageButton()
                        .setCustomId(location.toString())
                        .setLabel("🟩")
                        .setStyle("SUCCESS")
                )
                else if(clicked == 0 && spot == 0) actionRow.addComponents(
                    new MessageButton()
                        .setCustomId(location.toString())
                        .setLabel("🟩")
                        .setStyle("SECONDARY")
                )
            }
            components.push(actionRow);
        }

        mines.ended = true;
        await mines.save();

        if(lost) {
            return {
                components,
                embeds: [embeds.normal(`You lost a total of **${mines.bet}** from this game!`, "Game Lost")]
            }
        } else {
            const totalWon = (Math.floor(this.profitMultiplier(mines) * mines.bet) * 100) / 100;
            const netWon = totalWon - mines.bet;

            const userData = await UserModel.findOne({ userId: mines.userId });
            if(userData) {
                userData.balance += totalWon;
                await userData.save();
            }
            
            return {
                components,
                embeds: [embeds.normal(
                    `You won a total of **${totalWon}** from this game!\nYour net winnings total out to **${netWon}**!`,
                    "Game Won!"
                )]
            }
        }
    }

    profitMultiplier(mines: Mine) {
        const spacesClicked = mines.clicked.filter(x => x == 1).length;
        const bombs = mines.grid.filter(x => x == 1).length;

        let totalMultiplier = 0;
        for(let i = 0; i < spacesClicked; i++) 
            totalMultiplier += (bombs / (16 - spacesClicked));

        return (Math.round(totalMultiplier * 100) / 100) + 1;
    }
}