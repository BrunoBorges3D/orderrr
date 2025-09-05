const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require("discord.js");
const Schema = require("../../database/models/auditlog");
  
module.exports = {
    data: new SlashCommandBuilder()
    .setName("auditlog-delete")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setDescription("Delete the audit log system in your server"),
    async execute(interaction) {
        const { guild } = interaction;
 
        const data = await Schema.findOne({
            Guild: guild.id,
        });
        if (!data) {
            return await interaction.reply("🚫 You don't have an audit log system set up in this server!");
        }

        await Schema.deleteMany({
            Guild: guild.id,
        });

        const embed = new EmbedBuilder()
        .setTitle("✅ Audit Log Deleted")
        .setDescription(`The audit log system has been successfully deleted from **${guild.name}**. To set it up again, use the setup command!`)
        .setColor("Blue")
        .setThumbnail("https://media.discordapp.net/attachments/1193609483268653097/1218914858628550777/Blue_and_White_Circle_Surfing_Club_Logo_1.png")
        .setFooter({ text: "TIW Bot", iconURL: "https://media.discordapp.net/attachments/1193609483268653097/1218914858628550777/Blue_and_White_Circle_Surfing_Club_Logo_1.png" })
        .setTimestamp();
 
        return await interaction.reply({
            embeds: [embed],
        });
    }
};
