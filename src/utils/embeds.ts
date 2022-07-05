import { MessageEmbed } from "discord.js";
import { settings } from "../settings";
import ms from "ms";

function normal(description: string, title?: string) {
    const embed = new MessageEmbed()
        .setFooter({ text: `Droplet Betting.` })
        .setColor(settings.color)
        .setDescription(description)
    if(title) embed.setTitle(title);
    return embed;
}

function question(text: string, time: number) {
    return new MessageEmbed()
        .setTitle(`Answer the question below`)
        .setFooter({
            text: `You have exactly ${ms(time)} minutes to answer the question.`
        })
        .setColor(settings.color)
        .setDescription(text)
}

function create_order() {
    return new MessageEmbed()
        .setTitle(`Create an Order`)
        .setDescription(`If you would like to open a __development__ order click the 💧 below.
        If you would like to open an __exchange__ order click the <:btc:730677211064959001> below.`)
        .setColor(settings.color)
        .setTimestamp()
}

function time_over() {
    return new MessageEmbed()
        .setColor("RED")
        .setTitle(`You did not answer the question for 15 minutes.`)
        .setFooter({
            text: `In result, your ticket has been closed.`
        })
        .setTimestamp();
}

function price(amount: number, type: string) {
    return new MessageEmbed()
        .setTitle(`Current **${type}** Price is **$${amount}**.`)
        .setColor(settings.color)
}

function error(text: string) {
    return new MessageEmbed()
        .setTitle(`Review the error below`)
        .setDescription(text)
        .setColor("RED")
}

function complete(text: string, footer: string) {
    let embed = new MessageEmbed()
        .setTitle(`Operation Complete`)
        .setDescription(text)
        .setColor(settings.color)
    if(footer) embed.setFooter({ text: footer });

    return embed;
}

function help(desc: string) {
    return new MessageEmbed()
        .setTitle(`Help Menu`)
        .setDescription(desc)
        .setColor(settings.color)
}

export default { normal, error, time_over, create_order, question, price, help, complete };