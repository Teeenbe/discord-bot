// Modules
const Discord = require('discord.js');
const { prefix, token } = require('./config.json');
const fs = require('fs');
const { stripIndents } = require('common-tags');

const bot = new Discord.Client();
bot.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    bot.commands.set(command.name, command);
}

function errEmbed(text) {
    const embed = new Discord.RichEmbed()
      .setColor(0xDDAA0B)
      .setTitle("ERROR:")
      .setDescription(text);
      return embed;
}


// Bot login
bot.login(token);


// Bot loaded & 'Playing' status
bot.once('ready', () => {
    console.log('Loaded');
    bot.user.setActivity('with your mum');
});


// Logs when bot is added to or is removed from a server
bot.on('guildCreate', guild => {
      bot.channels.get('624628020937883690').send(`I have been added to: **${guild.name}** (ID: ${guild.id}).`);
});

bot.on('guildDelete', guild => {
      bot.channels.get('624628020937883690').send(`I have been removed from: **${guild.name}** (ID: ${guild.id}).`);
});


// Commands
bot.on('message', msg => {
    if (!msg.content.startsWith(prefix) || msg.author.bot) return;

    const args = msg.content.slice(prefix.length).split(/ +/);
    const commandName = args.shift().toLowerCase();

    if (!bot.commands.has(commandName)) return;

    const command = bot.commands.get(commandName);

    if (command.args && !args.length) {
        let errMsg = `Incorrect arguments. Command: \n\n\`${prefix}${command.name}`

        if (command.usage) {
            errMsg += ` ${command.usage}\``;
        } else {
            errMsg += `\` - should include parameters, but I forgot. My bad \:face_palm:`;
        }

        return msg.channel.send(errEmbed(errMsg));
    }

    try {
        command.execute(msg, args);
    } catch (error) {
        console.error(error);
        msg.reply('there was an error trying to execute that command, sorry!');
    }
});


// Sorting out the mongs on the Slurpers server
bot.on('message', msg => {
    if (msg.channel.id === '332812456038760449' &&
    (msg.content.startsWith('!play') ||
    msg.content.startsWith('-play') ||
    msg.content.startsWith('!search') ||
    msg.content.startsWith('-search'))) {
        msg.delete().then(msg => msg.reply("keep music in <#485056696901697536>, you mong"))
    }
});


// Sends "Rhino is a meme" to rhino_counter
bot.on('message', msg => {
    if (msg.content.toLowerCase().includes('rhino')) {
        if (msg.author.bot) {
            return;
        } else {
            bot.channels.get('624302524064727050').send(`Rhino is a meme\n(${msg.guild.name})`);
        }
    }
});


// Custom message via bot from selected channel to other selected channel
/*bot.on('message', msg => {
    if (msg.content.startsWith('|') && msg.author.id === '230024904869806080') {    // Command must have prefix and only my Discord profile can use it
        if (msg.content.startsWith('|tch')) {   // Changes the target channel
            const sudoArgs = msg.content.split(' ');
            const embed = new Discord.RichEmbed()
              .setColor(0xDDAA0B)
              .setDescription("Target channel assigned.");
            msg.channel.send(embed);
            targetChannel = sudoArgs[1];
        } else if (msg.content.startsWith('|s ')) {   // Copies and sends the message
            const chatMsg = msg.content.split('|s ').join('');
            bot.channels.get(targetChannel).send(chatMsg);
        }
    }
});*/


// What a guy -> Looking like a snack
bot.on('message', msg => {
    if (msg.content.toLowerCase() === "what a guy") {// && msg.guild.id === '199601980950315008') {
        if (msg.channel.type === 'dm' || msg.channel.type === 'group') { return; }    // Doesn't respond to messages in DMs
        else { msg.channel.send("Looking like a snack"); }
    }
});



// Welcome message
bot.on("guildMemberAdd", member => {
    if (member.guild.id === '382327253620490251') {   // Kano/Rhino server
        bot.channels.get('382327254199566337').send("Welcome! :wave:");
    } else if (member.guild.id === '268538200383946752') {    // Gizzy server
        bot.channels.get('268538200383946752').send("Welcome! :wave:");
    }
});
