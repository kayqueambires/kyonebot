import { readdirSync } from 'fs';
import { EmbedBuilder } from 'discord.js';

export default {
  name: 'help',
  description: 'Lista todos os comandos disponíveis.',
  async execute(interaction) {
    const helpEmbed = new EmbedBuilder()
      .setColor('#0099ff') 
      .setTitle('Ajuda - Comandos Disponíveis')
      .setDescription('Aqui estão os comandos disponíveis no bot:')
      .setTimestamp()
      .setFooter({ text: 'Kyonebot - Seus comandos!' });

    // Carrega todos os comandos da pasta ./commands
    const commandFiles = readdirSync('./commands').filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
      const command = await import(`./${file}`);
      helpEmbed.addFields(
        { name: `**${command.default.name}**`, value: command.default.description || 'Sem descrição disponível' }
      );
    }

    return void interaction.reply({
      embeds: [helpEmbed],
      ephemeral: true,
    });
  },
};
