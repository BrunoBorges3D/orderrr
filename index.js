const { colors, backcolor } = require('console-log.js');
const { Configuration, OpenAIApi } = require ('openai');
const fs = require("node:fs");
const path = require("node:path");
const { Client, GatewayIntentBits, Collection, Partials, MessageActionRow, MessageButton, MessageEmbed, TextInputStyle, ModalBuilder, TextInputBuilder, ApplicationCommandType, ButtonStyle, AuditLogEvent, PermissionFlagsBits,
ChannelType, Events, EmbedBuilder, ButtonBuilder, Interaction, SelectMenuBuilder, Permissions, GuildMemberManager, ComponentType, PermissionsBitField, ActionRowBuilder, Routes, REST, StringSelectMenuOptionBuilder, StringSelectMenuBuilder, parseEmoji , WebhookClient } = require("discord.js");
const { Token } = require("./Json/config.json");
//const client = new Client({
//intents: [Object.keys(GatewayIntentBits)],
//partials: [Object.keys(Partials)]
//});
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers
  ],
  partials: [Partials]
});

//end
//=/== ™||> ==/=//
module.exports = client;
client.Cmd = new Collection()
client.commands = new Collection();

fs.readdirSync('./Handlers').forEach((h) => {
require(`./Handlers/${h}`)(client);
});

client.login(Token).catch((err) => {
console.log(c.red.bold.underline.bgBlack("Error in Token  !" + `\n\n` + err + `\n\n`))
});

//==Mongo Db==//
const c = require('ansi-colors');

const mongo = require("mongoose");

const stringlength2 = 69;
mongo

.connect(

    "mongodb+srv://ownkx:uo-n5vrzm@cluster0.qibgz51.mongodb.net/?retryWrites=true&w=majority", ///MongoURL

    {

useUnifiedTopology: true,
useNewUrlParser: true,

    }

)

.then(() => 
    
console.log(c.blue(`     ┃ ` + `MongoDB is connected!` + " ".repeat(-1+stringlength2-` ┃ `.length-`MongoDB is connected!`.length)+ "┃" + " ".repeat(-2+stringlength2-` ┃ `.length-`MongoDB is connected!`.length)+ "┃" )))

//==Mongo Db==//



//==Mention Bot==//

client.on('messageCreate', message => {

  if (message.content === `<@${client.user.id}>`) {
      if(message.author.bot) return;
  
  
      const pingEmbed = new EmbedBuilder()
        
          .setColor("DarkerGrey")
          .setTitle("🏓 • Who mentioned me??")
          .setDescription(
            `**ENGLISH**\n> Hey there ${message.author.username}!, here is some useful information about me.\n> ⁉️ • **How to view all commands?**\n> Either use **/help** or do / to view a list of all the commands!\n\n**INDONESIA**\n> Halo ${message.author.username}!, berikut beberapa informasi berguna tentang saya.\n> ⁉️ • **Bagaimana cara melihat semua perintah?**\n> Gunakan **/help** atau lakukan / untuk melihat daftar dari semua perintah!`)
            .addFields({ name: `**> 🏡 • Servers:**`, value: `> ${client.guilds.cache.size}`, inline: true })
            .addFields({ name: `**👥 • Users:**`, value: `${client.users.cache.size}`, inline: true})
            .addFields({ name: `**💣 • Commands:**`, value: `${client.commands.size}`, inline: true})
            .setTimestamp()
            .setThumbnail(`https://media.discordapp.net/attachments/1216712873024159876/1219720695827923096/dongo_2.png`)
            .setImage('https://media.discordapp.net/attachments/1216712873024159876/1219722307790966864/Pink__Blue_Futuristic_Gaming_Channel_Youtube_Intro_1500_x_370_px_1200_x_100_px.gif')
            .setFooter({text: `Requested by ${message.author.username}.`})
      const buttons = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setEmoji("➕")
            .setLabel("Invite")
            .setURL("https://discord.com/api/oauth2/authorize?client_id=1219718308668899410&permissions=8&scope=applications.commands%20bot")
            .setStyle(ButtonStyle.Link));
            return message.reply({ embeds: [pingEmbed], components: [buttons] });
  }
  });  


