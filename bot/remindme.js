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
    bot.user.setActivity('with reminders');
});


// remindme function
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
            msg.channel.send(errEmbed(stripIndents`Please make sure that you enter all the values:
                                    \`|remindme <reminderTime> <reminderDate> <reminderText>\``));
            return;
        }

        remindmeArgs.shift();
        // Converts time and date inputs for use in Date()
        const reminderTime = remindmeArgs[0].split(':').map(Number);
        const reminderDate = remindmeArgs[1].split('/').map(Number);

        // Gives an error if date format is incorrect
        let currentYear = new Date().getFullYear();
        if (reminderDate[2] < currentYear) {
            msg.channel.send(errEmbed("Please make sure that your date format is dd/mm/yyyy."));
            return;
        }

        const reminderWhen = new Date(reminderDate[2], reminderDate[1] - 1, reminderDate[0], reminderTime[0], reminderTime[1]);
        if (reminderWhen.getTime() < Date.now()) {
            msg.channel.send(errEmbed("Please make sure that you enter a time in the future."));
            return;
        }

        const reminderText = remindmeArgs.splice(2, remindmeArgs.length - 1).join(' ');

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
