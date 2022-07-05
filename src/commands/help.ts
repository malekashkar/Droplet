import { SlashCommandBuilder } from "@discordjs/builders";
import { DocumentType } from "@typegoose/typegoose";
import { CacheType, CommandInteraction } from "discord.js";
import { Command } from ".";
import { DbGuild } from "../database/models/guild";
import { DbUser } from "../database/models/user";
import embeds from "../utils/embeds";

export default class HelpCommand extends Command {
    slashCommand = new SlashCommandBuilder()
        .setName("help")
        .setDescription("Get a list of all the commands and their descriptions.")

    async canRun(_interaction: CommandInteraction<CacheType>, _userData: DocumentType<DbUser>, _guildData: DocumentType<DbGuild>) {
        return true;
    }

    async execute(interaction: CommandInteraction<CacheType>) {
        const commands = Array.from(this.app.commands.mapValues(x => `\`/${x.slashCommand.name}\` ~ ${x.slashCommand.description}`).values()).join("\n");
        interaction.editReply({ embeds: [embeds.normal(commands, `Help Menu`)] });
    }
}