import { GuildMember, EmbedBuilder } from 'discord.js';

// Check if the user is in a voice channel and if they are in the same channel as the bot
export const isInVoiceChannel = (interaction) => {
    if (!(interaction.member instanceof GuildMember) || !interaction.member.voice.channel) {
        const embedError = new EmbedBuilder()
            .setColor('#ff0000')
            .setDescription('🚫 Você não está em um canal de voz!');

        interaction.reply({ embeds: [embedError], ephemeral: true });
        return false;
    }

    if (
        interaction.guild.members.me.voice.channelId &&
        interaction.member.voice.channelId !== interaction.guild.members.me.voice.channelId
    ) {
        const embedError = new EmbedBuilder()
            .setColor('#ff0000')
            .setDescription('🚫 Você não está no meu canal de voz!');

        interaction.reply({ embeds: [embedError], ephemeral: true });
        return false;
    }

    return true;
};
