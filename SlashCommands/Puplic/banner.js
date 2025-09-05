const { SlashCommandBuilder} = require('discord.js');
const fetch = require('node-fetch'); // Make sure you have installed the node-fetch package -> npm install node-fetch@2

module.exports = {
    data: new SlashCommandBuilder()
        .setName('upload-banner')
        .setDescription('Update the bot\'s banner')
        .addAttachmentOption(option => option.setName('banner').setDescription('The banner image').setRequired(true)),
    async execute(interaction) { // Modify to have only the interaction as parameter
        // Authorized user ID
        const authorizedId = '1005523266376564846';

        // Checks if the interacting user has the authorized ID
        if (interaction.user.id !== authorizedId) {
            // User not authorized, sends error message
            return interaction.reply({ content: 'You are not authorized to use this command.', ephemeral: true });
        }

        const { options } = interaction;
        const bannerAttachment = options.getAttachment('banner');

        if (!bannerAttachment.contentType.startsWith("image/")) {
            return interaction.reply({ content: 'Please upload an image file.', ephemeral: true });
        }

        try {
            // Convert image to base64
            const response = await fetch(bannerAttachment.url);
            const buffer = await response.buffer();
            const base64 = buffer.toString('base64');
            const imageData = `data:${bannerAttachment.contentType};base64,${base64}`;

            // Access the customer via interaction.client
            const client = interaction.client;

            // Update banner
            const patchResponse = await fetch("https://discord.com/api/v10/users/@me", {
                method: "PATCH",
                headers: {
                    Authorization: `Bot ${client.token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ banner: imageData }), 
            });

            if (!patchResponse.ok) throw new Error(`Failed to update banner: ${patchResponse.statusText}`);

            await interaction.reply({ content: 'The bot\'s banner has been updated successfully!', ephemeral: true });
        } catch (error) {
            console.error("Error:", error);
            await interaction.reply({ content: `Error updating the banner: ${error.message}`, ephemeral: true });
        }
    }
};