const Discord = require('discord.js');
const bot = new Discord.Client();

// Function to create embed for errors, taking embed description as its argument
function errEmbed(text) {
    const embed = new Discord.RichEmbed()
      .setColor(0xDDAA0B)
      .setTitle("ERROR:")
      .setDescription(text);
      return embed;
}

module.exports = {
    name: 's',
    description: 'Sudo bot chat',
    args: true,
    usage: '<tch | chatMsg>',
    targetChannel: '',
    execute(msg, args) {
        if (args[0] === 'tch') {
            let embed = new Discord.RichEmbed()
              .setColor(0xDDAA0B)
              .setDescription("Target channel assigned");
            msg.channel.send(embed)
            return this.targetChannel = args[1];
        } else {
            const chatMsg = args.join(/ +/);

            if (this.targetChannel = undefined) {
                msg.channel.send(errEmbed("There is no assigned target channel."));
                return;
            } else {
                bot.channels.get(this.targetChannel).send(chatMsg);
            }
        }
    },
};
