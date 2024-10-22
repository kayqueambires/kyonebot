import { EmbedBuilder } from 'discord.js';
import { useQueue } from 'discord-player';
import { isInVoiceChannel } from '../utils/voicechannel.js';

export default {
  name: 'skip',
  description: 'Pule uma música!', // Skip a track
  async execute(interaction) {
    const inVoiceChannel = isInVoiceChannel(interaction);
    if (!inVoiceChannel) {
      const embedError = new EmbedBuilder()
        .setColor('#ff0000')
        .setDescription('❌ | Você não está em um canal de voz!');
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

    const currentTrack = queue.currentTrack;

    const success = queue.node.skip();
    const embedResponse = new EmbedBuilder()
      .setColor(success ? '#0099ff' : '#ff0000')
      .setDescription(success ? `✅ | Música **${currentTrack.title}** pulada!` : '❌ | Algo deu errado ao tentar pular a música!');

    return interaction.followUp({ embeds: [embedResponse] });
  },
};
