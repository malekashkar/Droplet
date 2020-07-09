module.exports = {
  name: "Create",
  usage: "create",
  description: "Create the ticket message in the ticket channel.",

  execute: async (client, message, args) => {
    const { create_order } = require("../utils/embeds");
    const channel = message.guild.channels.cache.get(
      client.config.ticketChannel
    );
    channel.send(create_order(client)).then((a) => {
      a.react("💧");
      a.react("730677211064959001");
    });
  },
};
