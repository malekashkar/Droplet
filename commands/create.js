exports.run = async(client, message, args) => {
    const { MessageEmbed } = require("discord.js");
    let channel = message.guild.channels.cache.get(client.config.ticket_channel);

    let embed = new MessageEmbed()
    .setTitle(`Create an Order`)
    .setDescription(`Please click the **droplet** below when you are ready to create your order.\n\n__Please make sure you have the following information ready__:\n- *Your order description.*\n- *Your estimated budget.*\n- *Your estimated timeframe.*\n- *Your MCM profile link.*`)
    .setThumbnail(client.user.displayAvatarURL())
    .setColor(client.config.color)
    .setFooter(client.user.username + " Tickets")
    .setTimestamp()
    channel.send(embed).then(msg => msg.react("💧"))
}