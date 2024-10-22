import { EmbedBuilder } from 'discord.js';
import { useQueue } from 'discord-player';
import { isInVoiceChannel } from '../utils/voicechannel.js';

export default {
  name: 'pause',
  description: 'Pausa a música atual!', // Pauses the current track
  async execute(interaction) {
    try {
      const inVoiceChannel = isInVoiceChannel(interaction);
      if (!inVoiceChannel) {
        const embedError = new EmbedBuilder()
          .setColor('#ff0000')
          .setDescription('❌ | Você precisa estar em um canal de voz para usar esse comando!');
        return void interaction.reply({ embeds: [embedError], ephemeral: true });
      }

      await interaction.deferReply();
      const queue = useQueue(interaction.guild.id);

      if (!queue || !queue.currentTrack) {
        const embedError = new EmbedBuilder()
          .setColor('#ff0000')
          .setDescription('❌ | Nenhuma música está sendo tocada no momento!');
        return void interaction.followUp({ embeds: [embedError] });
      }

      const success = queue.node.pause();
      const embedResponse = new EmbedBuilder()
        .setColor(success ? '#0099ff' : '#ff0000')
        .setDescription(success ? '⏸ | Música pausada!' : '❌ | Algo deu errado ao tentar pausar!');

      return void interaction.followUp({ embeds: [embedResponse] });
    } catch (error) {
      console.error(error);
      const embedError = new EmbedBuilder()
        .setColor('#ff0000')
        .setDescription(`❌ | Ocorreu um erro ao executar o comando: ${error.message}`);
      
      return void interaction.followUp({ embeds: [embedError] });
    }
  },
};
