module.exports = async (client, message) => {
  if  (message.author.bot) return;
  if (message.author.id !== message.guild.ownerID) return;
  if (message.content.indexOf(client.config.prefix) !== 0) return;

  const args = message.content
    .slice(client.config.prefix.length)
    .trim()
    .split(/ +/g);

  const command = args.shift().toLowerCase();
  const cmd = client.commands.get(command);
  if (!cmd) return;

  message.delete();
  cmd.execute(client, message, args);
};
