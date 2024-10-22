import { EmbedBuilder } from 'discord.js';
import { useQueue } from 'discord-player';
import { isInVoiceChannel } from '../utils/voicechannel.js';

export default {
    name: 'stop',
    description: 'Para todas as músicas na fila!', // Stop all the songs in the queue
    async execute(interaction) {
        const inVoiceChannel = isInVoiceChannel(interaction);
        if (!inVoiceChannel) {
            const embedError = new EmbedBuilder()
                .setColor('#ff0000')
                .setDescription('❌ | Você precisa estar em um canal de voz para usar este comando!');
            return interaction.reply({ embeds: [embedError], ephemeral: true });
        }

        await interaction.deferReply();
        const queue = useQueue(interaction.guild.id);
        if (!queue || !queue.currentTrack) {
            const embedError = new EmbedBuilder()
                .setColor('#ff0000')
                .setDescription('❌ | Nenhuma música está sendo tocada!');
            return interaction.followUp({ embeds: [embedError] });
        }

        queue.node.stop();
        const embedResponse = new EmbedBuilder()
            .setColor('#0099ff')
            .setDescription('🛑 | O player foi parado!');

        return interaction.followUp({ embeds: [embedResponse] });
    },
};
