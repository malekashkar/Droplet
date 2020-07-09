module.exports = {
    name: "Pay",
    usage: "pay <amount>",
    description: "Create a paypal link for the user to pay you.",

    execute: async(client, message, args) => {
        const { error, complete } = require("../utils/embeds");

        if(!args[0]) return message.channel.send(error(`Please provide an amount you would like to receive.`));
        const price = args[0].match(/[0-9]/gm).join("");

        message.channel.send(complete(`Please send **$${price} USD F&F** to through [this link](https://www.paypal.me/malekalashka/${price}).`))
    }
}