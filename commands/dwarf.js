const { SlashCommandBuilder } = require('discord.js');
const {TENOR_API_TOKEN, GOOGLE_API_TOKEN} = require('../config.json')
const fetch = require("node-fetch");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('dwarf')
        .setDescription('A mighty dwarf will appear'),
    async execute(interaction) {
        const url = "https://tenor.googleapis.com/v2/search?q=wowdwarf&key=" +
            TENOR_API_TOKEN +"&client_key=" + GOOGLE_API_TOKEN +  "&limit=20";

        const res = await fetch(url);

        const result = await res.json()

        const idx = Math.floor(Math.random() * result.results.length);

        return interaction.reply(result.results[idx].url);
    },
};