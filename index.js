const Discord = require('discord.js');
const client = new Discord.Client({ partials: ['MESSAGE', 'REACTION', 'CHANNEL' ]});
const fs = require('fs');

require("./database/connect");

client.config = require('./config.json');
client.commands = new Discord.Collection();
client.models = {
  check: require("./database/models/check"),
  user: require("./database/models/user")
}

fs.readdir("./events/", (err, files) => {
  if (err) return console.error(err);
  files.forEach(file => {
    if(!file.endsWith(".js")) return;
    const event = require(`./events/${file}`);
    client.on(file.split(".")[0], event.bind(null, client));
  });
});

fs.readdir("./commands/", (err, files) => {
  if (err) return console.error(err);
  files.forEach(file => {
    if(!file.endsWith(".js")) return;
    let props = require(`./commands/${file}`);
    let name = file.split(".")[0];
    client.commands.set(name, props);
  });
});

client.on('guildMemberAdd', () => member.roles.add(client.config.autoRole, 'Member Autorole'));
client.on('ready', () => {
  console.log('The discord bot is up and running.');
  setInterval(() => require("./utils/check")(client), 30000);
});

client.login(client.config.token);