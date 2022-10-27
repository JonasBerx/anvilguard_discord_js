const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('client')
        .setDescription('Anvilguard certified 1.12 client.'),
    async execute(interaction) {
        return interaction.reply({
            content:'Soontm',
            ephemeral: true
        });
    },
};