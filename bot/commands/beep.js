const Discord = require('discord.js');

// Function to create embed for errors, taking embed description as its argument
function errEmbed(text) {
    const embed = new Discord.RichEmbed()
      .setColor(0xDDAA0B)
      .setTitle("ERROR:")
      .setDescription(text);
      return embed;
}

module.exports = {
    name: 'role',
    description: 'tester',
    args: true,
    usage: '<user> <role>',
    execute(msg, args) {
        if (args[0] === 'foo') {
            return msg.channel.send(errEmbed('bar'));
        }

        msg.channel.send(`Arguments: ${args}\nArguments length: ${args.length}`);
    },
}