//audit
const Audit_Log = require('./database/models/auditlog');

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isStringSelectMenu()) return;

    if (interaction.customId === 'selectLoggingLevel') {
      const selectedLevels = interaction.values;
      const guildId = interaction.guildId;

      await Audit_Log.findOneAndUpdate(
        { Guild: guildId },
        { LogLevel: selectedLevels },
        { new: true, upsert: true }
      );

      const updatedSettings = await Audit_Log.findOne({ Guild: guildId });
      const updatedSettingsList = updatedSettings.LogLevel.length > 0
        ? updatedSettings.LogLevel.map(level => `• ${level}`).join('\n')
        : 'None selected.';

      const updatedEmbed = new EmbedBuilder()
        .setColor("Blue")
        .setTitle("🔧 Audit Log Settings Updated")
        .setDescription(`Your audit log settings have been updated.\n\n**Current Logging Levels:**\n${updatedSettingsList}`)
        .setThumbnail("https://media.discordapp.net/attachments/1193609483268653097/1218914858628550777/Blue_and_White_Circle_Surfing_Club_Logo_1.png")
        .setFooter({ text: "Audit log configuration." })
        .setTimestamp();

        await interaction.update({ embeds: [updatedEmbed] });
    }
  });

  client.on('interactionCreate', async (interaction) => {

    if (!interaction.isStringSelectMenu()) return;

    if (interaction.customId === "selectAuditLogChannel") {
      if (!interaction.guild) return interaction.reply({ content: "This command can only be used in a server.", ephemeral: true });

      const selectedChannelId = interaction.values[0];

      try {
        let data = await Audit_Log.findOne({ Guild: interaction.guild.id });

        if (!data) {
          config = await Audit_Log.create({
            Guild: interaction.guild.id,
            Channel: selectedChannelId,
            LogLevel: []
          });
        } else {
          data.Channel = selectedChannelId;
          await data.save();
        }

        await interaction.reply({ content: `Audit log channel has been updated to <#${selectedChannelId}>.`, ephemeral: true });
      } catch (error) {
        console.error("Error updating the audit log channel: ", error);
        await interaction.reply({ content: "There was an error while updating the audit log channel. Please try again later.", ephemeral: true });
      }
    }
  });
  client.on(Events.ChannelUpdate, async (oldChannel, newChannel) => {
    if (!newChannel.guild) return;

    const auditLogConfig = await Audit_Log.findOne({ Guild: newChannel.guild.id });
    if (!auditLogConfig || !Array.isArray(auditLogConfig.LogLevel) || !auditLogConfig.LogLevel.includes("channelUpdate")) return;

    const logChannel = newChannel.guild.channels.cache.get(auditLogConfig.Channel);
    if (!logChannel) return;

    let changes = [];

    if (oldChannel.name !== newChannel.name) {
      changes.push(`Name from **${oldChannel.name}** to **${newChannel.name}**`);
    }

    if (oldChannel.topic !== newChannel.topic) {
      changes.push(`Topic updated`);
    }

    if (oldChannel.nsfw !== newChannel.nsfw) {
      changes.push(`NSFW status changed to **${newChannel.nsfw ? 'Yes' : 'No'}**`);
    }

    if (oldChannel.rateLimitPerUser !== newChannel.rateLimitPerUser) {
      changes.push(`Slow mode set to **${newChannel.rateLimitPerUser}** seconds`);
    }

    if (oldChannel.rawPosition !== newChannel.rawPosition) {
      changes.push(`Position changed`);
    }

    if (JSON.stringify(oldChannel.permissionOverwrites.cache) !== JSON.stringify(newChannel.permissionOverwrites.cache)) {
      changes.push(`Permissions modified`);
    }

    if (changes.length === 0) return;

    const embed = new EmbedBuilder()
      .setTitle("LOGS | Channel Updated")
      .setColor("#3498DB")
      .setDescription(`**${newChannel.name}** was updated:\n- ${changes.join('\n- ')}`)
      .setTimestamp()
      .setFooter({ text: "Channel Update" })
      .setThumbnail("https://media.discordapp.net/attachments/1193609483268653097/1218914858628550777/Blue_and_White_Circle_Surfing_Club_Logo_1.png")

    await logChannel.send({ embeds: [embed] });
  });
  client.on(Events.MessageDelete, async (message) => {
    if (!message.guild || message.system) return;
    if (message.author.bot) {
      return
    }

    const auditLogConfig = await Audit_Log.findOne({ Guild: message.guild.id });
    if (!auditLogConfig || !Array.isArray(auditLogConfig.LogLevel) || auditLogConfig.LogLevel.length === 0) return;

    if (auditLogConfig.LogLevel.includes("messageDelete")) {
        const logChannel = client.channels.cache.get(auditLogConfig.Channel);
        if (logChannel) {
            let contentPreview = message.content.slice(0, 1024);
            if (!contentPreview) contentPreview = "No text content (could be an embed or attachment)";

            const embed = new EmbedBuilder()
                .setTitle("LOGS | Message Deleted")
                .setColor("Blue")
                .addFields([
                    { name: "👤 Author", value: message.author.tag, inline: true },
                    { name: "📚 Channel", value: `<#${message.channel.id}>`, inline: true },
                    { name: "📄 Content", value: contentPreview, inline: false },
                ])
                .setDescription(`A message was deleted.`)
                .setTimestamp()
                .setFooter({ text: "Message Deletion" })
                .setThumbnail("https://media.discordapp.net/attachments/1193609483268653097/1218914858628550777/Blue_and_White_Circle_Surfing_Club_Logo_1.png")

            await logChannel.send({ embeds: [embed] });
        }
    }
  });
  client.on(Events.MessageCreate, async (message) => {
    if (!message.guild || message.system) return;
    if (message.author.bot) {
      return
    }

    const auditLogConfig = await Audit_Log.findOne({ Guild: message.guild.id });
    if (!auditLogConfig || !Array.isArray(auditLogConfig.LogLevel) || auditLogConfig.LogLevel.length === 0) return;

    if (auditLogConfig.LogLevel.includes("messageCreate")) {
        const logChannel = client.channels.cache.get(auditLogConfig.Channel);
        if (logChannel) {
            let contentPreview = message.content.slice(0, 1024);
            if (!contentPreview) contentPreview = "No text content (could be an embed or attachment)";

            const embed = new EmbedBuilder()
                .setTitle("LOGS | Message Created")
                .setColor("Blue")
                .addFields([
                    { name: "👤 Author", value: message.author.tag, inline: true },
                    { name: "📚 Channel", value: `<#${message.channel.id}>`, inline: true },
                    { name: "📄 Content", value: contentPreview, inline: false },
                ])
                .setDescription(`A message was created.`)
                .setTimestamp()
                .setFooter({ text: "Message Creation" })
                .setThumbnail("https://media.discordapp.net/attachments/1193609483268653097/1218914858628550777/Blue_and_White_Circle_Surfing_Club_Logo_1.png")

            await logChannel.send({ embeds: [embed] });
        }
    }
  });
  client.on(Events.ChannelCreate, async (channel) => {
    if (!channel.guild) return;

    const auditLogConfig = await Audit_Log.findOne({ Guild: channel.guild.id });
    if (!auditLogConfig || !Array.isArray(auditLogConfig.LogLevel) || auditLogConfig.LogLevel.length === 0) return;

    if (auditLogConfig.LogLevel.includes("channelCreate")) {
        const logChannel = client.channels.cache.get(auditLogConfig.Channel);
        if (logChannel) {
            const embed = new EmbedBuilder()
                .setTitle("LOGS | Channel Created")
                .setColor("Blue")
                .addFields([
                    { name: "📚 Channel", value: `<#${channel.id}>`, inline: true }])
                .setThumbnail("https://media.discordapp.net/attachments/1193609483268653097/1218914858628550777/Blue_and_White_Circle_Surfing_Club_Logo_1.png")
                .setDescription(`A new channel was created.`)
                .setTimestamp()
                .setFooter({ text: "Channel Creation" });

            await logChannel.send({ embeds: [embed] });
        }
    }
  });
  client.on(Events.ChannelDelete, async (channel) => {
    if (!channel.guild) return;

    const auditLogConfig = await Audit_Log.findOne({ Guild: channel.guild.id });
    if (!auditLogConfig || !Array.isArray(auditLogConfig.LogLevel) || auditLogConfig.LogLevel.length === 0) return;

    if (auditLogConfig.LogLevel.includes("channelDelete")) {
        const logChannel = client.channels.cache.get(auditLogConfig.Channel);
        if (logChannel) {
            const embed = new EmbedBuilder()
                .setTitle("LOGS | Channel Deleted")
                .setColor("Blue")
                .addFields([
                  { name: "📚 Channel", value: `<#${channel.id}>`, inline: true }])
                .setThumbnail("https://media.discordapp.net/attachments/1193609483268653097/1218914858628550777/Blue_and_White_Circle_Surfing_Club_Logo_1.png")
                .setDescription(`A channel was deleted.`)
                .setTimestamp()
                .setFooter({ text: "Channel Deletion" });

            await logChannel.send({ embeds: [embed] });
        }
    }
  });
  client.on(Events.GuildMemberRemove, async (member) => {
    const auditLogConfig = await Audit_Log.findOne({ Guild: member.guild.id });
    if (!auditLogConfig || !Array.isArray(auditLogConfig.LogLevel) || auditLogConfig.LogLevel.length === 0) return;

    if (auditLogConfig.LogLevel.includes("guildMemberRemove")) {
        const logChannel = client.channels.cache.get(auditLogConfig.Channel);
        if (logChannel) {
            const embed = new EmbedBuilder()
                .setTitle("LOGS | Member Left")
                .setColor("#ff0000")
                .addFields([
                    { name: "👤 Member", value: `${member.user.tag} (${member.id})`, inline: false },
                    { name: "Username", value: member.user.username, inline: true },
                    { name: "Discriminator", value: `#${member.user.discriminator}`, inline: true },
                ])
                .setDescription(`A member has left or was kicked from the guild.`)
                .setThumbnail("https://media.discordapp.net/attachments/1193609483268653097/1218914858628550777/Blue_and_White_Circle_Surfing_Club_Logo_1.png")
                .setTimestamp()
                .setFooter({ text: "Member Removal" });

            if (member.user.displayAvatarURL()) {
                embed.setThumbnail(member.user.displayAvatarURL());
            }

            await logChannel.send({ embeds: [embed] });
        }
    }
  });

  client.on('roleCreate', async (role) => {
    const auditLogConfig = await Audit_Log.findOne({ Guild: role.guild.id });
    if (!auditLogConfig || !Array.isArray(auditLogConfig.LogLevel) || auditLogConfig.LogLevel.length === 0 || !auditLogConfig.LogLevel.includes("roleCreate")) return;

    const logChannel = role.guild.channels.cache.get(auditLogConfig.Channel);
    if (!logChannel) return;

    const auditLogs = await role.guild.fetchAuditLogs({ type: Events.RoleCreate, limit: 1 });
    const roleCreateLog = auditLogs.entries.first();
    let executor = "Unknown";
    if (roleCreateLog) {
        const target = roleCreateLog.target;
        if (target && target.id === role.id) {
            executor = roleCreateLog.executor.tag;
        }
    }

    const embed = new EmbedBuilder()
        .setTitle("LOGS | Role Created")
        .setColor("Blue")
        .addFields([
            { name: "Role Name", value: role.name, inline: true },
            { name: "Role ID", value: role.id, inline: true },
            { name: "Created By", value: executor, inline: false },
            { name: "Permissions", value: role.permissions.toString() ? "No Permissions Added" : role.permissions.toString(), inline: false },
            { name: "Mentionable", value: role.mentionable ? "Yes" : "No", inline: true },
            { name: "Hoisted", value: role.hoist ? "Yes" : "No", inline: true },
        ])
        .setTimestamp()
        .setThumbnail("https://media.discordapp.net/attachments/1193609483268653097/1218914858628550777/Blue_and_White_Circle_Surfing_Club_Logo_1.png")
        .setFooter({ text: "Role Creation" });

    await logChannel.send({ embeds: [embed] });
  });
  client.on('roleUpdate', async (oldRole, newRole) => {
      const auditLogConfig = await Audit_Log.findOne({ Guild: newRole.guild.id });
      if (!auditLogConfig || !Array.isArray(auditLogConfig.LogLevel) || auditLogConfig.LogLevel.length === 0 || !auditLogConfig.LogLevel.includes("roleUpdate")) return;

      const logChannel = await newRole.guild.channels.fetch(auditLogConfig.Channel).catch(console.error);
      if (!logChannel) return;

      let changes = [];

      if (oldRole.name !== newRole.name) {
        changes.push({ name: "Role Name", value: `From "${oldRole.name}" to "${newRole.name}"` });
      }

      const oldPermissions = new PermissionsBitField(oldRole.permissions.bitfield);
      const newPermissions = new PermissionsBitField(newRole.permissions.bitfield);
      const addedPermissions = newPermissions.remove(oldPermissions).toArray();
      const removedPermissions = oldPermissions.remove(newPermissions).toArray();

      if (addedPermissions.length > 0) {
        changes.push({ name: "Added Permissions", value: addedPermissions.join(", ") });
      }

      if (removedPermissions.length > 0) {
        changes.push({ name: "Removed Permissions", value: removedPermissions.join(", ") });
      }

      if (oldRole.mentionable !== newRole.mentionable) {
        changes.push({ name: "Mentionable", value: `Changed to "${newRole.mentionable ? 'Yes' : 'No'}"` });
      }

      if (oldRole.hoist !== newRole.hoist) {
        changes.push({ name: "Hoisted", value: `Changed to "${newRole.hoist ? 'Yes' : 'No'}"` });
      }

      if (changes.length === 0) return;

      const embed = new EmbedBuilder()
        .setTitle("LOGS | Role Updated")
        .setColor("Blue") 
        .setThumbnail("https://media.discordapp.net/attachments/1193609483268653097/1218914858628550777/Blue_and_White_Circle_Surfing_Club_Logo_1.png")
        .addFields(changes)
        .setTimestamp()
        .setFooter({ text: "Role Update" });

      await logChannel.send({ embeds: [embed] });
  });
  client.on('messageUpdate', async (oldMessage, newMessage) => {
    if (oldMessage.author.bot || oldMessage.content === newMessage.content) return;

      const auditLogConfig = await Audit_Log.findOne({ Guild: newMessage.guild.id });
      if (!auditLogConfig || !Array.isArray(auditLogConfig.LogLevel) || auditLogConfig.LogLevel.length === 0 || !auditLogConfig.LogLevel.includes("messageUpdate")) return;

      const logChannel = await newMessage.guild.channels.fetch(auditLogConfig.Channel).catch(console.error);
      if (!logChannel) return;

      const embed = new EmbedBuilder()
        .setTitle("LOGS | Message Edited")
        .setColor("Blue")
        .setThumbnail("https://media.discordapp.net/attachments/1193609483268653097/1218914858628550777/Blue_and_White_Circle_Surfing_Club_Logo_1.png")
        .addFields([
          { name: "Author", value: `${newMessage.author.tag}`, inline: true },
          { name: "Channel", value: `${newMessage.channel}`, inline: true },
          { name: "Before", value: oldMessage.content ? oldMessage.content.substring(0, 1024) : "No Content / Embed", inline: true },
          { name: "After", value: newMessage.content.substring(0, 1024), inline: true },
          { name: "Message Link", value: `[Jump to message](${newMessage.url})`, inline: true },
        ])
        .setTimestamp()
        .setFooter({ text: "Message Update" });

      await logChannel.send({ embeds: [embed] });
  });
  client.on(Events.VoiceStateUpdate, async (oldState, newState) => {
    if (!newState.guild) return;

    const auditLogConfig = await Audit_Log.findOne({ Guild: newState.guild.id });
    if (!auditLogConfig || !Array.isArray(auditLogConfig.LogLevel) || !auditLogConfig.LogLevel.includes("voiceChannelActivity")) return;

    const logChannelId = auditLogConfig.Channel;
    const logChannel = newState.guild.channels.cache.get(logChannelId);
    if (!logChannel) return;

    let description = "";
    let memberCount = newState.channel ? newState.channel.members.size : 0;

    if (!oldState.channel && newState.channel) {
        description = `${newState.member.user.tag} joined **${newState.channel.name}**. \nMembers now: **${memberCount}**.`;
    }
    else if (oldState.channel && !newState.channel) {
        memberCount = oldState.channel.members.size;
        description = `${oldState.member.user.tag} left **${oldState.channel.name}**.`;
    }
    else if (oldState.channel && newState.channel && oldState.channel.id !== newState.channel.id) {
        description = `${newState.member.user.tag} switched from **${oldState.channel.name}** to **${newState.channel.name}**.\nMembers now in new channel: **${memberCount}**.`;
    }

    if (description) {
        const embed = new EmbedBuilder()
            .setTitle("Voice Channel Activity")
            .setColor("#3498DB")
            .setThumbnail("https://media.discordapp.net/attachments/1193609483268653097/1218914858628550777/Blue_and_White_Circle_Surfing_Club_Logo_1.png")
            .setDescription(description)
            .setTimestamp()
            .setFooter({ text: "Voice Channel Update" });

        await logChannel.send({ embeds: [embed] });
    }
  });
  client.on(Events.InviteCreate, async (invite) => {
    if (!invite.guild) return;

    const auditLogConfig = await Audit_Log.findOne({ Guild: invite.guild.id });
    if (!auditLogConfig || !Array.isArray(auditLogConfig.LogLevel) || !auditLogConfig.LogLevel.includes("inviteCreate")) return;

    const logChannelId = auditLogConfig.Channel;
    const logChannel = invite.guild.channels.cache.get(logChannelId);
    if (!logChannel) return;

    const expire = invite.expiresAt ? `<t:${Math.floor(invite.expiresAt.getTime() / 1000)}:F>` : 'Never';

    const embed = new EmbedBuilder()
      .setTitle("LOGS | 🔗 Invite Created")
      .setColor("Blue")
      .setDescription(`An invite has been created by **${invite.inviter.tag}**.`)
      .setThumbnail("https://media.discordapp.net/attachments/1193609483268653097/1218914858628550777/Blue_and_White_Circle_Surfing_Club_Logo_1.png")
      .addFields(
        { name: "Channel", value: `${invite.channel.name}`, inline: true },
        { name: "Code", value: invite.code, inline: true },
        { name: "Expires", value: expire, inline: true },
        { name: "Max Uses", value: `${invite.maxUses === 0 ? 'Unlimited' : invite.maxUses}`, inline: true },
        { name: "Temporary", value: `${invite.temporary ? 'Yes' : 'No'}`, inline: true },
        { name: "Max Age", value: `${invite.maxAge === 0 ? 'Unlimited' : `${invite.maxAge} seconds`}`, inline: true }
      )
      .setFooter({ text: `Invite ID: ${invite.code}` })
      .setTimestamp();

    await logChannel.send({ embeds: [embed] });
  });
  client.on(Events.EmojiCreate, async (emoji) => {
    const auditLogConfig = await Audit_Log.findOne({ Guild: emoji.guild.id });
    if (!auditLogConfig || !Array.isArray(auditLogConfig.LogLevel) || !auditLogConfig.LogLevel.includes("emojiCreate")) return;

    const logChannel = emoji.guild.channels.cache.get(auditLogConfig.Channel);
    if (!logChannel) return;

    const embed = new EmbedBuilder()
      .setTitle("🆕 Emoji Created")
      .setColor("Blue")
      .setDescription(`A new emoji has been added to the guild.`)
      .addFields(
        { name: "Name", value: emoji.name, inline: true },
        { name: "ID", value: emoji.id, inline: true },
        { name: "Animated", value: emoji.animated ? 'Yes' : 'No', inline: true }
      )
      .setThumbnail("https://media.discordapp.net/attachments/1193609483268653097/1218914858628550777/Blue_and_White_Circle_Surfing_Club_Logo_1.png")
      .setTimestamp();

    await logChannel.send({ embeds: [embed] });
  });
  client.on(Events.EmojiUpdate, async (oldEmoji, newEmoji) => {
    const auditLogConfig = await Audit_Log.findOne({ Guild: newEmoji.guild.id });
    if (!auditLogConfig || !Array.isArray(auditLogConfig.LogLevel) || !auditLogConfig.LogLevel.includes("emojiUpdate")) return;

    const logChannel = newEmoji.guild.channels.cache.get(auditLogConfig.Channel);
    if (!logChannel) return;

    const changes = [];
    if (oldEmoji.name !== newEmoji.name) {
      changes.push(`Name: ${oldEmoji.name} ➔ ${newEmoji.name}`);
    }

    const embed = new EmbedBuilder()
      .setTitle("🔧 Emoji Updated")
      .setColor("Blue")
      .setDescription(`An emoji has been updated.`)
      .addFields(
        { name: "Changes", value: changes.join('\n'), inline: false }
      )
      .setThumbnail("https://media.discordapp.net/attachments/1193609483268653097/1218914858628550777/Blue_and_White_Circle_Surfing_Club_Logo_1.png")
      .setTimestamp();

    await logChannel.send({ embeds: [embed] });
  });
  client.on(Events.EmojiDelete, async (emoji) => {
    const auditLogConfig = await Audit_Log.findOne({ Guild: emoji.guild.id });
    if (!auditLogConfig || !Array.isArray(auditLogConfig.LogLevel) || !auditLogConfig.LogLevel.includes("emojiDelete")) return;

    const logChannel = emoji.guild.channels.cache.get(auditLogConfig.Channel);
    if (!logChannel) return;

    const embed = new EmbedBuilder()
      .setTitle("❌ Emoji Deleted")
      .setColor("Blue")
      .setDescription(`An emoji has been removed from the guild.`)
      .addFields(
        { name: "Name", value: emoji.name, inline: true },
        { name: "ID", value: emoji.id, inline: true }
      )
      .setThumbnail("https://media.discordapp.net/attachments/1193609483268653097/1218914858628550777/Blue_and_White_Circle_Surfing_Club_Logo_1.png")
      .setTimestamp();

    await logChannel.send({ embeds: [embed] });
  });
  client.on(Events.GuildMemberUpdate, async (oldMember, newMember) => {
    const guild = newMember.guild;

    const auditLogConfig = await Audit_Log.findOne({ Guild: guild.id });
    if (!auditLogConfig || !Array.isArray(auditLogConfig.LogLevel) || !auditLogConfig.LogLevel.includes("userUpdates")) return;

    const logChannelId = auditLogConfig.Channel;
    const logChannel = guild.channels.cache.get(logChannelId);
    if (!logChannel) return;

    let description = "**User Update Detected**\n";
    let fieldsChanged = false;

    if (oldMember.nickname !== newMember.nickname) {
      description += `\n**Nickname Changed**\nFrom \`${oldMember.nickname || 'None'}\` to \`${newMember.nickname || 'None'}\``;
      fieldsChanged = true;
    }

    const oldRoles = oldMember.roles.cache;
    const newRoles = newMember.roles.cache;

    const addedRoles = newRoles.filter(role => !oldRoles.has(role.id));
    const removedRoles = oldRoles.filter(role => !newRoles.has(role.id));

    if (addedRoles.size > 0) {
      description += `\n**Roles Added:** ${addedRoles.map(role => role.toString()).join(", ")}`;
      fieldsChanged = true;
    }
    if (removedRoles.size > 0) {
      description += `\n**Roles Removed:** ${removedRoles.map(role => role.toString()).join(", ")}`;
      fieldsChanged = true;
    }

    if (oldMember.communicationDisabledUntilTimestamp !== newMember.communicationDisabledUntilTimestamp) {
      const timeoutStatus = newMember.communicationDisabledUntilTimestamp ? `until <t:${Math.floor(newMember.communicationDisabledUntilTimestamp / 1000)}:f>` : 'removed';
      description += `\n**Timeout**\nTimeout ${timeoutStatus}`;
      fieldsChanged = true;
    }

    if (!fieldsChanged) return;

    const embed = new EmbedBuilder()
      .setTitle(`User Update - ${newMember.user.tag}`)
      .setColor("#3498db")
      .setDescription(description)
      .setTimestamp()
      .setThumbnail("https://media.discordapp.net/attachments/1193609483268653097/1218914858628550777/Blue_and_White_Circle_Surfing_Club_Logo_1.png")
      .setFooter({ text: `User ID: ${newMember.id}` });

    await logChannel.send({ embeds: [embed] });
  });

  //help   //help   //help   //help   //help   //help   //help   //help   //help   //help   //help   //help   //help   //help   //help   //help   

  client.on(Events.InteractionCreate, async interaction => {
 
    const helprow2 = new ActionRowBuilder()
        .addComponents(
 
            new SelectMenuBuilder()
            .setMinValues(1)
            .setMaxValues(1)
            .setCustomId('selecthelp')
            .setPlaceholder('• Select a menu')
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
 
    if (!interaction.isSelectMenu()) return;
    if (interaction.customId === 'selecthelp') {
        let choices = "";
 
        const centerembed = new EmbedBuilder()
        .setColor('#10a9eb')
        .setTimestamp()
        .setTitle('Semua Bantuan')
        .setAuthor({ name: `🕊️ Help Toolbox` })
        .setFooter({ text: `🕊️ Help Center` })
        .setURL('https://b.top4top.io/p_30016ukf21.png')
        .setThumbnail('https://b.top4top.io/p_30016ukf21.png')
        .setImage("https://media.discordapp.net/attachments/1216712873024159876/1219722307790966864/Pink__Blue_Futuristic_Gaming_Channel_Youtube_Intro_1500_x_370_px_1200_x_100_px.gif")
        .addFields({ name: `• Help Center`, value: `> Menampilkan menu ini.` })
        .addFields({ name: `• Audit Log`, value: `> Dapatkan informasi tentang Log Audit.` })
        .addFields({ name: `• welcomer`, value: `> Navigasikan ke halaman welcomer.` })
        .addFields({ name: `• Commands`, value: `> Dapatkan informasi tentang perintah.` })
 
        interaction.values.forEach(async (value) => {
            choices += `${value}`;
 
            if (value === 'helpcenter') {
 
                await interaction.update({ embeds: [centerembed] });
            }
 
            if (value === 'ticketpage') {
 
                const ticketembed = new EmbedBuilder()
                    .setColor('#10a9eb')
                    .setTimestamp()
                    .setTitle('Audit Page')
                    .setURL('https://b.top4top.io/p_30016ukf21.png')
                    .setThumbnail('https://b.top4top.io/p_30016ukf21.png')
                    .setDescription('```Tujuannya untuk memantau kinerja Server.\nLog dapat digunakan untuk memantau kinerja server.\nDengan memeriksa log administrator bisa mengetahui apakah ada masalah dengan server.```')
                    .setAuthor({ name: `🚨 Audit Toolbox` })
                    .setFooter({ text: `🚨 Audit Page` })
                    .setImage("https://media.discordapp.net/attachments/1216712873024159876/1219722307790966864/Pink__Blue_Futuristic_Gaming_Channel_Youtube_Intro_1500_x_370_px_1200_x_100_px.gif")
                    .addFields({ name: `• Audit Log`, value: `> Log Audit adalah cara logger yang keren.\n> - Untuk membuat digunakan **/auditlog-setup**!\n> - Untuk menghapus digunakan **/auditlog-delete**` });
 
                await interaction.update({ embeds: [ticketembed] });
            }

            if (value === 'welcomer') {
 
              const ticketembed = new EmbedBuilder()
                  .setColor('#10a9eb')
                  .setTimestamp()
                  .setTitle('welcomer Page')
                  .setURL('https://b.top4top.io/p_30016ukf21.png')
                  .setThumbnail('https://b.top4top.io/p_30016ukf21.png')
                  .setDescription('```Tujuannya untuk memantau member join.\nWelcomer juga dapat mempercantik server anda.```')
                  .setAuthor({ name: `⚙️ Welcome Toolbox` })
                  .setFooter({ text: `⚙️ Welcome Page` })
                  .setImage("https://media.discordapp.net/attachments/1216712873024159876/1219722307790966864/Pink__Blue_Futuristic_Gaming_Channel_Youtube_Intro_1500_x_370_px_1200_x_100_px.gif")
                  .addFields({ name: `• Welcomer`, value: '> - **!welcome set [Pada Channel Welcomenya | Ditambah channelid]**\n> example:\n> ```!welcome set 1199059739263369427```\n> - **!welcome edit [Isi pesan welcome]**\n> example:\n> ```Hallo Selamat Datang```\n> - **!welcome disable**\n> ```Untuk Disable Welcome```' });

              await interaction.update({ embeds: [ticketembed] });
          }
 
            if (value === 'commands') {
 
                const commandpage1 = new EmbedBuilder()
                .setColor('#10a9eb')
                .setTimestamp()
                .setTitle('Commands Page 1')
                .setURL('https://b.top4top.io/p_30016ukf21.png')
                .setThumbnail('https://b.top4top.io/p_30016ukf21.png')
                .setAuthor({ name: `🕊️ Help Toolbox` })
                .setFooter({ text: `🕊️ Commands: Page 1` })
                .setImage('https://media.discordapp.net/attachments/1193609483268653097/1220139513666469899/Pink__Blue_Futuristic_Gaming_Channel_Youtube_Intro_1500_x_370_px_1200_x_100_px.png')
                .addFields({ name: `• /auditlog-setup`, value: `> Membuat Logger Pada Server!` })
                .addFields({ name: `• /auditlog-delete`, value: `> Menghapus Logger Pada Server..` })
                .addFields({ name: `• /create-embed`, value: `> Membuat Embed Server..` })
                .addFields({ name: `• /setverify`, value: `> Mengatur Verifikasi Server Anda..` })
                .addFields({ name: `• /chatgpt`, value: `> Mencari Pertanyaan..` })
 
                const commandpage2 = new EmbedBuilder()
                .setColor('#10a9eb')
                .setTimestamp()
                .setTitle('Commands Page 2')
                .setURL('https://b.top4top.io/p_30016ukf21.png')
                .setImage('https://media.discordapp.net/attachments/1193609483268653097/1220139513666469899/Pink__Blue_Futuristic_Gaming_Channel_Youtube_Intro_1500_x_370_px_1200_x_100_px.png')
                .setThumbnail('https://b.top4top.io/p_30016ukf21.png')
                .setAuthor({ name: `🕊️ Help Toolbox` })
                .setFooter({ text: `🕊️ Commands: Page 2` })
                .addFields({ name: `• /purge`, value: `> Menghapus Pesan..` })
                .addFields({ name: `• /help..`, value: `> Meminta Bantuan..` })
                .addFields({ name: `• !setupwelcome`, value: `> Mengatur Welcomer Pada Server.` })
                .addFields({ name: `• !welcome set`, value: `> setup welcome` })
                .addFields({ name: `• !welcome disable`, value: `> delete welcome..` })
 
                const commandbuttons = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                    .setCustomId('Help')
                    .setDisabled(false)
                    .setStyle(ButtonStyle.Primary)
	                  .setEmoji(`<:emoj12:1220131454420258816>`),

                    new ButtonBuilder()
                        .setCustomId('pageleft')
                        .setDisabled(true)
                        .setEmoji(`<:emoj10:1220131448930173110>`)
                        .setStyle(ButtonStyle.Success),

                    new ButtonBuilder()
                    .setCustomId('pageright')
                    .setEmoji(`<:emoj11:1220131452134359060>`)
                    .setStyle(ButtonStyle.Success),

                    new ButtonBuilder()
                    .setLabel('Developer')
	                  .setEmoji(`<:emoj5:1220131434681860157>`)
	                  .setURL('https://discord.com/users/1005523266376564846')
	                  .setStyle(ButtonStyle.Link)
                )
 
                const commandbuttons1 = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                        .setCustomId('Help1')
                        .setDisabled(false)
                        .setStyle(ButtonStyle.Primary)
                        .setEmoji(`<:emoj12:1220131454420258816>`),

                        new ButtonBuilder()
                        .setCustomId('pageleft1')
                        .setDisabled(false)
                        .setEmoji(`<:emoj10:1220131448930173110>`)
                        .setStyle(ButtonStyle.Success),
 
                        new ButtonBuilder()
                        .setCustomId('pageright1')
                        .setDisabled(true)
                        .setEmoji(`<:emoj11:1220131452134359060>`)
                        .setStyle(ButtonStyle.Success),

                        new ButtonBuilder()
                        .setLabel('Developer')
                        .setEmoji(`<:emoj5:1220131434681860157>`)
	                      .setURL('https://discord.com/users/1005523266376564846')
	                      .setStyle(ButtonStyle.Link)
                )
 
                interaction.update({ embeds: [commandpage1], components: [commandbuttons] });
                const commandsmessage = interaction.message;
                const collector = commandsmessage.createMessageComponentCollector({ componentType: ComponentType.Button });
 
                collector.on('collect', async i => {
 
                    if (i.customId === 'Help') {
 
                      await i.update({ embeds: [centerembed], components: [helprow2] });
 
                    }
 
                    if (i.customId === 'pageleft') {
 
                        await i.update({ embeds: [commandpage1], components: [commandbuttons] });
 
                    }
 
                    if (i.customId === 'pageright') {
 
                        await i.update({ embeds: [commandpage2], components: [commandbuttons1] });
 
                    }
                    
                    if (i.customId === 'Help1') {
 
                      await i.update({ embeds: [centerembed], components: [helprow2] });

                  }
 
                    if (i.customId === 'pageright1') {
 
                        await i.update({ embeds: [commandpage2], components: [commandbuttons1] });
 
                    }
 
                    if (i.customId === 'pageleft1') {
 
                        await i.update({ embeds: [commandpage1], components: [commandbuttons] });
 
                    }
                })
            }
        })
    }
})
//end help
const JSONdb = require("simple-json-db");
const db = new JSONdb("./database.json");


