const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('roll')
        .setDescription('Make a dice roll')
        .addStringOption(option =>
            option.setName("number")
                .setDescription("Between which numbers? - Defaults to 100")),
    async execute(interaction) {
        num1 = (interaction.options.getString("number")) ?? 100
        num1 = parseInt(num1)

        rolled = Math.round(Math.random() * (num1 - 1) + 1)

        if (num1 * 0.95 === rolled) {
            console.log("MUTED KEKW")
        }

        return interaction.reply(`${interaction.user.username} rolled ${rolled} - (1-${num1})`);
    },
};