const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ui')
        .setDescription('A UI addon for a real dwarf!'),
    async execute(interaction) {
        return interaction.reply({
            content:'https://www.wowinterface.com/downloads/info25081-StonewroughtUI.html',
            ephemeral: true
        });
    },
};