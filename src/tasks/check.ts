/*
const fetch = require("node-fetch");
const { error, complete } = require("../utils/embeds");

if (!args[0])
  return message.channel.send(
    error(`Do not forget to include the transaction ID.`)
  );

fetch(`https://api.blockcypher.com/v1/btc/main/txs/${args[0]}`)
  .then((json) => json.json())
  .then((json) => {
    if (json.error)
      return message.channel.send(
        error(`The transaction ID has been detected as invalid.`)
      );
    
      if (json.confirmations >= 1)
      return message.channel.send(
        error(
          `This transaction already has **${json.confirmations} confirmations**.`
        )
      );

    message.channel.send(
      complete(`You will be notified once the transaction gets confirmed.`)
    );
    client.models.check.create({
      channel: message.channel.id,
      transaction: args[0],
    });
  });
*/

/*
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
*/