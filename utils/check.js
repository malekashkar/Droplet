module.exports = async(client) => {
    const fetch = require("node-fetch");
    const { complete } = require("../utils/embeds");

    let docs = await client.models.check.find({});

    docs.forEach(info => {
        fetch(`https://api.blockcypher.com/v1/btc/main/txs/${info.transaction}`)
        .then(res => res.json())
        .then(async json => {
            if(!json.confirmations) return;

            const channel = await client.guilds.cache.first().channels.cache.get(info.channel);
            channel.send(complete(`The transaction with ID below now has **${json.confirmations}** confirmation(s).`, info.transaction));
            info.deleteOne({ channel: info.channel, transaction: info.transaction});
        });
    });
}