import { EmbedBuilder } from 'discord.js';

export default {
    name: 'purge',
    description: 'Deleta as últimas mensagens em todos os chats.',
    options: [
        {
            name: 'num',
            type: 4, // 'INTEGER' Type
            description: 'O número de mensagens que você deseja deletar. (máx 100)',
            required: true,
        },
    ],
    async execute(interaction) {
        const deleteCount = interaction.options.get('num').value;

        if (!deleteCount || deleteCount < 2 || deleteCount > 100) {
            const embedError = new EmbedBuilder()
                .setColor('#ff0000')
                .setDescription('❌ | Por favor, forneça um número entre 2 e 100 para o número de mensagens a serem deletadas.');

            return interaction.reply({ embeds: [embedError], ephemeral: true });
        }

        try {
            const fetched = await interaction.channel.messages.fetch({
                limit: deleteCount,
            });

            await interaction.channel.bulkDelete(fetched);
            const embedSuccess = new EmbedBuilder()
                .setColor('#00ff00')
                .setDescription(`✅ | Mensagens deletadas com sucesso! Deletadas: **${deleteCount}** mensagens.`);

            return interaction.reply({ embeds: [embedSuccess], ephemeral: true });
        } catch (error) {
            const embedError = new EmbedBuilder()
                .setColor('#ff0000')
                .setDescription(`❌ | Não foi possível deletar as mensagens devido ao erro: ${error.message}`);

            return interaction.reply({ embeds: [embedError], ephemeral: true });
        }
    },
};
