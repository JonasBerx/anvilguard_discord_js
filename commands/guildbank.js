const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('guildbank')
        .setDescription('Replies you the guildbank google sheets'),
    async execute(interaction) {
        return interaction.reply({
            content:'https://docs.google.com/spreadsheets/d/1e4ZP62ybJmjpoWk8mVjgvxoQhOP-ldenVuRQy6-62uY/edit?usp=sharing',
            ephemeral: true
        });
    },
};