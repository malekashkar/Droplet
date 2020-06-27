exports.run = async(client, message, args) => {
    const fs = require("fs");
    let storage = JSON.parse(fs.readFileSync('./storage.json'));

    storage.opened_tickets = message.guild.channels.cache.get(client.config.ticket_parent).children.array().length;
    storage.completed_tickets = message.guild.channels.cache.get(client.config.complete_parent).children.array().length;
    
    fs.writeFileSync('./storage.json', JSON.stringify(storage));
}