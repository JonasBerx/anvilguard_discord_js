const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('addons')
        .setDescription('Addons that work with a 1.12 client.'),
    async execute(interaction) {
        return interaction.reply({
            content:'https://legacy-wow.com/vanilla-addons/',
            ephemeral: true
        });
    },
};