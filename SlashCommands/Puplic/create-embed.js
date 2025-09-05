// Importing the necessary modules
const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, PermissionsBitField } = require('discord.js');
// Role name required to use bot commands
//const rolesRequired = ["EmbedAkses"]; // Replace with your role name, for example "🎩・Owner", to add additional roles, follow this logic: "🎩・Owner", "Role_Name_2", "Role_Name_3"

module.exports = {
	data: new SlashCommandBuilder()
		.setName('create-embed')
		.setDescription('Manage embeds.')
		.addSubcommand(subcommand =>
			subcommand
			.setName('create')
			.setDescription('Create a new embed.')
			.addStringOption(option => option.setName('title').setDescription('Title of the embed').setRequired(true))
			.addStringOption(option => option.setName('description').setDescription('Description of the embed').setRequired(true))
			.addStringOption(option => option.setName('color').setDescription('Color of the embed').setRequired(false))
			.addStringOption(option => option.setName('image').setDescription('Image URL').setRequired(false))
			.addStringOption(option => option.setName('thumbnail').setDescription('Thumbnail URL').setRequired(false))
			.addStringOption(option => option.setName('footer').setDescription('Footer text').setRequired(false))
			.addStringOption(option => option.setName('footericon').setDescription('Footer icon URL').setRequired(false))
			.addStringOption(option => option.setName('author').setDescription('Author\'s name').setRequired(false))
			.addStringOption(option => option.setName('authoricon').setDescription('Author\'s icon URL').setRequired(false))
			.addStringOption(option => option.setName('authorurl').setDescription('Author\'s URL').setRequired(false))
		)
		.addSubcommand(subcommand =>
			subcommand
			.setName('edit')
			.setDescription('Modifies an existing embed.')
			.addStringOption(option => option.setName('messageid').setDescription('ID of the message containing the embed').setRequired(true))
			.addStringOption(option => option.setName('new-title').setDescription('New title of the embed').setRequired(false))
			.addStringOption(option => option.setName('new-description').setDescription('New description of the embed').setRequired(false))
			.addStringOption(option => option.setName('new-color').setDescription('New color of the embed').setRequired(false))
			.addStringOption(option => option.setName('new-image').setDescription('New image URL').setRequired(false))
			.addStringOption(option => option.setName('new-thumbnail').setDescription('New thumbnail URL').setRequired(false))
			.addStringOption(option => option.setName('new-footer').setDescription('New footer text').setRequired(false))
			.addStringOption(option => option.setName('new-footericon').setDescription('New footer icon URL').setRequired(false))
			.addStringOption(option => option.setName('new-author').setDescription('New author\'s name').setRequired(false))
			.addStringOption(option => option.setName('new-authoricon').setDescription('New author\'s icon URL').setRequired(false))
			.addStringOption(option => option.setName('new-authorurl').setDescription('New author\'s URL').setRequired(false))
		)
		.addSubcommand(subcommand =>
			subcommand
			.setName('remove')
			.setDescription('Remove elements from an existing embed.')
			.addStringOption(option => option.setName('messageid').setDescription('ID of the message containing the embed').setRequired(true))
			.addBooleanOption(option => option.setName('remove-image').setDescription('Remove the image from the embed'))
			.addBooleanOption(option => option.setName('remove-thumbnail').setDescription('Remove the thumbnail from the embed'))
			.addBooleanOption(option => option.setName('remove-title').setDescription('Remove the title from the embed'))
			.addBooleanOption(option => option.setName('remove-description').setDescription('Remove the description from the embed'))
			.addBooleanOption(option => option.setName('remove-color').setDescription('Remove the color from the embed'))
			.addBooleanOption(option => option.setName('remove-footer').setDescription('Remove the footer from the embed'))
			.addBooleanOption(option => option.setName('remove-footericon').setDescription('Remove the footer icon from the embed'))
			.addBooleanOption(option => option.setName('remove-author').setDescription('Remove the author from the embed'))
			.addBooleanOption(option => option.setName('remove-authoricon').setDescription('Remove the author icon from the embed'))
			.addBooleanOption(option => option.setName('remove-authorurl').setDescription('Remove the author URL from the embed'))
		),
	async execute(interaction) {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return interaction.reply({ content: '**INDONESIA**\n> ```Hanya Admin Server Yang Dapat Menjalankan Perintah Ini, jadi Anda Harus Menjadi Admin Terlebih Dahulu ya..:)```\n**ENGLISH**\n> ```Only Server Admins Can Run This Command, so You Have to Be an Admin First... :)```', ephemeral: true });
        }
		// Check if the user has at least one of the required roles
        //const hasRequiredRole = interaction.member.roles.cache.some(role => rolesRequired.includes(role.name));
        
        //if (!hasRequiredRole) {
            //return interaction.reply({
                //content: '**INDONESIA**\n> ```Kamu Tidak Memiliki Role (EmbedAkses), Silahkan Buat Role Dengan Nama (EmbedAkses), Kemudian Beri Role Tersebut Kepada Member Yang Akan Diberi Akses Untuk Menggunakan Command (/create-embed)```\n**ENGLISH**\n> ```You dont have a role (EmbedAkses), please create a role with the name (EmbedAkses), then give that role to the member who will be given access to use this command (/create-embed)```',
                //ephemeral: true
            //});
        //}

		const subcommand = interaction.options.getSubcommand();

		if (subcommand === 'create') {
			// Retrieve required and optional fields from the interaction
			const title = interaction.options.getString('title');
			const description = interaction.options.getString('description') || '';
			const color = interaction.options.getString('color') || '#FFFFFF'; // Default color set to white
			const imageUrl = interaction.options.getString('image');
			const thumbnailUrl = interaction.options.getString('thumbnail');
			const footerText = interaction.options.getString('footer');
			const footerIconUrl = interaction.options.getString('footericon');
			const authorName = interaction.options.getString('author');
			const authorIconUrl = interaction.options.getString('authoricon');
			const authorUrl = interaction.options.getString('authorurl');
		
			// Create a new embed and set the title and description
			const embed = new EmbedBuilder()
				.setTitle(title)
				.setDescription(description)
				.setColor(color)
				.setTimestamp();
		
			// Set optional fields if provided
			if (imageUrl) {
				embed.setImage(imageUrl);
			}
			if (thumbnailUrl) {
				embed.setThumbnail(thumbnailUrl);
			}
			if (footerText || footerIconUrl) {
				embed.setFooter({
					text: footerText || '',
					iconURL: footerIconUrl || undefined
				});
			}
			if (authorName || authorIconUrl || authorUrl) {
				embed.setAuthor({
					name: authorName || '',
					iconURL: authorIconUrl || undefined,
					url: authorUrl || undefined
				});
			}
		
			// Send the embed as a message visible to everyone
			await interaction.channel.send({
				embeds: [embed]
			});
			
			// Acknowledge the command without sending a visible reply
			await interaction.reply({ content: '**Embed successfully created ✅**', ephemeral: true });
			
		} else if (subcommand === 'edit') {
			const messageId = interaction.options.getString('messageid');
			const message = await interaction.channel.messages.fetch(messageId);
			if (!message) {
				return interaction.reply({
					content: 'Message not found.',
					ephemeral: true
				});
			}

			const existingEmbed = message.embeds[0];
			if (!existingEmbed) {
				return interaction.reply({
					content: 'No embed found in the message.',
					ephemeral: true
				});
			}

			const updatedEmbed = new EmbedBuilder(existingEmbed);
			if (interaction.options.getString('new-title')) {
				updatedEmbed.setTitle(interaction.options.getString('new-title'));
			}
			if (interaction.options.getString('new-description')) {
				updatedEmbed.setDescription(interaction.options.getString('new-description'));
			}
			if (interaction.options.getString('new-color')) {
				updatedEmbed.setColor(interaction.options.getString('new-color'));
			}
			if (interaction.options.getString('new-image')) {
				updatedEmbed.setImage(interaction.options.getString('new-image'));
			}
			if (interaction.options.getString('new-thumbnail')) {
				updatedEmbed.setThumbnail(interaction.options.getString('new-thumbnail'));
			}
			if (interaction.options.getString('new-footer')) {
				updatedEmbed.setFooter({
					text: interaction.options.getString('new-footer'),
					iconURL: interaction.options.getString('new-footericon') || existingEmbed.footer?.iconURL
				});
			}
			if (interaction.options.getString('new-author')) {
				updatedEmbed.setAuthor({
					name: interaction.options.getString('new-author'),
					iconURL: interaction.options.getString('new-authoricon') || existingEmbed.author?.iconURL,
					url: interaction.options.getString('new-authorurl') || existingEmbed.author?.url
				});
			}

			await message.edit({
				embeds: [updatedEmbed]
			});
			await interaction.reply({
				content: 'Embed successfully edited 👋',
				ephemeral: true
			});
		} else if (subcommand === 'remove') {
			const messageId = interaction.options.getString('messageid');
			const message = await interaction.channel.messages.fetch(messageId);
			if (!message) {
				return interaction.reply({
					content: 'Message not found.',
					ephemeral: true
				});
			}

			const existingEmbed = message.embeds[0];
			if (!existingEmbed) {
				return interaction.reply({
					content: 'No embed found in the message.',
					ephemeral: true
				});
			}

			const updatedEmbed = new EmbedBuilder(existingEmbed);

			if (interaction.options.getBoolean('remove-title')) {
				updatedEmbed.setTitle(null);
			}
			if (interaction.options.getBoolean('remove-description')) {
				updatedEmbed.setDescription(null);
			}
			if (interaction.options.getBoolean('remove-color')) {
				updatedEmbed.setColor(null);
			}
			if (interaction.options.getBoolean('remove-image')) {
				updatedEmbed.setImage(null);
			}
			if (interaction.options.getBoolean('remove-thumbnail')) {
				updatedEmbed.setThumbnail(null);
			}
			if (interaction.options.getBoolean('remove-footer')) {
				updatedEmbed.setFooter(null);
			}
			if (interaction.options.getBoolean('remove-footericon')) {
				updatedEmbed.setFooter({
					text: existingEmbed.footer?.text,
					iconURL: null
				});
			}
			if (interaction.options.getBoolean('remove-author')) {
				updatedEmbed.setAuthor(null);
			}
			if (interaction.options.getBoolean('remove-authoricon')) {
				updatedEmbed.setAuthor({
					name: existingEmbed.author?.name,
					iconURL: null,
					url: existingEmbed.author?.url
				});
			}
			if (interaction.options.getBoolean('remove-authorurl')) {
				updatedEmbed.setAuthor({
					name: existingEmbed.author?.name,
					iconURL: existingEmbed.author?.iconURL,
					url: null
				});
			}

			await message.edit({
				embeds: [updatedEmbed]
			});
			await interaction.reply({
				content: 'Embed successfully modified to remove specified elements ✅',
				ephemeral: true
			});
		}
	}
};