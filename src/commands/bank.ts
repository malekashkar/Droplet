import { SlashCommandBuilder } from "@discordjs/builders";
import { DocumentType } from "@typegoose/typegoose";
import { CommandInteraction, Message, MessageActionRow, MessageButton, SelectMenuInteraction } from "discord.js";
import { Command } from ".";
import { DbUser } from "../database/models/user";
import embeds from "../utils/embeds";

export default class BankCommand extends Command {
    slashCommand = new SlashCommandBuilder()
        .setName("bank")
        .setDescription("Deal with your ingame funds through the bank.")

    async execute(interaction: CommandInteraction, userData: DocumentType<DbUser>) {
        const menu = await interaction.editReply({
            embeds: [embeds.normal(`Use this menu to deal with your in-game currencies and balance.`)],
            components: [
                new MessageActionRow().addComponents(
                    new MessageButton()
                        .setCustomId("deposit")
                        .setLabel("Deposit")
                        .setStyle("SUCCESS"),
                    new MessageButton()
                        .setCustomId("withdraw")
                        .setLabel("Withdraw")
                        .setStyle("DANGER"),
                    new MessageButton()
                        .setCustomId("balance")
                        .setLabel("Balance")
                        .setStyle("SECONDARY")
                )
            ]
        }) as Message;

        const collector = menu.createMessageComponentCollector({
            filter: (i) => i.user.id == interaction.user.id,
            time: 60000,
            max: 1
        });

        collector.on("collect", async(data) => {
            if(data.customId == "deposit") {
                this.depositPhase(interaction);
            } else if(data.customId == "withdraw") {
                this.withdrawPhase(interaction);
            } else if(data.customId == "balance") {
                await interaction.editReply({
                    embeds: [embeds.normal(`You currently have a balance of ${userData}`)]
                });
            }
        });
    }

    async depositPhase(interaction: CommandInteraction) {
        await interaction.editReply({
            embeds: [embeds.question("How much credits would you like to deposit into your account.", 60 * 1000)]
        });

        const stringCollector = await interaction.channel.awaitMessages({
            filter: (m) => m.author.id == interaction.user.id,
            max: 1,
            time: 60 * 1000
        });
        if(!stringCollector.first()) return;


        const message = await interaction.editReply({
            embeds: [embeds.normal("Please select which payment method you would like to use!", `Payment Options`)],
            components: [
                new MessageActionRow().addComponents(
                    new MessageButton()
                        .setCustomId("cashapp")
                        .setLabel("CashApp")
                        .setStyle("SUCCESS"),
                    new MessageButton()
                        .setCustomId("paypal")
                        .setLabel("PayPal")
                        .setStyle("PRIMARY"),
                    new MessageButton()
                        .setCustomId("crypto")
                        .setLabel("Crypto")
                        .setStyle("DANGER")
                )
            ]
        }) as Message;

        const collector = await message.awaitMessageComponent({
            filter: (i) => i.user.id == interaction.user.id && i.isSelectMenu(),
            time: 60000,
        });
        if(!(collector instanceof SelectMenuInteraction)) return;

        if(collector.values[0] == "cashapp") {
            // start cashapp process
        } else if(collector.values[0] == "paypal") {
            // start paypal process
        } else if(collector.values[0] == "crypto") {
            // start crypto process
        }
    }

    async withdrawPhase(interaction: CommandInteraction) {
        
    }
}