module.exports = async (client, reaction, user) => {
  const { MessageEmbed } = require("discord.js");
  const { question, time_over } = require("../utils/embeds");
  const { capitalize } = require("../utils/")
  let message = reaction.message;

  if (message.partial) message.fetch();
  if (user.bot) return;

  if (reaction.emoji.name === "💧") {
    reaction.users.remove(user);

    let channel = await message.guild.channels.create(
      user.username + "-javascript"
    );
    channel.setTopic(user.id);
    channel.setParent(client.config.ticketParent);
    channel.createOverwrite(message.guild.id, { VIEW_CHANNEL: false });
    channel.createOverwrite(user.id, {
      VIEW_CHANNEL: true,
      SEND_MESSAGES: true,
    });

    let linEmbed = await channel.send(
      question(`What is your MCM/OGU profile link?`)
    );

    channel
      .awaitMessages((m) => m.author.id === user.id, {
        max: 1,
        time: 960000,
        errors: ["time"],
      })
      .then(async (lin) => {
        linEmbed.delete();
        lin.first().delete();
        let priEmbed = await channel.send(
          question(
            `Please provide me with a detailed description of what you need complete.`
          )
        );

        channel
          .awaitMessages((m) => m.author.id === user.id, {
            max: 1,
            time: 960000,
            errors: ["time"],
          })
          .then(async (des) => {
            priEmbed.delete();
            des.first().delete();
            let optEmbed = await channel.send(
              question(
                `What is your estimated budget? Please provide a number only.`
              )
            );

            channel
              .awaitMessages(
                (m) => m.author.id === user.id && m.content.match(/[0-9]/gm),
                { max: 1, time: 960000, errors: ["time"] }
              )
              .then(async (bud) => {
                optEmbed.delete();
                bud.first().delete();
                let timEmbed = await channel.send(
                  question(
                    `What is your estimated timeframe? Please provide a number in days.`
                  )
                );

                channel
                  .awaitMessages((m) => m.author.id === user.id, {
                    max: 1,
                    time: 960000,
                    errors: ["time"],
                  })
                  .then(async (tim) => {
                    timEmbed.delete();
                    tim.first().delete();

                    let comEmbed = new MessageEmbed()
                      .setTitle(`Order Details`)
                      .setDescription(`Description: ` + des.first().content)
                      .addField(
                        `Budget`,
                        `$${bud.first().content.match(/[0-9]/gm).join("")}`,
                        true
                      )
                      .addField(`Timeframe`, tim.first().content, true)
                      .addField(`Profile`, lin.first().content, true)
                      .setColor(client.config.color)
                      .setFooter(client.user.username + ` Tickets`)
                      .setTimestamp();
                    channel.send(comEmbed);
                  });
              });
          });
      })
      .catch(() => {
        user.send(time_over());
        channel.delete();
      });
  } else if (reaction.emoji.id === "730677211064959001") {
    reaction.users.remove(user);

    let channel = await message.guild.channels.create(
      user.username + "-exchange"
    );
    channel.setTopic(user.id);
    channel.setParent(client.config.ticketParent);
    channel.createOverwrite(message.guild.id, { VIEW_CHANNEL: false });
    channel.createOverwrite(user.id, {
      VIEW_CHANNEL: true,
      SEND_MESSAGES: true,
    });

    let linEmbed = await channel.send(
      question(`What is your MCM/OGU profile link?`)
    );

    channel
      .awaitMessages((m) => m.author.id === user.id, {
        max: 1,
        time: 960000,
        errors: ["time"],
      })
      .then(async (lin) => {
        linEmbed.delete();
        lin.first().delete();
        let priEmbed = await channel.send(
          question(
            `How much bitcoin are you looking to purchase? (Provide the USD value)`
          )
        );

        channel
          .awaitMessages((m) => m.author.id === user.id && m.content.match(/[0-9]/gm), {
            max: 1,
            time: 960000,
            errors: ["time"],
          })
          .then(async (pri) => {
            priEmbed.delete();
            pri.first().delete();
            let optEmbed = await channel.send(
              question(
                `Are you paying with PayPal, CashApp, or Other. (Please provide only one option)`
              )
            );

            channel
              .awaitMessages(
                (m) => m.author.id === user.id && m.content.toLowerCase().match(/paypal|cashapp|other/gm),
                { max: 1, time: 960000, errors: ["time"] }
              )
              .then(async (opt) => {
                optEmbed.delete();
                opt.first().delete();

                let comEmbed = new MessageEmbed()
                  .setTitle(`Order Details`)
                  .addField(
                    `Purchasing`,
                    `$${pri.first().content.match(/[0-9]/gm).join("")} BTC`,
                    true
                  )
                  .addField(`Payment Type`, capitalize(opt.first().content), true)
                  .addField(`Profile`, lin.first().content, true)
                  .setColor(client.config.color)
                  .setFooter(client.user.username + ` Tickets`)
                  .setTimestamp();
                channel.send(comEmbed).then((a) => a.react("🔒"));
              });
          });
      })
      .catch(() => {
        user.send(time_over());
        channel.delete();
      });
  } else if (reaction.emoji.name === "🔒") {
    reaction.users.remove(user);
    if (message.author.id !== message.guild.ownerID) return;

    let a = await message.channel
      .send(question(`Is this ticket complete or not?`))
      .then((a) => {
        a.react("✅");
        a.react("🚫");
      });
    a.awaitReactions((reaction, user) => user.id === message.author.id, {
      max: 1,
    }).then(async (complete) => {
      if (complete.first().emoji.name === "✅") {
        a = await message.channel
          .send(question(`Is the user a customer now?`))
          .then((a) => {
            a.react("✅");
            a.react("🚫");
          });
        a.awaitReactions((reaction, user) => user.id === message.author.id, {
          max: 1,
        }).then(async (complete) => {
          if (complete.first().emoji.name === "✅")
            message.channel.guild.members.cache
              .get(message.channel.topic)
              .roles.add(client.config.customerRole);
          message.channel.permissionOverwrites.forEach((p) => {
            if (p.id !== message.guild.id) p.delete();
          });
          message.channel.setParent(client.config.completeParent);
        });
      } else message.channel.delete();
    });
  }
};