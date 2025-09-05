const { EmbedBuilder, SlashCommandBuilder } = require ("discord.js");
const { Configuration, OpenAIApi } = require ('openai');
const mongoose = require ('mongoose');

const userConversationSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    messages: [{ type: String }],
    response: { type: String }
});

const UserConversation = mongoose.model('UserConversation', userConversationSchema);

module.exports = { 
    data: new SlashCommandBuilder()
        .setName('chatgpt')
        .setDescription('Ask a question to ChatGPT')
        .addStringOption(option => option.setName('prompt').setDescription('The prompt for ChatGPT').setRequired(true)),
    async execute(interaction) {
        const configuration = new Configuration({
            apiKey: "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"
        });
        const openai = new OpenAIApi(configuration);

        const generating = new EmbedBuilder()
        generating.setDescription(`> **⌚ | Sedang Mencari..**\n\n> **😊  | Jika Loading Ini Lama, Silahkan Tunggu..**`);
        generating.setImage('https://media.discordapp.net/attachments/1216712873024159876/1217406870357020722/White_Clean_Please_Wait_Hourglass_Loading_Youtube_Intro_Video.gif')
        generating.setColor('Random')

        await interaction.reply({ embeds: [generating], ephemeral: true });

        const { options } = interaction;
        const userId = interaction.user.id;
        const prompt = options.getString('prompt');

        try {
            let userConversation = await UserConversation.findOne({ userId }).exec();

            if (!userConversation) {
                userConversation = new UserConversation({ userId, messages: [] });
            }

            userConversation.messages.push(prompt);

            const result = await openai.createChatCompletion({
                model: 'gpt-3.5-turbo-16k-0613', // Adjust the model name if necessary
                messages: userConversation.messages.map(msg => ({ role: 'user', content: msg }))
            });

            userConversation.response = result.data.choices[0].message.content;
            await userConversation.save();

            const response = new EmbedBuilder()
            response.setTitle(`\`\`\`\`${options.getString('prompt')}\`\`\`\``)
            response.setAuthor({ name: `Response AI` })
            response.setImage('https://media.discordapp.net/attachments/1126134874403770369/1202199241913810974/line-rainbow.gif');
            response.setTimestamp();
            response.setFooter({ text: 'KaDev AI', iconURL: 'https://media.discordapp.net/attachments/1126134874403770369/1213532522764443668/Blue_and_White_Circle_Surfing_Club_Logo_2.gif' });
            response.setDescription(`\`\`\`${userConversation.response}\`\`\``);

            await interaction.followUp({ embeds: [response] });
        } catch (error) {
            console.error('Error generating response from ChatGPT:', error);
            const embed = new EmbedBuilder()
            embed.setDescription(`❌ | **Error Dalam Melakukan Respone**`);
            embed.setColor('Random')
            embed.setTimestamp();
            await interaction.followUp({ embeds: [embed] });
        }
    }
};