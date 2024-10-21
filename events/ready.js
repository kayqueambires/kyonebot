export default (client) => {
    client.on('ready', () => {
      console.log('Bot está online e pronto!');
      client.user.presence.set({
        activities: [{ name: client.config.activity, type: Number(client.config.activityType) }],
        status: 'online',
      });
    });
  };
  