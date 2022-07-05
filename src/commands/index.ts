import { SlashCommandBuilder, SlashCommandSubcommandsOnlyBuilder } from "@discordjs/builders";
import { DocumentType } from "@typegoose/typegoose";
import { CommandInteraction } from "discord.js";
import App from "..";
import { DbGuild } from "../database/models/guild";
import { DbUser } from "../database/models/user";

export abstract class Command {
    app: App;
    abstract slashCommand: SlashCommandBuilder | SlashCommandSubcommandsOnlyBuilder | Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">;

    constructor(app: App) {
        this.app = app;
    }
      
    async canRun(
        _interaction: CommandInteraction,
        _userData: DocumentType<DbUser>,
        _guildData: DocumentType<DbGuild>,
    ) {
        return true;
    }

    abstract execute(
        _interaction: CommandInteraction,
        _userData: DocumentType<DbUser>,
        _guildData: DocumentType<DbGuild>,
    ): Promise<void | Error>;
}