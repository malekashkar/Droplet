exports.run = async(client, message, args) => {
    if(message.channel.parentID !== client.config.ticket_parent) return;
    
    const { MessageEmbed } = require("discord.js");

    client.add('complete');
    client.remove('opened');

    message.channel.permissionOverwrites.forEach(p => { if(p.id !== message.guild.id) p.delete() });
    message.channel.setParent(client.config.complete_parent);
    message.channel.guild.members.cache.get(message.channel.topic).roles.add("705181912540381234");

    let complete = new MessageEmbed()
    .setTitle(`Ticket Complete`)
    .setColor(client.config.color)
    .setDescription(`This job has been completed and moved to the completed category.`)
    .setFooter(`All permissions have been set automatically.`)
    message.channel.send(complete);
}

