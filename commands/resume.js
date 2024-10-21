import { useQueue } from "discord-player";
import { isInVoiceChannel } from "../utils/voicechannel.js";

export default {
    name: 'resume',
    description: 'Retoma a música atual!',
    async execute(interaction) {
        const inVoiceChannel = isInVoiceChannel(interaction);
        if (!inVoiceChannel) {
            return interaction.reply('❌ | Você precisa estar em um canal de voz!');
        }

        await interaction.deferReply();
        const queue = useQueue(interaction.guild.id);
        if (!queue || !queue.currentTrack) {
            return interaction.followUp({
                content: '❌ | Nenhuma música está sendo tocada!',
            });
        }

        const success = queue.node.resume();
        return interaction.followUp({
            content: success ? '▶ | Música retomada!' : '❌ | Algo deu errado!',
        });
    },
};
