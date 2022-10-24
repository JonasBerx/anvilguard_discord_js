const { SlashCommandBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder} = require('discord.js');
module.exports = {
    data: new SlashCommandBuilder()
        .setName("bounty2")
        .setDescription("Bounty Registration"),
    async execute(interaction) {

        const modal = new ModalBuilder()
            .setCustomId('bountyModal')
            .setTitle('Bounty Registration Form');

        // Add components to modal

        // Create the text input components
        const target_name = new TextInputBuilder()
            .setCustomId('target_name')
            // The label is the prompt the user sees for this input
            .setLabel("Target Name")
            .setRequired(true)
            .setPlaceholder("Fera.")
            // Short means only a single line of text
            .setStyle(TextInputStyle.Short);

        const target_race = new TextInputBuilder()
            .setCustomId('target_race')
            // The label is the prompt the user sees for this input
            .setLabel("Target Race")
            .setRequired(true)
            .setPlaceholder("Tauren")
            // Short means only a single line of text
            .setStyle(TextInputStyle.Short);

        const target_reward = new TextInputBuilder()
            .setCustomId('target_reward')
            // The label is the prompt the user sees for this input
            .setLabel("Optional. Reward for successful kill.")
            .setRequired(false)
            .setPlaceholder("Eternal fame, and some gold or smt.")
            // Short means only a single line of text
            .setStyle(TextInputStyle.Paragraph);

        // An action row only holds one text input,
        // so you need one action row per text input.
        const firstActionRow = new ActionRowBuilder().addComponents(target_name);
        const secondActionRow = new ActionRowBuilder().addComponents(target_race);
        const thirdActionRow = new ActionRowBuilder().addComponents(target_reward);

        // Add inputs to the modal
        modal.addComponents(firstActionRow, secondActionRow, thirdActionRow);

        // Show the modal to the user
        await interaction.showModal(modal);
    },
}