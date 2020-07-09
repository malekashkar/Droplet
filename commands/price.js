module.exports = {
  name: "Price",
  usage: "price <crypto currency>",
  description: "Check the price of a specific currency.",

  execute: async (client, message, args) => {
    const fetch = require("node-fetch");
    const { price, error } = require("../utils/embeds");

    fetch(`https://api.coinbase.com/v2/prices/${args[0].toUpperCase()}-USD/buy`)
      .then((res) => res.json())
      .then((body) =>
        message.channel.send(price(body.data.amount, args[0].toUpperCase()))
      )
      .catch(() =>
        message.channel.send(
          error(`**${args[0].toUpperCase()}** is not a valid currency!`)
        )
      );
  },
};
