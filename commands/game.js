import { ApplicationCommandOptionType } from 'discord.js';
import axios from 'axios';

export default {
  name: 'game',
  description: 'Obtém informações detalhadas de uma partida do League of Legends.', // Get detailed information about a League of Legends match
  options: [
    {
      name: 'gameid',
      type: ApplicationCommandOptionType.String,
      description: 'O ID da partida que você deseja consultar.',
      required: true,
    },
  ],
  async execute(interaction) {
    const matchId = interaction.options.getString('gameid');
    const apiKey = process.env.RIOT_API_KEY;
    const region = 'americas';

    try {
      // Fetch match data from Riot API
      const response = await axios.get(`https://${region}.api.riotgames.com/lol/match/v5/matches/BR1_${matchId}`, {
        headers: {
          'X-Riot-Token': apiKey,
        },
      });

      const matchData = response.data;

      // Filter players by team
      const blueTeam = matchData.info.participants.filter(p => p.teamId === 100);
      const redTeam = matchData.info.participants.filter(p => p.teamId === 200);

      // Match duration and winner team
      const gameDurationSeconds = matchData.info.gameDuration;
      const gameDuration = `${Math.floor(gameDurationSeconds / 60)}m ${gameDurationSeconds % 60}s`;
      const winnerTeamId = matchData.info.teams.find(team => team.win).teamId;
      const winner = winnerTeamId === 100 ? "Blue Side" : "Red Side";

      // Stats for each team
      const blueStats = {
        kills: blueTeam.reduce((acc, player) => acc + player.kills, 0),
        deaths: blueTeam.reduce((acc, player) => acc + player.deaths, 0),
        assists: blueTeam.reduce((acc, player) => acc + player.assists, 0),
      };
      const redStats = {
        kills: redTeam.reduce((acc, player) => acc + player.kills, 0),
        deaths: redTeam.reduce((acc, player) => acc + player.deaths, 0),
        assists: redTeam.reduce((acc, player) => acc + player.assists, 0),
      };

      // Format match data
      const formattedMatchData = {
        GameDuration: gameDuration,
        Winner: winner,
        BlueScore: `${blueStats.kills}/${blueStats.deaths}/${blueStats.assists}`,
        RedScore: `${redStats.kills}/${redStats.deaths}/${redStats.assists}`,
        BlueSide: blueTeam.map(player => ({
          nickname: `${player.riotIdGameName}#${player.riotIdTagline}`,
          KDA: `${player.kills} / ${player.deaths} / ${player.assists}`,
          Ouro: player.goldEarned,
          Cs: player.totalMinionsKilled,
          Dano: player.totalDamageDealtToChampions,
          Champion: player.championName,
          Role: player.teamPosition,
        })),
        RedSide: redTeam.map(player => ({
          nickname: `${player.riotIdGameName}#${player.riotIdTagline}`,
          KDA: `${player.kills} / ${player.deaths} / ${player.assists}`,
          Ouro: player.goldEarned,
          Cs: player.totalMinionsKilled,
          Dano: player.totalDamageDealtToChampions,
          Champion: player.championName,
          Role: player.teamPosition,
        })),
        GameTimestamp: new Date(matchData.info.gameStartTimestamp).toLocaleString()
      };

      // Send the formatted data as a JSON file
      const jsonBuffer = Buffer.from(JSON.stringify(formattedMatchData, null, 2));
      await interaction.reply({
        files: [{
          attachment: jsonBuffer,
          name: 'match_data.json',
        }],
      });

    } catch (error) {
      console.error(`Erro ao obter dados da partida: ${error}`);
      await interaction.reply('❌ | Ocorreu um erro ao obter os dados da partida.');
    }
  },
};
