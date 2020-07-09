module.exports = {
  name: "Delete",
  usage: "delete",
  description: "Completely delete a ticket channel.",

  execute: async (client, message, args) => {
    if (message.channel.parentID === client.config.ticketParent)
      message.channel.delete();
  },
};
