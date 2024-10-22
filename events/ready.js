export default (client) => {
  // Event triggered when the bot is ready
  client.on('ready', () => {
    console.log('Bot está online e pronto!');
    
    // Set bot's activity and status from config.json
    client.user.presence.set({
      activities: [{ name: client.config.activity, type: Number(client.config.activityType) }],
      status: 'online',
    });
  });
};
