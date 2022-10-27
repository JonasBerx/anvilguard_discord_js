const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('picsizespecificelementsofwebsite')
        .setDescription('Yes.'),
    async execute(interaction) {
        return interaction.reply({
            content:'Working on it :/',
        });
    },
};