import { GuildMember, EmbedBuilder } from 'discord.js';

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
