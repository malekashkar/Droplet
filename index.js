const Discord = require('discord.js');
const client = new Discord.Client({ partials: ['MESSAGE', 'REACTION', 'CHANNEL' ]});
const fs = require('fs');

client.config = require('./config.json');
client.commands = new Discord.Collection();
client.on('guildMemberAdd', () => member.roles.add(client.config.autorole, 'Member Autorole'));

let storage = JSON.parse(fs.readFileSync('./storage.json'));

client.add = type => {
  if(type === "opened") storage.opened_tickets++;
  if(type === "complete") storage.completed_tickets++;
  fs.writeFileSync('./storage.json', JSON.stringify(storage));
}

client.remove = type => {
  if(type === "opened") storage.opened_tickets--;
  if(type === "complete") storage.completed_tickets--;
  fs.writeFileSync('./storage.json', JSON.stringify(storage));
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
    let commandName = file.split(".")[0];
    client.commands.set(commandName, props);
  });
});

client.login(client.config.token);