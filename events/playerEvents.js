import { EmbedBuilder } from 'discord.js';

// Get the icon URL based on the source of the track
function getIconURL(source) {
  const iconPath = {
    spotify: 'https://cdn-icons-png.flaticon.com/128/3669/3669986.png',
    youtube: 'https://cdn-icons-png.flaticon.com/128/3670/3670147.png',
    soundcloud: 'https://cdn-icons-png.flaticon.com/128/145/145809.png',
  };

  return iconPath[source.toLowerCase()] || '';
}

export default (player) => {
  // Triggered when a track starts playing
  player.events.on('playerStart', (queue, track) => {
    const author = queue.metadata.author;

    const embed = new EmbedBuilder()
      .setColor('#0099ff')
      .setDescription(
        `**Tocando agora:**\n` +
          `[${track.title}](${track.url}) - (${track.duration})\n\n` +
          `**Autor:**\n` +
          `${track.author}\n\n` +
          `**Requisitado por:**\n` +
          `<@${author.id}>`
      )
      .setFooter({ iconURL: getIconURL(track.source), text: track.source })
      .setTimestamp()
      .setThumbnail(track.thumbnail);

    queue.metadata.channel.send({ embeds: [embed] });
  });

  // Error handling during playback
  player.events.on('error', (queue, error) => {
    console.log(`[${queue.guild.name}] Ocorreu um erro na conexão: ${error.message}`);
    const embed = new EmbedBuilder()
      .setColor('#ff0000')
      .setDescription(`❌ | Ocorreu um erro durante a reprodução: ${error.message}`);
    queue.metadata.channel.send({ embeds: [embed] });
  });

  // Triggered when the bot is disconnected from the voice channel
  player.events.on('disconnect', (queue) => {
    const embed = new EmbedBuilder()
      .setColor('#ff0000')
      .setDescription('❌ | Eu fui desconectado manualmente do canal de voz, limpando a fila!');
    queue.metadata.channel.send({ embeds: [embed] });
  });

  // Triggered when the voice channel becomes empty
  player.events.on('emptyChannel', (queue) => {
    const embed = new EmbedBuilder()
      .setColor('#ff0000')
      .setDescription('❌ | Ninguém está no canal de voz, saindo...');
    queue.metadata.channel.send({ embeds: [embed] });
  });

  // Triggered when the queue is empty
  player.events.on('emptyQueue', (queue) => {
    const embed = new EmbedBuilder()
      .setColor('#00ff00')
      .setDescription('✅ | Fim da fila!');
    queue.metadata.channel.send({ embeds: [embed] });
    queue.delete(); // Clears the queue
  });
};