//welcome
client.on("messageCreate", (message) => {
  if (message.content.startsWith("!welcome set")) {
    const [command, set, id, ...args] = message.content.slice(1).split(" ");
    switch (id) {
      case "here":
        if (
          message.member.permissions.has("Administrator")
        ) {
          const channelid = message.channel.id;
          db.set(`welcomechannelid-${message.guild.id}`, channelid);
          db.set(`guildsetupdone-${message.guild.id}`, true);
          message.reply("You've successfully set up the welcome system.");
        } else if (
          !message.member.permissions.has("Administrator") 
        ) {
          message.reply(
            "Looks like you dont have the correct permissions to use this command."
          );
        }
        break;

      case id:
        if (
          message.member.permissions.has("Administrator")
        ) {
          if (!message.guild.channels.cache.get(id)) {
            message.reply(
              "Your channel could not be found. Make sure you provided a valid ChannelID. If you dont know how to get a channel ID, please visit this link: https://support.discord.com/hc/en-us/articles/206346498-Where-can-I-find-my-User-Server-Message-ID-]"
            );
          } else if (message.guild.channels.cache.get(id)) {
            const channelid = message.channel.id;
            db.set(`welcomechannelid-${message.guild.id}`, channelid);
            db.set(`guildsetupdone-${message.guild.id}`, true);
            message.reply("You've successfully set up the welcome system.");
          }
        } else if (
          !message.member.permissions.has("Administrator")
        ) {
            message.reply("Looks like you dont have the correct permissions to use this command.");
        }
        break;
    }
  }
});

