import { ApplicationCommandOptionType, EmbedBuilder } from 'discord.js';

export default {
    name: 'userinfo',
    description: 'Obtenha informações sobre um usuário.', // Get information about a user
    options: [
        {
            name: 'user',
            type: ApplicationCommandOptionType.User,
            description: 'O usuário sobre o qual você deseja obter informações',
            required: true,
        },
    ],
    async execute(interaction) {
        const user = interaction.options.getUser('user');

        const embed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle('Informações do Usuário')
            .addFields(
                { name: 'Nome', value: user.username, inline: true },
                { name: 'ID', value: user.id, inline: true },
                { name: 'Avatar', value: `[Clique aqui](${user.displayAvatarURL({ dynamic: true })})`, inline: true }
            )
            .setThumbnail(user.displayAvatarURL({ dynamic: true }))
            .setTimestamp();

        await interaction.reply({ embeds: [embed], ephemeral: true });
    },
};
