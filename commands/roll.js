const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('roll')
        .setDescription('Make a dice roll')
        .addStringOption(option =>
            option.setName("number")
                .setDescription("Between 1 and ??? - Defaults to 100")),
    async execute(interaction) {
        num1 = (interaction.options.getString("number")) ?? 100
        num1 = parseInt(num1)

        rolled = Math.round(Math.random() * (num1 - 1) + 1)

        return interaction.reply(`${interaction.user.username} rolled ${rolled} - (1-${num1})`);
    },
};