client.on('messageCreate', message => {
    if (message.content === ('!welcome disable')) {
        if (message.member.permissions.has("Administrator")) {
            if (db.has(`guildsetupdone-${message.guild.id}`) == true) {
            db.delete(`welcomechannelid-${message.guild.id}`);
            db.delete(`guildsetupdone-${message.guild.id}`);
            db.delete(`guildwelcomemessage-${message.guild.id}`);
            message.reply('You have successfully disabled the welcome system.') 
            
            }
         else if (db.has(`guildsetupdone-${message.guild.id}`) == false){
            message.reply('Looks like the welcome system isnt set up in this server.'); 
        }
        
        } else if(!message.member.permissions.has("Administrator")) {
            message.reply("Looks like you dont have the correct permissions to use this command.");
        }
    }
})

client.on('messageCreate', message => {
    if (message.content.startsWith('!welcome edit')) {
        if (message.member.permissions.has('Administrator')) {
            const [command, sub, text, ...args] = message.content.slice(1).split(" ");
            db.set(`guildwelcomemessage-${message.guild.id}`, text);
            message.reply('Your welcome message has been saved!');
        } else {
            message.reply('Looks like you dont have the correct permissions to use this command.')
        }
    }
})

client.on('guildMemberAdd', member => {
    if (db.get(`guildsetupdone-${member.guild.id}`) == undefined) {
        return;
    } else if (db.get(`guildsetupdone-${member.guild.id}`) == true) {
        const welcomeChannel = db.get(`welcomechannelid-${member.guild.id}`);
        const welcomeMessage = db.get(`guildwelcomemessage-${member.guild.id}`);
        
        const welcomeEmbed = new EmbedBuilder()
        .setTitle(`**Welcome to the server ${member.user.displayName}!**`)
        .setDescription(`${member}\n> \`\`\`${welcomeMessage}\`\`\``)
        .setColor('#4287f5')
        .setImage("https://media.discordapp.net/attachments/1193609483268653097/1218925616238301305/welcome_2.gif")
        .setThumbnail(member.user.avatarURL())
        .setFooter({ text: 'A new member joined!' })
        .setTimestamp()

        const welcomeChannelGet = member.guild.channels.cache.get(welcomeChannel);
       
        welcomeChannelGet.send({ embeds: [welcomeEmbed] })
    }
})

