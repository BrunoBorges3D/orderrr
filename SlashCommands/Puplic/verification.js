const Schema = require("../../database/models/verify");
const { 
    SlashCommandBuilder,
    PermissionsBitField,
    ChannelType,      
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setverify')
        .setDescription('Setup the verify panel')

        .addBooleanOption(option => option.setName('enable').setDescription('Select a boolean').setRequired(true))

        .addChannelOption(option => option.setName('channel').setDescription('Select a channel').setRequired(true).addChannelTypes(ChannelType.GuildText))

        .addRoleOption(option => option.setName('role').setDescription('Select a role').setRequired(true))
        
        .addStringOption(option => option.setName("image").setDescription("Enter a image"))

    .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator),

        async execute(interaction,client) {

        await interaction.deferReply({ fetchReply: true });

    const boolean = interaction.options.getBoolean('enable');

    const channel = interaction.options.getChannel('channel');

    const role = interaction.options.getRole('role');

    const image = interaction.options.getString('image') || 'https://media.discordapp.net/attachments/1216712873024159876/1218434317047566406/peripy.gif';


    if (boolean == true) {
        const data = await Schema.findOne({ Guild: interaction.guild.id });
        if (data) {
            data.Channel = channel.id;
            data.Role = role.id
            data.save();
        }
        else {
            new Schema({
                Guild: interaction.guild.id,
                Channel: channel.id,
                Role: role.id
            }).save();
        }
        const embedsuccess = new EmbedBuilder()
        .setTitle(`Success`)
        .setColor('#00ff00')
        .setDescription(`Verify panel has been successfully created`)
        .addFields({
            name: `📘┆Channel`,
            value: `${channel} (${channel.name})`,
            inline: true
        },{
            name: `📛┆Role`,
            value: `${role} (${role.name})`,
            inline: true
        })
        interaction.editReply({ embeds: [embedsuccess]})

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('Bot_verify')
                    .setEmoji('✅')
                    .setStyle(ButtonStyle.Success),
            );

            const embedVerify = new EmbedBuilder()
        .setTitle(`Verification System ・ ${interaction.guild.name}`)
        .setColor('#800080')
        .setDescription("🕊️ **INDONESIA**\n> ```Tujuan Verify Ini, Untuk Dapat Menghindari Adanya Robot Yang Akan Masuk Kedalam Server Discord Ini, Maka Dari Itu Kita Terapkan System VERIFY```\n> ```Anda Akan Melakukan Verifikasi Terlebih Dahulu Dengan Klik Button ✅ Dibawah Ini, Terimakasih^^```\n🕊️ **ENGLISH**\n> ```The purpose of this verification is to avoid robots entering this Discord server, therefore we implement the VERIFY system.```\n> ```You will verify first by clicking the button ✅ below, thank you^^```")
        .setImage(image)
        
        channel.send({embeds: [embedVerify], components: [row]})
    }

    },
};