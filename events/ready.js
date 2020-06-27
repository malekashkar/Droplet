const fs = require("fs");

module.exports = async(client) => {
    console.log(`The discord bot is ready.`);

    let storage = JSON.parse(fs.readFileSync('./storage.json'));
    let guild = client.guilds.cache.get(client.config.guildID);
    let openedVoice = guild.channels.cache.get(client.config.openedVoice);
    let completeVoice = guild.channels.cache.get(client.config.completeVoice);

    openedVoice.setName(`👥 Opened: ${storage.opened_tickets}`);
    completeVoice.setName(`🛒 Complete: ${storage.completed_tickets}`);

    setInterval(() => {
        openedVoice.setName(`👥 Opened: ${storage.opened_tickets}`);
        completeVoice.setName(`🛒 Complete: ${storage.completed_tickets}`);
    }, 60000);
}