const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('client')
        .setDescription('Anvilguard certified 1.12 client.'),
    async execute(interaction) {
        return interaction.reply({
            content:'Client (rar): https://drive.google.com/file/d/14WRrkGrfWymzNp_bbcFrKxjN6TTjUydC/view?usp=share_link\n' +
                'Client (torrent): https://drive.google.com/file/d/1b84frHIPgROyvLA0eOiEnHHTiOzGfm1v/view?usp=share_link\n',
            ephemeral: true
        });
    },
};