client.on('messageCreate', message => {
    if(message.content == '!setupwelcome') {
       const embed = new EmbedBuilder()
       .setTitle('Help Section')
       .setDescription('- **!welcome set [Pada Channel Welcomenya | Ditambah channel id]**\nexample:\n```!welcome set 1199059739263369427```\n- **!welcome edit [Isi pesan welcome]**\nexample:\n```Hallo Selamat Datang```\n- **!welcome disable**\n```Untuk Disable Welcome```')
       .setTimestamp()
       .setColor('Aqua')

       message.channel.send({ embeds: [embed] })
    }
})  
//end welcome

//anticrash
client.on("error", (err) => {
  const ChannelID = "1203148525165092904";
  console.log("Discord API Error:", err);
  const Embed = new EmbedBuilder()
    .setColor("Aqua")
    .setTimestamp()
    .setFooter({ text: "⚠️ Anti Crash system" })
    .setTitle("Error Encountered");
  const Channel = client.channels.cache.get(ChannelID);
  if (!Channel) return;
  Channel.send({
    embeds: [
      Embed.setDescription(
        "**Discord API Error/Catch:\n\n** ```" + err + "```"
      ),
    ],
  });
});

process.on("unhandledRejection", (reason, p) => {
  const ChannelID = "1203148525165092904";
  console.log("Unhandled promise rejection:", reason, p);
  const Embed = new EmbedBuilder()
    .setColor("Aqua")
    .setTimestamp()
    .setFooter({ text: "⚠️ Anti Crash system" })
    .setTitle("Error Encountered");
  const Channel = client.channels.cache.get(ChannelID);
  if (!Channel) return;
  Channel.send({
    embeds: [
      Embed.setDescription(
        "**Unhandled Rejection/Catch:\n\n** ```" + reason + "```"
      ),
    ],
  });
});

