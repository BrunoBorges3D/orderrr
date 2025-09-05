const { SlashCommandBuilder, SelectMenuBuilder, EmbedBuilder, ActionRowBuilder } = require('discord.js');
 
module.exports = {
    data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Dapatkan bantuan...!'),
    async execute(interaction) {
 
        const helprow1 = new ActionRowBuilder()
        .addComponents(
 
            new SelectMenuBuilder()
            .setMinValues(1)
            .setMaxValues(1)
            .setCustomId('selecthelp')
            .setPlaceholder('• Pilih Menu')
            .addOptions(
                {
                    label: '• Help Center',
                    description: 'Navigasikan ke Pusat Bantuan.',
                    value: 'helpcenter',
                },
 
                {
                    label: '• Audit Log',
                    description: 'Navigasikan ke halaman Audit Log.',
                    value: 'ticketpage'
                },
 
                {
                    label: '• Welcomer',
                    description: 'Navigasikan ke halaman welcomer.',
                    value: 'welcomer',
                },

                {
                    label: '• Commands',
                    description: 'Navigasikan ke halaman bantuan Perintah.',
                    value: 'commands',
                },
            ),
        );
 
        const centerembed = new EmbedBuilder()
        .setColor('#10a9eb')
        .setTimestamp()
        .setTitle('Semua Bantuan')
        .setURL('https://media.discordapp.net/attachments/1193609483268653097/1219972388033134663/s.jpg')
        .setThumbnail('https://media.discordapp.net/attachments/1216712873024159876/1219720695827923096/dongo_2.png')
        .setAuthor({ name: `🕊️ Help Toolbox`})
        .setFooter({ text: `🕊️ Help Center`})
        .setImage("https://media.discordapp.net/attachments/1216712873024159876/1219722307790966864/Pink__Blue_Futuristic_Gaming_Channel_Youtube_Intro_1500_x_370_px_1200_x_100_px.gif")
        .addFields({ name: `• Help Center`, value: `> Menampilkan menu ini.`})
        .addFields({ name: `• Audit Log`, value: `> Dapatkan informasi Log Audit.`})
        .addFields({ name: `• welcomer`, value: `> Navigasikan ke halaman welcomer.`})
        .addFields({ name: `• Commands`, value: `> Dapatkan informasi tentang perintah.`})
 
        await interaction.reply({ embeds: [centerembed], components: [helprow1] });
    }
}
