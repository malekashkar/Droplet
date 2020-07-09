const embeds = require("../utils/embeds");

exports.execute = async (client, message, args) => {
  const { help } = require("../utils/embeds");
  const desc = client.commands
    .array()
    .map((cmd, i) => {
      if (cmd.name && cmd.usage && cmd.description)
        return `${i + 1}. **${cmd.name}** | ${client.config.prefix}${
          cmd.usage
        } | ${cmd.description}\n`;
    })
    .join("");

  message.channel.send(help(desc));
};
