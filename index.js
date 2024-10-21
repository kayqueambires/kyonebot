import 'dotenv/config';
import { readdirSync } from 'fs';
import { Collection } from 'discord.js';
import Client from './client/Client.js';
import { Player } from 'discord-player';
import config from './config.json' assert { type: 'json' };
import { EmbedBuilder } from 'discord.js';
import express from 'express';

const app = express()
const port = process.env.PORT || 4000;

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

// Inicializar cliente e comandos
const client = new Client(config);
client.commands = new Collection();


const commandFiles = readdirSync('./commands').filter((file) =>
  file.endsWith('.js')
);
for (const file of commandFiles) {
  const command = await import(`./commands/${file}`);
  client.commands.set(command.default.name, command.default);
}

client.on('messageCreate', async (message) => {
  if (message.author.bot || !message.guild) return;
  if (!client.application?.owner) await client.application?.fetch();

  if (
    message.content === '!deploy' &&
    message.author.id === client.application?.owner?.id
  ) {
    await message.guild.commands
      .set(client.commands)
      .then(() => {
        const successEmbed = new EmbedBuilder()
          .setColor('#00ff00')
          .setTitle('Comandos Atualizados')
          .setDescription('✅ | Os comandos foram atualizados com sucesso!')
          .setTimestamp();

        message.reply({ embeds: [successEmbed], ephemeral: true });
      })
      .catch((err) => {
        console.error(err);

        const errorEmbed = new EmbedBuilder()
          .setColor('#ff0000')
          .setTitle('Erro ao Atualizar Comandos')
          .setDescription(
            '❌ | Ocorreu um erro ao tentar atualizar os comandos.'
          )
          .setTimestamp();

        message.reply({ embeds: [errorEmbed], ephemeral: true });
      });
  }
});

client.on('interactionCreate', async (interaction) => {
  const command = client.commands.get(interaction.commandName.toLowerCase());

  try {
    if (
      interaction.commandName == 'ban' ||
      interaction.commandName == 'userinfo'
    ) {
      command.execute(interaction, client);
    } else {
      command.execute(interaction);
    }
  } catch (error) {
    console.error(error);

    const errorEmbed = new EmbedBuilder()
      .setColor('#ff0000')
      .setTitle('Erro ao executar o comando')
      .setDescription(
        `❌ | Ocorreu um erro ao tentar executar o comando **${interaction.commandName}**.`
      )
      .setTimestamp();

    await interaction.reply({ embeds: [errorEmbed] });
  }
});

// Inicializar player
const player = new Player(client);

// Carregar extractors
player.extractors
  .loadDefault()
  .then(() => console.log('Extractors loaded successfully'))
  .catch((error) => console.error('Error loading extractors:', error));

// Carregar eventos
import('./events/playerEvents.js').then(({ default: handlePlayerEvents }) =>
  handlePlayerEvents(player)
);
import('./events/ready.js').then(({ default: ready }) => ready(client));

client.login(process.env.DISCORD_TOKEN);
