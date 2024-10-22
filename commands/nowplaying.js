import { EmbedBuilder, GuildMember } from 'discord.js';
import { useQueue } from 'discord-player';
import { isInVoiceChannel } from '../utils/voicechannel.js';

function getIconURL(source) {
  const iconPath = {
    spotify: 'https://cdn-icons-png.flaticon.com/128/3669/3669986.png',
    youtube: 'https://cdn-icons-png.flaticon.com/128/3670/3670147.png',
    soundcloud: 'https://cdn-icons-png.flaticon.com/128/145/145809.png',
  };

  return iconPath[source.toLowerCase()] || '';
}

export default {
  name: 'nowplaying',
  description: 'Veja a música que está tocando no momento.', // Get the current playing track
  async execute(interaction) {
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
        .setDescription('❌ | Nenhuma música está tocando no momento!');
      return void interaction.followUp({ embeds: [embedError] });
    }

    const track = queue.currentTrack;
    const author = track.requestedBy instanceof GuildMember
      ? track.requestedBy
      : { id: 'Desconhecido', username: 'Desconhecido' }; 

    const embed = new EmbedBuilder()
      .setColor('#0099ff')
      .setDescription(
        `**Tocando agora:**\n` +
        `[${track.title}](${track.url}) - (${track.duration})\n\n` +
        `**Autor:**\n${track.author}\n\n` +
        `**Requisitado por:**\n<@${author.id}>`
      )
      .setFooter({ iconURL: getIconURL(track.source), text: track.source })
      .setTimestamp()
      .setThumbnail(track.thumbnail);

    return void interaction.followUp({
      embeds: [embed],
    });
  },
};
