const { SlashCommandBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder,
    EmbedBuilder,
    ButtonBuilder,
    ButtonStyle
} = require('discord.js');
const {guildbank_channel, access_to_buttons} = require("../config.json");
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

client.on('interactionCreate', async interaction => {
    if (interaction.customId === 'gbrequestModal') {
        const materials = interaction.fields.getTextInputValue('mat_description');
        const justification = interaction.fields.getTextInputValue('mat_justification');

        const materialEmbed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setAuthor({name:`Request by: ${interaction.user.username}`, iconURL:'https://imgur.com/vYQlnnA.png'})
            .setTitle(`Guildbank URL`)
            .setFooter({text: "Loremaster Hendrik", iconURL:'https://i.imgur.com/vYQlnnA.png'})
            .setThumbnail('https://wow.zamimg.com/uploads/blog/images/17231-wow-classic-goldmaking-guide-best-professions-farming-spots-auction-house.jpg')
            .setURL('https://docs.google.com/spreadsheets/d/1e4ZP62ybJmjpoWk8mVjgvxoQhOP-ldenVuRQy6-62uY/edit?usp=sharing\'')
            .addFields(
                {name:"Request materials", value:materials, inline:false},
                {name:"Justification | Optional", value:justification, inline:false},
            );

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('material_success')
                    .setLabel('Approved')
                    .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                    .setCustomId('material_cancelled')
                    .setLabel('Denied')
                    .setStyle(ButtonStyle.Danger)
            );

        client.channels.cache.get(guildbank_channel).send({embeds: [materialEmbed], components: [row]});
        await interaction.reply({ content: 'Request is being processed.' });

        const buttonFilter = i => i.customId === 'material_success' || i.customId==="material_cancelled" && i.user.id in access_to_buttons;
        const collector = client.channels.cache.get(guildbank_channel).createMessageComponentCollector({ buttonFilter, time: 15000 });

        collector.on('collect', async i => {
            console.log(i.user.roles)
            if (i.customId === 'material_success' && access_to_buttons.includes(interaction.user.id)) {
                row.components[0].setDisabled(true);
                row.components[1].setDisabled(true);
                await i.update({ content: '**Approved**', components: [] });
            }
            if (i.customId === 'material_cancelled' && access_to_buttons.includes(interaction.user.id)) {
                row.components[0].setDisabled(true);
                row.components[1].setDisabled(true);
                await i.update({ content: '**Denied**', components: [] });
            }
        });
    }
})