const Discord = require('discord.js');
const { prefix, token } = require('./config.json');
const fs = require('fs');
const { stripIndents } = require('common-tags');

const bot = new Discord.Client();


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
    if (msg.author.bot || msg.channel.type === 'dm') { return }

    var msgArray = msg.content.split(' ');
    var cmd = msgArray[0];
    var cmdArgs = msgArray.slice(1);

    switch (cmd) {
        case `${prefix}test`:
            return msg.channel.send("test return");
        case `${prefix}ping`:
            return msg.channel.send("pong");
        case `${prefix}userinfo`:
            var userID = cmdArgs[0];
            var createdDate = new Date()
            var embed = new Discord.RichEmbed()
              .setTitle("Username:")
              .setColor(0xDDAA0B)
              .setDescription(msg.guild.members.get(userID))
              .setThumbnail(msg.guild.members.get(userID).avatar)
              .addField("Account created on:", msg.guild.members.get(userID).createdAt)
              .addField("Joined server on:", msg.guild.members.get(userID).joinedAt);
            msg.channel.send(embed);
            return;
        default:
            return;
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



/*bot.on('message', msg => {
    if (msg.content === "|help") {
        fs.readFile('commands/help.js', function(err, contents) {
            if (err) throw err;
            msg.channel.send(contents);
        });
    }
});*/



bot.on('message', msg => {
    if (msg.content === "when") {
        msg.channel.send(msg.member.joinedAt.toString());
    }
})



// Message embed
bot.on('message', msg => {
    if (msg.content === "embed ting") {
        const embed = new Discord.RichEmbed()
          .setTitle("Lookee dis embed")
          .setColor(0xDDAA0B)
          .setDescription("Dis a sick embed ting")
          .setAuthor(msg.author.username)
          .setThumbnail(msg.author.avatarURL);
        msg.channel.send(embed);
        fs.appendFile('saved_data/text.txt', msg.guild.id + ',' + msg.content + ';' + '\n', function(err) {
            if (err) throw err;
            console.log('Saved!');
        });
        fs.readFile('saved_data/text.txt', 'utf8', function(err, contents) {
            msg.channel.send(contents);
        });
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
bot.on('message', msg => {
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
});


// What a guy -> Looking like a snack
bot.on('message', msg => {
    if (msg.content.toLowerCase() === "what a guy") {// && msg.guild.id === '199601980950315008') {
        if (msg.channel.type === 'dm' || msg.channel.type === 'group') { return; }    // Doesn't respond to messages in DMs
        else { msg.channel.send("Looking like a snack"); }
    }
});


// Reminder function

/*    // Timezones
var gmt;
var est = gmt - 3;
var pst = gmt - 8;
*/

bot.on('message', msg => {
    if (msg.content.startsWith(`${prefix}remindme`) && msg.author.id === '230024904869806080') {
        // Function to create embed for errors, taking embed description as its argument
        function errEmbed(text) {
            const embed = new Discord.RichEmbed()
              .setColor(0xDDAA0B)
              .setTitle("ERROR:")
              .setDescription(text);
            return embed;
        }

        let remindmeArgs = msg.content.split(' ');

        // Gives an error if a value is missing
        if (remindmeArgs.length < 4) {   // |remindme <reminderTime> <reminderDate> <reminderText>
            msg.channel.send(errEmbed(`Please make sure that you enter all the values:\n\`|remindme <reminderTime> <reminderDate> <reminderText>\``));
            return;
        }

        remindmeArgs.shift();
        // Converts time and date inputs for use in Date()
        const reminderTime = remindmeArgs[0].split(':').map(Number);
        const reminderDate = remindmeArgs[1].split('/').map(Number);

        // Gives an error if date format is incorrect
        let currentYear = new Date().getFullYear();
        if (reminderDate[2] < currentYear) {
            msg.channel.send(errEmbed("Please make sure that your date format is `dd/mm/yyyy`."));
            return;
        }

        const reminderWhen = new Date(reminderDate[2], reminderDate[1] - 1, reminderDate[0], reminderTime[0], reminderTime[1]);
        if (reminderWhen.getTime() < Date.now()) {
            msg.channel.send(errEmbed("Please make sure that you enter a time in the future."));
            return;
        }

        const reminderText = remindmeArgs.slice(2, remindmeArgs.length).join(' ');

        // Gives user chance to ensure they've entered the correct info
        const embed = new Discord.RichEmbed()
          .setColor(0xDDAA0B)
          .setTitle("Reminder will be scheduled for:")
          .setDescription(reminderWhen)
          .addField("Reminder:", reminderText)
          .addField("Is this correct?", "Please select an option.");

        const filter = (reaction, user) => {
            return ['👍', '👎'].includes(reaction.emoji.name) && user.id === msg.author.id;
        };

        msg.channel.send(embed).then(sentEmbed => {
            // Adds reactions to embed message
            sentEmbed.react('👍')
              .then(() => sentEmbed.react('👎'))
              .catch(() => msg.channel.send('Reaction failure. Please try again.'));
            // Listens for user's reaction on the embed to confirm or terminate the function
            sentEmbed.awaitReactions(filter, { max: 1, time: 60000, errors: ['time'] })
              .then(collected => {
                  const reaction = collected.first();
                  function resultEmbed(title, desc){
                      const embed = new Discord.RichEmbed()
                        .setColor(0xDDAA0B)
                        .setTitle(title)
                        .setDescription(desc);
                      return embed;
                  }

                  // If user reacts with thumbs up, reminder is scheduled
                  if (reaction.emoji.name === '👍') {
                      msg.channel.send(resultEmbed("Done! Reminder has been scheduled for:",
                                                  reminderWhen));

                      setTimeout(function() {
                            msg.channel.send(reminderText);
                        }, reminderWhen.getTime() - Date.now());
                  }
                  // If user reacts with thumbs down, the execution ends
                  else {
                      msg.channel.send(resultEmbed("Process terminated!",
                                                  "If you wish to set a reminder, please start again."));
                      return;
                  }
              })
              // If user doesn't react, sends error message and execution ends
              .catch(() => {
                  msg.channel.send(errEmbed("Timed out. If you wish to set a reminder, please start again."));
                  return;
              });
        });
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
