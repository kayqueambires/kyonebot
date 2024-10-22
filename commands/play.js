import { ApplicationCommandOptionType, EmbedBuilder } from 'discord.js';
import { useMainPlayer } from 'discord-player';
import { isInVoiceChannel } from '../utils/voicechannel.js';
import Conf from 'conf';

export default {
  name: 'play',
  description: 'Toca uma música no seu canal!', // Play a song in your voice channel
  options: [
    {
      name: 'query',
      type: ApplicationCommandOptionType.String,
      description: 'A música ou playlist que você deseja tocar',
      required: true,
    },
  ],
  async execute(interaction) {
    try {
      const inVoiceChannel = isInVoiceChannel(interaction);
      if (!inVoiceChannel) {
        return;
      }

      await interaction.deferReply();

      const player = useMainPlayer();
      const query = interaction.options.getString('query');
      const searchResult = await player.search(query);

      if (!searchResult.hasTracks()) {
        const embed = new EmbedBuilder()
          .setColor('#ff0000')
          .setDescription('❌ | Nenhum resultado encontrado!');
        return void interaction.followUp({ embeds: [embed] });
      }

      const config = new Conf({ projectName: 'volume' });

      // Adds the track to the queue
      await player.play(interaction.member.voice.channel.id, searchResult, {
        nodeOptions: {
          metadata: {
            channel: interaction.channel,
            client: interaction.guild?.members.me,
            author: interaction.user,
          },
          leaveOnEmptyCooldown: 300000,
          leaveOnEmpty: true,
          leaveOnEnd: false, 
          leaveOnStop: false, 
          bufferingTimeout: 5000,
          volume: 10,
        },
      });


      if (searchResult.playlist) {
        const embed = new EmbedBuilder()
          .setColor('#0099ff')
          .setDescription(`🎶 | Playlist **${searchResult.playlist.title}** adicionada à fila!\n\n` +
                          `➡️ ${searchResult.playlist.tracks.length} músicas adicionadas!`)
          .setThumbnail(searchResult.playlist.thumbnail);
        await interaction.followUp({ embeds: [embed] });
      } else {
        const track = searchResult.tracks[0];
        const embed = new EmbedBuilder()
          .setColor('#0099ff')
          .setDescription(`🎶 | Música **${track.title}** adicionada à fila!`);
        await interaction.followUp({ embeds: [embed] });
      }

    } catch (error) {
      const embed = new EmbedBuilder()
        .setColor('#ff0000')
        .setDescription('❌ | Ocorreu um erro ao executar o comando.');
      await interaction.followUp({ embeds: [embed] });
    }
  },
};
