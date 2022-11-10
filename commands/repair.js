const { SlashCommandBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder,
    EmbedBuilder,
    ButtonBuilder,
    ButtonStyle
} = require('discord.js');
const {reimbursement_channel, access_to_buttons} = require("../config.json");

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

client.on('interactionCreate', async interaction => {
    if (!interaction.isModalSubmit()) return;
    if (interaction.customId === 'reimburseModal') {
        const costs = interaction.fields.getTextInputValue('costs');
        const costs_context = interaction.fields.getTextInputValue('costs_context');
        console.log({costs_context, costs})
        const reimburseEmbed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle(`Reimburse request by: ${interaction.user.username}`)
            .addFields(
                {name: "Amount", value: costs, inline: false},
            );
        if (costs_context.trim() !== "") {
            reimburseEmbed.addFields(
                {name: "Context", value: costs_context, inline: false}
            );
        } else {
            reimburseEmbed.addFields(
                {name: "Context", value: "Not provided", inline: false}
            );
        }
        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('reimburse_success')
                    .setLabel('Approved')
                    .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                    .setCustomId('reimburse_cancelled')
                    .setLabel('Denied')
                    .setStyle(ButtonStyle.Danger)
            );

        // Send message to Thane channel to trace the requests that get sent in.
        client.channels.cache.get(reimbursement_channel).send({embeds: [reimburseEmbed], components: [row]});
        await interaction.reply({content: 'Your submission was received successfully!'});

        const buttonFilter = i => i.customId === 'reimburse_success' || i.customId === "reimburse_cancelled" && i.user.id in access_to_buttons;
        const collector = client.channels.cache.get(reimbursement_channel).createMessageComponentCollector({
            buttonFilter,
            time: 15000
        });

        collector.on('collect', async i => {
            if (i.customId === 'reimburse_success' && access_to_buttons.includes(interaction.user.id)) {
                row.components[0].setDisabled(true);
                row.components[1].setDisabled(true);
                await i.update({content: '**Approved**', components: []});
            }
            if (i.customId === 'reimburse_cancelled' && access_to_buttons.includes(interaction.user.id)) {
                row.components[0].setDisabled(true);
                row.components[1].setDisabled(true);
                await i.update({content: '**Denied**', components: []});
            }
        });
    }
})