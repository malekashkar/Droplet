import { DocumentType } from "@typegoose/typegoose";
import { ClientEvents, CommandInteraction, Interaction, Message, MessageActionRow, MessageSelectMenu, SelectMenuInteraction } from "discord.js";
import Event from ".";
import { DbGuild, GuildModel } from "../database/models/guild";
import { DbUser, UserModel } from "../database/models/user";
import { settings } from "../settings";
import embeds from "../utils/embeds";
import Logger from "../utils/logger";

export default class InteractionHandler extends Event {
    eventNames: (keyof ClientEvents)[] = ["interactionCreate"];
    
    async handle(interaction: Interaction) {
        if(interaction.isCommand()) {
            if(!interaction.guild) return interaction.reply({ embeds: [embeds.error("Please run commands in discord servers only!")] })

            await interaction.deferReply({ ephemeral: true });

            const guildData = await GuildModel.findOne({ guildId: interaction.guild.id }) || await GuildModel.create(new DbGuild(interaction.guild.id));
            const userData = await UserModel.findOne({ id: interaction.user.id }) || await UserModel.create(new DbUser(interaction.user.id));
            if(!userData.country) return this.countryConfirmation(interaction, userData);
            
            const command = this.app.commands.find(x => x.slashCommand.name == interaction.commandName);
            if(await command.canRun(interaction, userData, guildData)) {
                await command.execute(interaction, userData, guildData).catch((e) => Logger.error("COMMAND_HANDLER", e));
            } else {
                await interaction.editReply({
                    embeds: [
                        embeds.error(`You do not have permission to run this command at the moment.`)
                    ]
                });
            }
        } else if(interaction.isSelectMenu() || interaction.isButton()) {
            await interaction.deferUpdate();
        }
    }

    async countryConfirmation(interaction: CommandInteraction, userData: DocumentType<DbUser>) {
        let message = await interaction.editReply({
            embeds: [embeds.normal(settings.countrySelectorText, `Country Selector`)],
            components: [
                new MessageActionRow().addComponents(
                    new MessageSelectMenu()
                        .setCustomId("country-selector")
                        .setPlaceholder("Select your country below")
                        .addOptions(settings.countries.map(x => {
                            return { label: x.name, value: x.shortened }
                        }))
                )
            ]
        }) as Message;

        let collector = await message.awaitMessageComponent({
            filter: (i) => i.user.id == interaction.user.id && i.isSelectMenu(),
            time: 60 * 1000,
        });
        if(!(collector instanceof SelectMenuInteraction)) return;

        const countryCodeSelected = collector.values[0];
        const countryData = settings.countries.find(x => x.shortened == countryCodeSelected);
        if(!countryData) return Logger.error("COUNTRY_CONFIRM", `${countryCodeSelected} was not found as a country!`);
        
        let country: string;
        if(countryData.children.length) {
            message = await interaction.editReply({
                embeds: [embeds.normal(settings.countrySelectorText, `State Selector`)],
                components: [
                    new MessageActionRow().addComponents(
                        new MessageSelectMenu()
                            .setCustomId("state-selector")
                            .setPlaceholder("Select your state below")
                            .addOptions(countryData.children.map(x => {
                                return { label: x, value: x }
                            })
                        )
                    )
                ]
            }) as Message;
    
            collector = await message.awaitMessageComponent({
                filter: (i) => i.user.id == interaction.user.id && i.isSelectMenu(),
                time: 60 * 1000,
            });
            if(!(collector instanceof SelectMenuInteraction)) return;

            country = collector.values[0];
        } else country = countryData.name;
        

        userData.country = country;
        await userData.save();

        await interaction.editReply({
            embeds: [embeds.normal(`Your country/state has successfully been set to **${country}**.`)],
            components: []
        });
    }
}