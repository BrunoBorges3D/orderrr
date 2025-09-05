const { Events, EmbedBuilder, ModalBuilder, TextInputBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, TextInputStyle } = require("discord.js");
const client = require("../index")
const db = require("pro.db");
const verify = require('../database/models/verify');
const soycanvas = require('soycanvas')



client.on(Events.InteractionCreate, async (interaction) => {

    if (interaction.isChatInputCommand()) {
    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) return console.log(`No command matching ${interaction.commandName} was found.`);


    try {
      await command.execute(interaction, client);
    } catch (error) {
      console.error(`Error executing ${interaction.commandName}`);
      console.error(error);
    }
  }   
  // Verify system
// Verify system
if (interaction.isButton() && interaction.customId == "Bot_verify") {
  const data = await verify.findOne({
    Guild: interaction.guild.id,
    Channel: interaction.channel.id,
  });

  if (interaction.member.roles.cache.has(data.Role)) {
    return interaction.reply({
      content: "**You'r already verified.**",
      ephemeral: true,
    });
  } else {
    const randomColor = Math.floor(Math.random() * 16777215)
      .toString(16)
      .padStart(6, "0")
      .toUpperCase();
    if (data) {
      const captcha = soycanvas.Util.captchaKey(8);
      data.Captcha = captcha;
      data.save();
      const image = await new soycanvas.Captcha()
        .setBackground(
          "image",
          "https://media.discordapp.net/attachments/1216712873024159876/1218434316749766686/peripy.png?ex=6607a662&is=65f53162&hm=9e89aec0e4c88c698de362145826f26bf1c63b604f7aab13845e20b2829da0ee&=&format=webp&quality=lossless&width=1440&height=540"
        )
        .setCaptchaKey(captcha)
        .setBorder("#" + randomColor)
        .setOverlayOpacity(0.7)
        .build();

      const verifyembed = new EmbedBuilder()
        .setTitle("Verification Code")
        .setDescription(
          "```> Click the Button (Enter Code) Below..!\n> Please Enter the reCAPTCHA Code```"
        )
        .setColor("#" + randomColor);

      const validateverify = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("Verify_Modal")
          .setLabel("Enter Code")
          .setStyle(ButtonStyle.Primary)
      );

      interaction.reply({
        files: [image],
        embeds: [verifyembed],
        components: [validateverify],
        ephemeral: true,
      });
    } else {
      interaction.reply({ content: "Verify is disabled in this server! Or you are using the wrong channel!", ephemeral: true})
    }
  }
}
if (interaction.isButton() && interaction.customId == "Verify_Modal") {
  const data = await verify.findOne({ Guild: interaction.guild.id });
  const modal = new ModalBuilder()
    .setCustomId("Verification_Modal")
    .setTitle(`Verify Code: ${data.Captcha}`);

  const verification = new TextInputBuilder()
    .setCustomId("Verification_Check")
    .setLabel("Enter the Captcha Code")
    .setStyle(TextInputStyle.Short)
    .setRequired(true)
    .setMinLength(1);

  const validate = new ActionRowBuilder().addComponents(verification);

  modal.addComponents(validate);
  await interaction.showModal(modal);
}

if (interaction.customId === "Verification_Modal") {
  const check = interaction.fields.getTextInputValue("Verification_Check");
  const data = await verify.findOne({
    Guild: interaction.guild.id,
    Channel: interaction.channel.id,
  });
  if (check === data.Captcha) {
    interaction.reply({
      content: `\`\`\`You Have Verified Correctly, Now You Can Join The law Server On ${interaction.guild.name}\`\`\``,
      ephemeral: true,
    });
    var verifyUser = interaction.guild.members.cache.get(interaction.user.id);
    verifyUser.roles.add(data.Role);
  } else {
    interaction.reply({
      content: "You answered wrong the captcha",
      ephemeral: true,
    })
}
}
    //end  
})
