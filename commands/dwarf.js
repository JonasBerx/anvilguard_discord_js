const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('dwarf')
        .setDescription('A mighty dwarf will appear'),
    async execute(interaction) {
        return interaction.reply({
            content:'shhh, im working here',
            ephemeral: true
        });
    },
};