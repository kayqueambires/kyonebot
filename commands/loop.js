import { ApplicationCommandOptionType, EmbedBuilder } from 'discord.js';
import { QueueRepeatMode, useQueue } from 'discord-player';
import { isInVoiceChannel } from '../utils/voicechannel.js';

export default {
    name: 'loop',
    description: 'Define o modo de repetição',
    options: [
        {
            name: 'modo',
            type: ApplicationCommandOptionType.Integer,
            description: 'Tipo de repetição',
            required: true,
            choices: [
                {
                    name: 'Desligado',
                    value: QueueRepeatMode.OFF,
                },
                {
                    name: 'Faixa',
                    value: QueueRepeatMode.TRACK,
                },
                {
                    name: 'Fila',
                    value: QueueRepeatMode.QUEUE,
                },
                {
                    name: 'Autoplay',
                    value: QueueRepeatMode.AUTOPLAY,
                },
            ],
        },
    ],
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

            const loopMode = interaction.options.getInteger('modo');
            queue.setRepeatMode(loopMode);
            const mode =
                loopMode === QueueRepeatMode.TRACK ? '🔂' : loopMode === QueueRepeatMode.QUEUE ? '🔁' : '▶';

            const embedSuccess = new EmbedBuilder()
                .setColor('#0099ff')
                .setDescription(`${mode} | Modo de repetição atualizado!`);

            return void interaction.followUp({ embeds: [embedSuccess] });
        } catch (error) {
            console.error(error);
            const embedError = new EmbedBuilder()
                .setColor('#ff0000')
                .setDescription(`❌ | Houve um erro ao executar esse comando: ${error.message}`);
            
            return void interaction.followUp({ embeds: [embedError] });
        }
    },
};
