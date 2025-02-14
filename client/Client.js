import { Client, Collection, GatewayIntentBits } from 'discord.js';

export default class extends Client {
  constructor(config) {
    super({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
      ],
    });

    this.commands = new Collection();
    this.config = config;
  }
}
