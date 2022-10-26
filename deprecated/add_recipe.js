const { SlashCommandBuilder } = require('discord.js');
const {collect_all} = require("../data/profession_data")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("add_recipe")
        .setDescription("Add a recipe you can craft to your profile")
        .addStringOption(option =>
            option.setName('recipe')
                .setDescription('Recipe to add')),
    async execute(interaction) {
        console.log(interaction.options.getString('recipe'))
        let to_add_recipe = collect_all()[interaction.options.getString('recipe')]
        console.log()


        await interaction.reply(to_add_recipe);
    },
}