process.on("uncaughtException", (err, origin) => {
  const ChannelID = "1203148525165092904";
  console.log("Uncaught Exception:", err, origin);
  const Embed = new EmbedBuilder()
    .setColor("Aqua")
    .setTimestamp()
    .setFooter({ text: "⚠️ Anti Crash system" })
    .setTitle("Error Encountered");
  const Channel = client.channels.cache.get(ChannelID);
  if (!Channel) return;
  Channel.send({
    embeds: [
      Embed.setDescription(
        "**Uncought Exception/Catch:\n\n** ```" + err + "```"
      ),
    ],
  });
});

process.on("uncaughtExceptionMonitor", (err, origin) => {
  const ChannelID = "1203148525165092904";
  console.log("Uncaught Exception Monitor:", err, origin);
  const Embed = new EmbedBuilder()
    .setColor("Aqua")
    .setTimestamp()
    .setFooter({ text: "⚠️ Anti Crash system" })
    .setTitle("Error Encountered");
  const Channel = client.channels.cache.get(ChannelID);
  if (!Channel) return;
  Channel.send({
    embeds: [
      Embed.setDescription(
        "**Uncaught Exception Monitor/Catch:\n\n** ```" + err + "```"
      ),
    ],
  });
});

process.on("warning", (warn) => {
  const ChannelID = "1203148525165092904";
  console.log("Warning:", warn);
  const Embed = new EmbedBuilder()
    .setColor("Aqua")
    .setTimestamp()
    .setFooter({ text: "⚠️ Anti Crash system" })
    .setTitle("Error Encountered");
  const Channel = client.channels.cache.get(ChannelID);
  if (!Channel) return;
  Channel.send({
    embeds: [
      Embed.setDescription(
        "**Warning/Catch:\n\n** ```" + warn + "```"
      ),
    ],
  });
});

