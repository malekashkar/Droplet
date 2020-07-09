const { MessageEmbed } = require("discord.js");
const { strip_indents, capitalize } = require("../utils/")
const config = require("../config.json");

function question(text) {
    return new MessageEmbed()
    .setTitle(`Answer the question below`)
    .setFooter(`You have exactly 15 minutes to answer the question.`)
    .setColor(config.color)
    .setDescription(text)
}

function create_order(client) {
    return new MessageEmbed()
    .setTitle(`Create an Order`)
    .setDescription(`If you would like to open a __development__ order click the 💧 below.
    If you would like to open an __exchange__ order click the <:btc:730677211064959001> below.`)
    .setThumbnail(client.user.displayAvatarURL())
    .setColor(config.color)
    .setFooter(client.user.username + " Tickets")
    .setTimestamp()
}

function time_over() {
    return new MessageEmbed()
    .setColor("RED")
    .setTitle(`You did not answer the question for 15 minutes.`)
    .setFooter(`In result, your ticket has been closed.`)
    .setTimestamp();
}

function price(amount, type) {
    return new MessageEmbed()
    .setTitle(`Current **${type}** Price is **$${amount}**.`)
    .setColor(config.color)
}

function error(text) {
    return new MessageEmbed()
    .setTitle(`Review the error below`)
    .setDescription(text)
    .setColor("RED")
}

function complete(text, footer) {
    let embed = new MessageEmbed()
    .setTitle(`Operation Complete`)
    .setDescription(text)
    .setColor(config.color)
    if(footer) embed.setFooter(footer);

    return embed;
}

function help(desc) {
    return new MessageEmbed()
    .setTitle(`Help Menu`)
    .setDescription(desc)
    .setColor(client.config.color)
}

module.exports = { question, create_order, time_over, price, error, complete, help };