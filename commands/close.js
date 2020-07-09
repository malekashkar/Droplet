module.exports = {
  name: "Close",
  usage: "close",
  description: "Opens a new menu to close a ticket channel.",

  execute: async (client, message, args) => {
    if (message.channel.parentID !== client.config.ticketParent) return;
    let { question } = require("../utils/embeds");

    let a = await message.channel.send(
      question(`Is this ticket complete with?`)
    );

    a.react("✅");
    a.react("🚫");
    a.awaitReactions((reaction, user) => user.id === message.author.id, {
      max: 1,
      time: 900000,
      errors: ["time"],
    }).then(async (complete) => {
      a.delete();

      if (complete.first().emoji.name === "✅") {
        a = await message.channel.send(
          question(`Would you like for the user to receive the customer role?`)
        );

        a.react("✅");
        a.react("🚫");
        a.awaitReactions((reaction, user) => user.id === message.author.id, {
          max: 1,
          time: 900000,
          errors: ["time"],
        }).then(async (complete) => {
          a.delete();

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
  },
};
