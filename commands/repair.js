const { SlashCommandBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder} = require('discord.js');
module.exports = {
    data: new SlashCommandBuilder()
        .setName("reimburse")
        .setDescription("Request a reimbursement for costs."),
    async execute(interaction) {

        const modal = new ModalBuilder()
            .setCustomId('reimburseModal')
            .setTitle('Reimbursement Invoice');

        // Add components to modal

        // Create the text input components
        const repair_costs = new TextInputBuilder()
            .setCustomId('costs')
            // The label is the prompt the user sees for this input
            .setLabel("How much should the Anvilguard reimburse you?")
            .setRequired(true)
            .setPlaceholder("e.g. 7.5G for repairs")
            // Short means only a single line of text
            .setStyle(TextInputStyle.Short);

        const context_costs = new TextInputBuilder()
            .setCustomId('costs_context')
            // The label is the prompt the user sees for this input
            .setLabel("Optional. Context for the amount?")
            .setRequired(false)
            .setPlaceholder("e.g. I like dying to mobs.")
            // Short means only a single line of text
            .setStyle(TextInputStyle.Paragraph);

        // An action row only holds one text input,
        // so you need one action row per text input.
        const firstActionRow = new ActionRowBuilder().addComponents(repair_costs);
        const secondActionRow = new ActionRowBuilder().addComponents(context_costs);

        // Add inputs to the modal
        modal.addComponents(firstActionRow, secondActionRow);

        // Show the modal to the user
        await interaction.showModal(modal);
    },
}