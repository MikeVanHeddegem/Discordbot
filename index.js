const discord = require("discord.js");
const botConfig = require("./botconfig.json");
 
const client = new discord.Client();
client.login(process.env.token);
 
client.on("ready", async () => {
 
    console.log(`${client.user.username} Bot is now active`);
 
    client.user.setActivity("Testing", { type: "PLAYING" });
 
});
 
 
client.on("message", async message => {
 
    if(message.author.bot) return;
 
    if(message.channel.type === "dm") return;
 
    var prefix = botConfig.prefix;
 
    var messageArray = message.content.split(" ");
 
    var command = messageArray[0];
 
    if (command === `${prefix}hello`) {
 
        return message.channel.send("Hello!! How are you?");
    
    }
 
    if (command === `${prefix}info`) {
     
      var botEmbed = new discord.MessageEmbed()
          .setTitle('Bot info')
          .setDescription("The official bot of LaunchpadByMike")
          .setColor("#19ff0d")
          .addField("Bot name", client.user.username)

          .setThumbnail('https://i.imgur.com/wSTFkRM.png')
          .setImage('https://i.imgur.com/wSTFkRM.png')
          .setTimestamp()
          .setFooter('Some footer text here', 'https://i.imgur.com/wSTFkRM.png');

      return message.channel.send(botEmbed);
  }

  

  if (command === `${prefix}serverinfo`) {

      var serverEmbed = new discord.MessageEmbed()
          .setDescription("This is you're information")
          .setColor("#19ff0d")
          .addField("User name", client.user.username)
          .addField("you joined this server on", message.member.joinedAt)
          .addField("Total members", message.guild.memberCount);

      return message.channel.send(serverEmbed);
  }

 
if (command === `${prefix}kick`) {
 
        const args = message.content.slice(prefix.length).split(/ +/);
 
        if (!message.member.hasPermission("KICK_MEMBERS")) return message.reply("sorry you can't do that");
 
        if (!message.guild.me.hasPermission("KICK_MEMBERS")) return message.reply("No permission");
 
        if (!args[1]) return message.reply("You need to specify a user.");
 
        if (!args[2]) return message.reply("You need to give a reason!!");
 
        var kickUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[1]));
 
        var reason = args.slice(2).join(" ");
 
        if (!kickUser) return message.reply("Can't find that user");
 
        var embed = new discord.MessageEmbed()
            .setColor("#ff0000")
            .setThumbnail(kickUser.user.displayAvatarURL)
            .setFooter(message.member.displayName, message.author.displayAvatarURL)
            .setTimestamp()
            .setDescription(`** kicked:** ${kickUser} (${kickUser.id})
            **Kicked by:** ${message.author}
            **Reason: ** ${reason}`);
 
        var embedPrompt = new discord.MessageEmbed()
            .setColor("GREEN")
            .setAuthor("please respond within 30 seconds.")
            .setDescription(`Do you want to kick ${kickUser} ?`);
 
 
        message.channel.send(embedPrompt).then(async msg => {
 
            var emoji = await promptMessage(msg, message.author, 30, ["✅", "❌"]);
 
 
            // We kijken dat het de gebruiker is die het als eerste heeft uitgevoerd.
            // message.channel.awaitMessages(m => m.author.id == message.author.id,
            //     { max: 1, time: 30000 }).then(collected => {
 
            //         if (collected.first().content.toLowerCase() == 'yes') {
            //             message.reply('Kick speler.');
            //         }
            //         else
            //             message.reply('Geanuleerd');
 
            //     }).catch(() => {
            //         message.reply('Geen antwoord na 30 sec, geanuleerd.');
            //     });
 
 
            if (emoji === "✅") {
 
                msg.delete();
 
                kickUser.kick(reason).catch(err => {
                    if (err) return message.channel.send(`there went something wrong`);
                });
 
                message.reply(embed);
 
            } else if (emoji === "❌") {
 
                msg.delete();
 
                message.reply("kick canceled").then(m => m.delete(5000));
 
            }
 
        });
    }
 
 
    if (command === `${prefix}ban`) {
 
        const args = message.content.slice(prefix.length).split(/ +/);
 
        if (!args[1]) return message.reply("Geen gebruiker opgegeven.");
 
        if (!args[2]) return message.reply("Gelieve een redenen op te geven.");
 
        if (!message.member.hasPermission("BAN_MEMBERS")) return message.reply("sorry jij kan dit niet");
 
        if (!message.guild.me.hasPermission("BAN_MEMBERS")) return message.reply("Geen perms");
 
        var banUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[1]));
 
        var reason = args.slice(2).join(" ");
 
        if (!banUser) return message.reply("Kan de gebruiker niet vinden.");
 
        var embed = new discord.MessageEmbed()
            .setColor("#ff0000")
            .setThumbnail(banUser.user.displayAvatarURL)
            .setFooter(message.member.displayName, message.author.displayAvatarURL)
            .setTimestamp()
            .setDescription(`** Geband:** ${banUser} (${banUser.id})
            **Geband door:** ${message.author}
            **Redenen: ** ${reason}`);
 
        var embedPrompt = new discord.MessageEmbed()
            .setColor("GREEN")
            .setAuthor("react within 30 secondes")
            .setDescription(`do you want to ban ${banUser}`);
 
 
        message.channel.send(embedPrompt).then(async msg => {
 
            var emoji = await promptMessage(msg, message.author, 30, ["✅", "❌"]);
 
 
            // We kijken dat het de gebruiker is die het als eerste heeft uitgevoerd.
            // message.channel.awaitMessages(m => m.author.id == message.author.id,
            //     { max: 1, time: 30000 }).then(collected => {
 
            //         if (collected.first().content.toLowerCase() == 'yes') {
            //             message.reply('Kick speler.');
            //         }
            //         else
            //             message.reply('Geanuleerd');
 
            //     }).catch(() => {
            //         message.reply('Geen antwoord na 30 sec, geanuleerd.');
            //     });
 
 
            if (emoji === "✅") {
 
                msg.delete();
 
                
                banUser.ban(reason).catch(err => {
                    if (err) return message.channel.send(`there went something wrong`);
                });
 
                message.reply(embed);
 
            } else if (emoji === "❌") {
 
                msg.delete();
 
                message.reply("Ban canceled").then(m => m.delete(5000));
 
            }
 
        });
    }
 
// Emojis aan teksten kopellen.
async function promptMessage(message, author, time, reactions) {
    // We gaan eerst de tijd * 1000 doen zodat we seconden uitkomen.
    time *= 1000;
 
    // We gaan ieder meegegeven reactie onder de reactie plaatsen.
    for (const reaction of reactions) {
        await message.react(reaction);
    }
 
    // Als de emoji de juiste emoji is die men heeft opgegeven en als ook de auteur die dit heeft aangemaakt er op klikt
    // dan kunnen we een bericht terug sturen.
    const filter = (reaction, user) => reactions.includes(reaction.emoji.name) && user.id === author.id;
 
    // We kijken als de reactie juist is, dus met die filter en ook het aantal keren en binnen de tijd.
    // Dan kunnen we bericht terug sturen met dat icoontje dat is aangeduid.
    return message.awaitReactions(filter, { max: 1, time: time }).then(collected => collected.first() && collected.first().emoji.name);
}

     


});