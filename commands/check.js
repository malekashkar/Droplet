module.exports = {
  name: "Check",
  usage: "check <transaction id>",
  description:
    "Queue up a transaction to be conf checked.",

  execute: async (client, message, args) => {
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
  },
};
