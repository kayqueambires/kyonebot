import { EmbedBuilder } from 'discord.js';
import { useQueue } from 'discord-player';
import { isInVoiceChannel } from '../utils/voicechannel.js';

export default {
  name: 'shuffle',
  description: 'Embaralha a fila de músicas!', // Shuffles the queue
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
      return void interaction.followUp({ embeds: [embedError] });
    }

    try {
      queue.tracks.shuffle();
      const trimString = (str, max) => (str.length > max ? `${str.slice(0, max - 3)}...` : str);
      
      const embedResponse = new EmbedBuilder()
        .setColor('#0099ff')
        .setTitle('Fila Embaralhada!')
        .setDescription(trimString(
          `A música atual sendo tocada é 🎶 | **${queue.currentTrack.title}**! \n` +
          `🎶 | A fila foi embaralhada!`,
          4095,
        ));

      return void interaction.followUp({ embeds: [embedResponse] });
    } catch (error) {
      console.error(error);
      const embedError = new EmbedBuilder()
        .setColor('#ff0000')
        .setDescription(`❌ | Ocorreu um erro ao tentar embaralhar a fila: ${error.message}`);
      
      return void interaction.followUp({ embeds: [embedError] });
    }
  },
};
