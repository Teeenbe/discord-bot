# Foreword
This is a fun little project that not only gave - and continues to give - me chance to practise what I know, but since starting it, I've learnt increasing amounts about coding principles/standards through engagement with other programmers on occasions that I've sought help and analysing my own work and it has also taught me how to think more critically. Since it has its own library (discord.js), it has given me a taste of reading documentation in searching for methods and classes that I need to use in my code so that my bot may interact with the Discord API. In addition, it requires Node.js to actually execute the code and so I've had reason to use and familiarise myself somewhat with the command line, as well as importing modules. In seeking to further improve my bot's functionality, this has extended to file handling - saving data and accessing it for later use.

# Background
While progressing through an online JavaScript/ECMAScript course on Udemy, I was in the middle of a lecture and thinking about ways of applying the lecture content in real-life situations when it suddenly occurred to me that I might try creating a bot on Discord.

For several years now, I have helped an online content creator with organising a team of 'actors' to help him record his roleplays. We originally used Skype, but then Discord released and its features and functionality appealed to us, so we transferred our group to it. One benefit of this was that, while still enabling us to carry out private business, the server could be opened to the public - namely, the content creator's fanbase, and joint administration was entrusted to me, alongside some other trustworthy people. While browsing sites for bots to add to the server, I tried to find one that could issue reminders to help with team organisation. Unfortunately, I couldn't really find any that worked well, if at all.

Fast forward to the current time and this predicament gave me inspiration for where I should begin with my Discord bot - a reminder feature.

# remindme - basics/essentials
The command is as follows:

    |remindme <reminderTime> <reminderDate> <reminderText>

An example of it in use may be:

    |remindme 18:30 28/10/2019 Fetch the pizza from the oven
    
This input message will be converted into an array (`remindmeArgs`), split at each white space, which will look as such:

    remindmeArgs = ['|remindme', '18:30', '28/10/2019', 'Fetch', 'the',...];
    
The command prefix and keyword '`|remindme`' are removed from the array, as this value is no longer needed, then two more arrays are created - `reminderTime` and `reminderDate`, split at `:` and `/`, respectively. Since the original values are strings, `Array.map(Number)` is used to convert them so that they can be used in a `new Date()` instantiation, which - while it can take a string - is much more easily done with numerical values.

These arrays will now look as follows:

    reminderTime = [18, 30];
    reminderDate = [28, 10, 2019];
    
Now that the values are in a usable format, they're used as the parameters in the `new Date()` method, as aforementioned. Subbing in the example values, we would have this:

    Function: new Date(year, month, day, hour, minute, second, millisecond)
    
    reminderWhen = new Date(2019, 9, 28, 18, 30);   // The month value is zero-index, so its value will need to be one less than the user input
    
Following on from this, `Array.splice(...)` is used to take the text values from `reminderArgs` and `Array.join(' ')` forms it into a single string, storing it in `reminderText`:

    reminderText = "Fetch the pizza from the oven";

Having now performed all the calculations that are needed, use is made of the `setTimeout(function {}, milliseconds)` method to act as the timer between initial input and returning the message at the desired time. The function/first parameter here obviously consists of returning the message, which - in the case of the discord.js library, would simply be:

    message.channel.send(reminderText);

Getting a working value for the `milliseconds` parameter is the real calculation here and takes a bit more critical thinking with a slight mathematical approach.

Consider that JavaScript measures time on the basis of how many milliseconds have passed since 00:00 on January 1, 1970. In the base library, there is a method, `Date.now()` that returns that exact value at its time of execution. There is also another method, `Date.getTime()` that returns the number of milliseconds that passed, or - it is important to note - *will* have passed since 00:00 on January 1, 1970 up to the specified date.

With this knowledge then, and given that the `milliseconds` parameter in the `setTimeout()` method is the number of milliseconds that passes before the code within the function is executed, an expression can be developed to calculate the necessary value. In essence, it is the number of milliseconds that passes between the time of execution and the time that the user wishes to be reminded, which is the exact value calculated by:

    Date.getTime() - Date.now();
    
and in the context of this example would be:

    reminderWhen.getTime() - Date.now();
    
Putting this together then results in the following:

    setTimeout(function() {
            message.channel.send(reminderText);
        }, reminderWhen.getTime() - Date.now();
        
and the result would be a message from the bot in the same channel, reminding the user to fetch their pizza from the oven at 18:30 on Oct 28, 2019!

# remindme - quality of life
Discord is quite a sleek, modern application and it contains some cool features! One example of this is reactions. Users have the option of 'reacting' to another user's messages by essentially attaching available emojis of their choice to the message and the Discord API and discord.js library allow for this to be utilised by bots to provide extra functionality - in this case, confirmation of an issued command.
