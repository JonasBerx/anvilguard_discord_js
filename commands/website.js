const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('website')
        .setDescription('Replies you the URL to the guild website'),
    async execute(interaction) {
        return interaction.reply({
            content:'https://theanvilguard.com',
            ephemeral: true
        });
    },
};