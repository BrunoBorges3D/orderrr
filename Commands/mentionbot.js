const { Events, EmbedBuilder, ButtonStyle, ButtonBuilder, ActionRowBuilder } = require("discord.js");

module.exports = {
    name: Events.MessageCreate,

    async execute(message, client, interaction) {
        if (message.content.includes(`<@${client.user.id}>`))
          
      if (message.author.bot) return;
      
          {
        
        const pingEmbed = new EmbedBuilder()
        
        .setColor("Random")
        .setTitle("🏓 • Who mentioned me??")
        .setDescription( `Hey there **${message.author.username}**!, here is some useful information about me.\n ⁉️ • **How to view all commands?**\nEither use **/help-manual** or do / to view a list of all the commands!`)

          
        .addFields({ name: '**🌐 • Website:**', value: 'REPLACE', inline: true})
        
        .setTimestamp()
      //  .setThumbnail(`REPLACE WITH YOUR BOTS IMAGE AS A LINK`)
    //    .setFooter({text: `Requested by ${message.author.username}.`})
        
        const buttons = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
            .setEmoji("➕")
            .setLabel("Invite")
            .setURL("https://dsc.gg/homekupie")
            .setStyle(ButtonStyle.Link)
        );
        
        const buttons1 = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
            .setEmoji("➕")
            .setLabel("Join Support Server")
            .setURL("https://dsc.gg/homekupie")
            .setStyle(ButtonStyle.Link)
        );
        
        return message.reply({ embeds: [pingEmbed], components: [buttons, buttons1] });
        }
    },
};