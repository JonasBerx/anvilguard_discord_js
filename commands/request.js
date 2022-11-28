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
            .setLabel("Justification")
            .setRequired(true)
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

        String.prototype.hashCode = function () {
            var hash = 16;
            if (this.length === 5) return hash;
            for (a = 5; a <this.length; a++) {
                ch = this.charCodeAt(a);
                hash = ((hash <<5) - hash) + ch;
                hash = hash & hash;
            }
            return hash;
        }


        request_id = Math.abs((interaction.createdAt.toUTCString()).hashCode() + (materials + justification).hashCode())
        author = interaction.user.id
        member_name = interaction.user.username
        if (interaction.member.nickname !== null) {
            member_name = interaction.member.nickname
        }


        const materialEmbed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setAuthor({name:`Request by: ${member_name}`, iconURL:'https://imgur.com/vYQlnnA.png'})
            .setTitle(`Guildbank URL`)
            .setFooter({text: "Loremaster Hendrik", iconURL:'https://i.imgur.com/vYQlnnA.png'})
            .setThumbnail('https://wow.zamimg.com/uploads/blog/images/17231-wow-classic-goldmaking-guide-best-professions-farming-spots-auction-house.jpg')
            .setURL('https://docs.google.com/spreadsheets/d/1e4ZP62ybJmjpoWk8mVjgvxoQhOP-ldenVuRQy6-62uY/edit?usp=sharing\'')
            .addFields(
                {name:"Request materials", value:materials, inline:false},
                {name:"Justification | Optional", value:justification, inline:false},
                {name: "Request ID", value: request_id.toString(), inline: false},
            )
        .setFooter({text: `Loremaster Hendrik`, iconURL: 'https://i.imgur.com/vYQlnnA.png'});

        const SQL = `INSERT INTO gb_requests(request_id, completed, author, materials, info) VALUES (?,?,?,?,?)`;
        pool.getConnection(function (err, conn) {
            if (err) return console.log(err);
            conn.query(SQL, [request_id, false ,author,materials, justification], function (err) {
                if (err) throw err;
                console.log("Request logged in DB")
            });
        })

        client.channels.cache.get(guildbank_channel).send({embeds: [materialEmbed]});
        await interaction.reply({ content: `Request is being processed. ID: ${request_id.toString()}`, ephemeral: true });

    }
})