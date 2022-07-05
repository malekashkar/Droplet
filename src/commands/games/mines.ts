import { SlashCommandBuilder } from "@discordjs/builders";
import { DocumentType } from "@typegoose/typegoose";
import { CommandInteraction, MessageActionRow, MessageButton } from "discord.js";
import _ from "lodash";
import { Command } from "..";
import { Mine, MineModel } from "../../database/models/mine";
import { DbUser } from "../../database/models/user";
import { settings } from "../../settings";
import embeds from "../../utils/embeds";

export default class MinesCommand extends Command {
    slashCommand = new SlashCommandBuilder()
        .setName("mines")
        .setDescription("Play the game of mines.")
        .addNumberOption(opt =>
            opt.setName("mines").setDescription("The amount of mines to place in the grid.").setRequired(true))
        .addNumberOption(opt => 
            opt.setName("bet").setDescription("The amount you would like to bet.").setRequired(true))
        
    async execute(interaction: CommandInteraction, userData: DocumentType<DbUser>) {
        const minesGame = await MineModel.findOne({ userId: interaction.user.id, ended: false });
        if(minesGame) {
            const messageURL = `https://discord.com/channels/${settings.guildID}/${minesGame.channelId}/${minesGame.messageId}`;
            interaction.editReply({
                embeds: [embeds.error(`Please complete [this game](${messageURL}) before starting another!`)]
            })
            return;
        }

        const betAmount = interaction.options.getNumber("bet");
        if(userData.balance < betAmount) {
            interaction.editReply({
                embeds: [embeds.error(`You do not have enough currency to make a **${betAmount}** bet!`)]
            });
            return;
        }

        const bombAmount = interaction.options.getNumber("mines");
        if(bombAmount > 15) {
            interaction.editReply({
                embeds: [embeds.error("You cannot have more than 15 mines in a single grid!")]
            });
            return;
        }

        const grid = this.createGrid(bombAmount);
        const components = this.generateComponents(grid);

        const minesMessage = await interaction.channel.send({
            embeds: [embeds.normal("Click the buttons below you believe no mines are under!\nThe more you click, the more you win!", "Mines Game")],
            components: components
        });

        userData.balance -= betAmount;
        await userData.save();

        await MineModel.create(
            new Mine(
                interaction.user.id,
                minesMessage.id,
                interaction.channel.id,
                betAmount,
                grid,
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            )
        );
    }

    createGrid(bombAmount: number, grid?: number[]): number[] {
        if(!grid) grid = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        for(let i = 0; i < bombAmount; i++) {
            if(grid.filter(x => x == 1).length == bombAmount) return grid;

            let randomElement = Math.floor(Math.random() * grid.length);
            if(grid[randomElement] == 0) grid[randomElement] = 1;
            else if(grid[randomElement] == 1) return this.createGrid(bombAmount, grid);
        }
        if(grid.filter(x => x == 1).length !== bombAmount) return this.createGrid(bombAmount, grid);
        return grid;
    }

    generateComponents(grid: number[]): MessageActionRow[] {
        const components: MessageActionRow[] = [];
        
        const rows = _.chunk(grid, 4); // 5 MAX buttons per row
        for(let i = 0; i < rows.length; i++) {
            const actionRow = new MessageActionRow();
            for(let j = 0; j < rows[i].length; j++) {
                const location = (i * 4) + j; // 5 MAX buttons per row
                actionRow.addComponents(
                    new MessageButton()
                        .setCustomId(location.toString())
                        .setLabel("‎") // ‎
                        .setStyle("SECONDARY")
                )
            }
            components.push(actionRow);
        }

        return components;
    }
}