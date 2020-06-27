exports.run = async(client, message, args) => {
    if(message.channel.parentID !== client.config.ticket_parent) return;

    client.remove('opened');
    message.channel.delete();
}