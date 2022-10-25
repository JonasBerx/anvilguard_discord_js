const { SlashCommandBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder} = require('discord.js');
module.exports = {
    data: new SlashCommandBuilder()
        .setName("request")
        .setDescription("Request materials or gold from the guild bank."),
    async execute(interaction) {

        const modal = new ModalBuilder()
            .setCustomId('gbrequestModal')
            .setTitle('Materials request form');

        // Add components to modal

        // Create the text input components
        const materials = new TextInputBuilder()
            .setCustomId('mat_description')
            // The label is the prompt the user sees for this input
            .setLabel("Requested materials")
            .setRequired(true)
            .setPlaceholder("Write down the materials you wish to receive here.")
            // Short means only a single line of text
            .setStyle(TextInputStyle.Paragraph);

        const justification = new TextInputBuilder()
            .setCustomId('mat_justification')
            // The label is the prompt the user sees for this input
            .setLabel("Justification | Optional")
            .setRequired(false)
            .setPlaceholder("Leroy Jenkins wiped and I have no gold for repairs.")
            // Short means only a single line of text
            .setStyle(TextInputStyle.Paragraph);

        // An action row only holds one text input,
        // so you need one action row per text input.
        const firstActionRow = new ActionRowBuilder().addComponents(materials);
        const secondActionRow = new ActionRowBuilder().addComponents(justification);
        // Add inputs to the modal
        modal.addComponents(firstActionRow, secondActionRow);

        // Show the modal to the user
        await interaction.showModal(modal);
    },
}