//end anticrash
//member counter
client.on("ready", async () => {
  const guild = client.guilds.cache.get("1216702690000638042");

  if (!guild) {
      console.error("Guild not found.");
      return;
  }

  const memberCountChannel = guild.channels.cache.get("1220463500355309590");
  const boostChannel = guild.channels.cache.get("1220463569020256348");

  setInterval(() => {
      if (!guild.available) {
          console.error("Guild not available.");
          return;
      }
      const boostCount = guild.premiumSubscriptionCount;
      const members = guild.memberCount;

      guild.bans
          .fetch()
          .then((bans) => {
              const banCount = bans.size;

              const bots = guild.members.cache.reduce(
                  (acc, member) => (member.user.bot ? acc + 1 : acc),
                  0
              );

              memberCountChannel.setName(`👥 Member: ${members}`);
              boostChannel.setName(`💎 Boosts: ${boostCount}`);

          })
          .catch((error) => {
              console.error("Error fetching bans:", error);
          });
  }, 20000); // Update every 60 seconds
});
//gemini
const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI('AIzaSyAnx6ypCVTI8UgPr2Y3ZXDxm-X7b-SMxYk');
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

const generationConfig = {
  temperature: 0.9,
  topK: 1,
  topP: 1,
  maxOutputTokens: 2048,
};

