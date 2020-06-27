module.exports = async(client, reaction, user) => {
    const { MessageEmbed } = require("discord.js");
    let message = reaction.message;

    if(message.partial) message.fetch();
    if(message.channel.id !== client.config.ticket_channel || reaction.emoji.name !== "💧" || user.bot) return;

    reaction.users.remove(user);
    client.add('opened');

    let channel = await message.guild.channels.create(user.username);
    channel.setTopic(user.id);
    channel.setParent(client.config.ticket_parent);
    channel.createOverwrite(message.guild.id, { VIEW_CHANNEL: false });
    channel.createOverwrite(user.id, { VIEW_CHANNEL: true, SEND_MESSAGES: true });
    
    let questionEmbed = new MessageEmbed()
    .setColor(client.config.color)
    .setFooter("You have 16 minutes to reply to this question.")
    .setTimestamp();
    
    let tooLate = new MessageEmbed()
    .setColor("RED")
    .setTitle(`You did not answer the question for 16 minutes.`)
    .setFooter(`In result, your ticket has been closed.`)
    .setTimestamp();

    questionEmbed.setTitle(`What is your MCM profile link? Send the link only!`);
    let linEmbed = await channel.send(questionEmbed);
    
    channel.awaitMessages(m => m.author.id === user.id && m.content.includes("https://"), { max: 1, time: 960000, errors: ["time"] })
    .then(async lin => { linEmbed.delete(); lin.delete();
        questionEmbed.setTitle(`Please provide me with a detailed description of what you need complete.`);
        let desEmbed = await channel.send(questionEmbed);
        
        channel.awaitMessages(m => m.author.id === user.id, { max: 1, time: 960000, errors: ["time"] })
        .then(async des => { desEmbed.delete(); des.delete();
            questionEmbed.setTitle(`What is your estimated budget? Please provide a number only.`);
            let budEmbed = await channel.send(questionEmbed);
            
            channel.awaitMessages(m => m.author.id === user.id && m.content.match(/[0-9]/gm), { max: 1, time: 960000, errors: ["time"] })
            .then(async bud => { budEmbed.delete(); bud.delete();
                questionEmbed.setTitle(`What is your estimated timeframe? Please provide a number in days.`);
                let timEmbed = await channel.send(questionEmbed);
                
                channel.awaitMessages(m => m.author.id === user.id, { max: 1, time: 960000, errors: ["time"] })
                .then(async tim => { timEmbed.delete(); tim.delete();

                    let comEmbed = new MessageEmbed()
                    .setTitle(`Order Details`)
                    .setDescription(`Description: ` + des.content)
                    .addField(`Budget`, `$${bud.content.match(/[0-9]/gm).join("")}`, true)
                    .addField(`Timeframe`, tim.content, true)
                    .addField(`MCM Profile`, lin.content, true)
                    .setColor(client.config.color)
                    .setFooter(client.user.username + ` Tickets`)
                    .setTimestamp()
                    channel.send(comEmbed);
                })
                .catch(() => {
                    user.send(tooLate);
                    channel.delete();
                });
            })
            .catch(() => {
                user.send(tooLate);
                channel.delete();
            });
        })
        .catch(() => {
            user.send(tooLate);
            channel.delete();
        });
    })
    .catch(() => {
        user.send(tooLate);
        channel.delete();
    });
}