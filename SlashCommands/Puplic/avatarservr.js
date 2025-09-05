const { SlashCommandBuilder , EmbedBuilder , PermissionsBitField } = require('discord.js')

module.exports = {
data: new SlashCommandBuilder()

.setName('avatar-server')
.setDescription('serevr avatar'),

async execute(interaction) {
    if(!interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) return await interaction.reply(`> - **لا يـوجـد صـلاحـيـة** <a:false3:1195321993982115870>`)

  
    const zika = new EmbedBuilder()
      
    .setThumbnail(interaction.guild.iconURL())
    .setColor("Random")
      
    .setAuthor({ name: interaction.guild.name , iconURL: interaction.guild.iconURL()})
      
    .setTitle('**Server Avatar URL**')
      
    .setFooter({ text: `Requested By ${interaction.user.username} ` , iconURL: interaction.user.displayAvatarURL()})
      
    .setTimestamp()
      
    .setImage(interaction.guild.iconURL())

    await interaction.reply({embeds: [zika] })
  }
}