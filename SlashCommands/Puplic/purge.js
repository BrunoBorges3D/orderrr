const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('purge')
    .setDescription('Deletes up to 100 messages of a specific user based on type')
    .addUserOption(option => option.setName('target').setDescription('Select a user').setRequired(true))
    .addIntegerOption(option => option.setName('amount').setDescription('Enter number of messages').setMinValue(1).setMaxValue(100).setRequired(true))
    .addStringOption(option =>
        option.setName('type')
          .setDescription('Type of messages to delete')
          .setRequired(true)
          .addChoices(
            { name: 'All', value: 'all' },
            { name: 'Text Only', value: 'text' },
            { name: 'Embeds', value: 'embed' },
            { name: 'Attachments', value: 'attachment' },
            { name: 'Links', value: 'links' },
            { name: 'Mentions', value: 'mentions' },
            { name: 'Members With No Role', value: 'norole' },
            { name: 'Members With No Avatar', value: 'noavatar' },
            { name: 'Messages With Reactions', value: 'reactions' },
            { name: 'Messages With Emojis', value: 'emojis' },
          )),
  async execute(interaction) {
    if (!interaction.member.permissions.has(PermissionFlagsBits.ManageMessages)) {
      return interaction.editReply({ content: 'You do not have permission to use this command.', ephemeral: true });
    }

    const targetUser = interaction.options.getUser('target');
    const type = interaction.options.getString('type', true);
    const amount = interaction.options.getInteger(`amount`) 
    const messages = await interaction.channel.messages.fetch({ limit: amount });

    const filteredMessages = messages.filter(m => {
      if (targetUser && m.author.id !== targetUser.id) return false;

      switch (type) {
        case 'all':
          return true;
        case 'text':
          return m.content && !m.attachments.size && !m.embeds.length;
        case 'embed':
          return m.embeds.length > 0;
        case 'attachment':
          return m.attachments.size > 0;
        case 'links':
          return m.content.includes('http://') || m.content.includes('https://');
        case 'mentions':
          return m.mentions.users.size > 0 || m.mentions.roles.size > 0;
        case 'norole':
          return m.member && m.member.roles.cache.size <= 1;
        case 'noavatar':
          return m.author.displayAvatarURL() === m.author.defaultAvatarURL;
        case 'reactions':
          return m.reactions.cache.size > 0;
        case 'emojis':
          return m.content.match(/<:\w+:\d+>/g) || m.content.match(/<a:\w+:\d+>/g);
      }
    });

    try {
        if (filteredMessages.size === 0) {
          return interaction.reply({ content: 'No messages found matching your criteria.', ephemeral: true });
        }
        
        await interaction.channel.bulkDelete(filteredMessages, true);
        await interaction.reply({ content: `**✅ Successfully Deleted Messages**\n> Sebanyak ➡️ ${filteredMessages.size}.`, ephemeral: true });
      } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'There was an error trying to purge messages in this channel.', ephemeral: true });
      }
  },
};