const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
];

client.on(Events.MessageCreate, async (message) => {
  if (message.author.bot) return;
  if (message.channel.id !== '1216874293867057292') return;
  if (message.content.startsWith("!")) return;

  let conversationLog = [];
  let prevRole = "model";

  try {
    await message.channel.sendTyping();
    let prevMessages = await message.channel.messages.fetch({ limit: 5 });
    prevMessages.reverse();

    prevMessages.forEach((msg, index, array) => {
      if (msg.content.startsWith("!")) return;
      if (msg.author.id !== client.user.id && message.author.bot) return;

      if (index === array.length - 1) {
        return;
      }

      if (msg.author.id == client.user.id && prevRole === "user") {
        prevRole = "model";
        conversationLog.push({
          role: "model",
          parts: [{ text: msg.content }],
        });
      }

      if (msg.author.id == message.author.id && prevRole === "model") {
        prevRole = "user";
        conversationLog.push({
          role: "user",
          parts: [{ text: msg.content }],
        });
      }
    });
		console.log(conversationLog)
    const result = await model.generateContent({
      contents: conversationLog,
      generationConfig,
      safetySettings,
    });

    const finalText = result.response.text();
    const chunkSize = 6000;
    const stringArray = [];
    
    for (let i = 0; i < finalText.length; i += chunkSize) {
      stringArray.push(finalText.substring(i, chunkSize));
    }

    for (string of stringArray) {
      message.reply(string);
    }
  } catch (error) {
    console.log(error);
    message.reply("```Ada yang tidak beres dalam prosedurnya....```");
  }
});

//blacklist link
const blacklistedLinks = [

  'https://',
  'http://',
  'discord.gg',
  'discord.gg/',
  'discord.gg//',
  'dsc.gg',
  'dsc.gg/',
];

client.on(Events.MessageCreate, async message => {

  if (message.author.bot) return false; // Denies bots
  const capitals = message.content.toLocaleLowerCase() 

  blacklistedLinks.forEach((links) => {
      if (capitals.includes(links)) {
        const blacklistedLinksEmbed = new EmbedBuilder()
          .setTitle('🔗 Links are not Allowed')
          .setDescription(`Hey ${message.author}, you cannot send links in ${message.guild.name}`)
          .setColor('NotQuiteBlack')
          .setFooter({ text: 'Deleting in 1 month' })
          .setTimestamp()
          .addFields({ name: 'Deleted Message', value: message.content });
    
        message.delete();
        client.channels.fetch('1216879310657556640').then((logsChannel) => {
          logsChannel.send({ embeds: [blacklistedLinksEmbed], ephemeral: true }).then((replyMessage) => {
            setTimeout(() => {
              replyMessage.delete();
            }, 730001); // 10 seconds

          });
        });
      }
    }); 
});