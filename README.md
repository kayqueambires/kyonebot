# KyoneBot (WIP)

This project is a **Discord bot** developed using **discord.js**, **discord-player**, and the **Riot Games API**. The bot fetches League of Legends match data and returns a JSON response. It also includes a music player feature supporting various sources.

## 🚧 Project Status

The bot is currently under development. Future updates include sending match data via REST API to a website dashboard, where users will be able to visualize statistics, rankings, and other planned integrations.

*Note: The project is currently in Portuguese, but I have added comments in English to assist with understanding.*

## Features

- Fetches match data from Riot Games API (League of Legends).
- Returns match data in JSON format.
- Music playback from multiple sources.
- Customizable activity status for the bot.

## Prerequisites

Before starting, make sure you have installed:

- [Node.js](https://nodejs.org/) (version 20.17.0 recommended)
- npm

### Environment Variables

You'll need to set up a `.env` file for your Discord bot token and Riot API key.

Example `.env` file:
```
DISCORD_TOKEN=your-discord-token 
DP_FORCE_YTDL_MOD="@distube/ytdl-core" (Must have "@distube/ytdl-core")
RIOT_API_KEY=your-riot-api-key
``` 

- **Discord Token**: You can get this by creating an application on the [Discord Developer Portal](https://discord.com/developers/applications).
- **Riot API Key**: Sign up and generate a key from the [Riot Developer Portal](https://developer.riotgames.com/).

## Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/kayqueambires/kyonebot.git
    ```

2. Navigate to the project folder:

    ```bash
    cd kyonebot
    ```

3. Install dependencies:

    ```bash
    npm install
    ```

4. Create a `.env` file and insert your keys as shown above.

5. Customize the bot's activity status by editing the `config.json` file:

    ```json
    {
      "activityType": "0",
      "activity": "https://github.com/kayqueambires"
    }
    ```

## Running the Bot

Once everything is set up, run the following command to start the bot:

```bash
npm start
