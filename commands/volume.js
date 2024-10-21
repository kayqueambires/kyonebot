import { ApplicationCommandOptionType, EmbedBuilder } from 'discord.js';
import { useQueue } from 'discord-player';
import { isInVoiceChannel } from '../utils/voicechannel.js';
import Conf from 'conf';

export default {
  name: 'volume',
  description: 'Muda o volume!',
  options: [
    {
      name: 'volume',
      type: ApplicationCommandOptionType.Integer,
      description: 'Número entre 0-200',
      required: true,
    },
  ],
  async execute(interaction) {
    try {
      await interaction.deferReply();

      let volume = interaction.options.getInteger('volume');
      volume = Math.max(0, volume);
      volume = Math.min(200, volume);

      // Definir o volume geral (persistido)
      const config = new Conf({ projectName: 'volume' });
      config.set('volume', volume);

      // Definir o volume da fila atual
      const queue = useQueue(interaction.guild.id);
      const inVoiceChannel = isInVoiceChannel(interaction);
      if (inVoiceChannel && queue && queue.currentTrack) {
        queue.node.setVolume(volume);
        
        const embedSuccess = new EmbedBuilder()
          .setColor('#0099ff')
          .setDescription(`🔊 | Volume ajustado para **${volume}**!`);
        
        return void interaction.followUp({ embeds: [embedSuccess] });
      } else {
        const embedError = new EmbedBuilder()
          .setColor('#ff0000')
          .setDescription('❌ | Você precisa estar em um canal de voz e uma música deve estar tocando para mudar o volume!');

        return void interaction.followUp({ embeds: [embedError] });
      }
    } catch (error) {
      console.error(error);
      const embedError = new EmbedBuilder()
        .setColor('#ff0000')
        .setDescription(`❌ | Ocorreu um erro ao executar o comando: ${error.message}`);
      
      return void interaction.followUp({ embeds: [embedError] });
    }
  },
};
