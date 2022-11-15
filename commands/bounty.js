const { SlashCommandBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder,
    EmbedBuilder,
    ButtonBuilder,
    ButtonStyle
} = require('discord.js');
const {bounty_channel, access_to_buttons} = require("../config.json");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("bounty")
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
            .setLabel("Extra info; Reward / last seen?")
            .setRequired(true)
            .setPlaceholder("You get a kiss from me / last seen in Hillsbrad")
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

client.on('interactionCreate', async interaction => {
    if (!interaction.isModalSubmit()) return;
    let bounty_id;
    let author;
    if (interaction.customId === 'bountyModal') {
        const bounty_name = interaction.fields.getTextInputValue('target_name');
        const bounty_race = interaction.fields.getTextInputValue('target_race');
        const bounty_reward = interaction.fields.getTextInputValue('target_reward');

        String.prototype.hashCode = function () {
            var hash = 0,
                i, chr;
            if (this.length === 0) return hash;
            for (i = 0; i < this.length; i++) {
                chr = this.charCodeAt(i);
                hash = ((hash << 5) - hash) + chr;
                hash |= 0; // Convert to 32bit integer
            }
            return hash;
        }

        bounty_id = Math.abs((interaction.createdAt.toUTCString()).hashCode() + (bounty_name + bounty_reward + bounty_race).hashCode())
        author = interaction.user.id

        const bountyEmbed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setAuthor({
                name: `Bounty requested by: ${interaction.user.username}`,
                iconURL: 'https://imgur.com/vYQlnnA.png'
            })
            .setThumbnail('https://wow.zamimg.com/images/wow/icons/large/ability_hunter_snipershot.jpg')
            .addFields(
                {name: "Target name", value: bounty_name, inline: false},
                {name: "Target race", value: bounty_race, inline: false},
                {name: "Extra info; Reward / last seen?", value: bounty_reward, inline: false},
                {name: "Bounty ID", value: bounty_id.toString(), inline: false},
            )
            .setFooter({text: `Loremaster Hendrik`, iconURL: 'https://i.imgur.com/vYQlnnA.png'});



        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId(`${bounty_id}_bounty_completed`)
                    .setLabel('Completed')
                    .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                    .setCustomId(`${bounty_id}_bounty_cancelled`)
                    .setLabel('Cancelled')
                    .setStyle(ButtonStyle.Danger)
            );

        const SQL = `INSERT INTO bounties(bounty_id, completed, author, target, race, info) VALUES ('${bounty_id}', FALSE, '${author}', '${bounty_name}', '${bounty_race}', '${bounty_reward}')`;

        pool.getConnection(function (err, conn) {
            if (err) return console.log(err);
            conn.query(SQL, function (err) {
                if (err) throw err;
                console.log("Bounty logged in DB")
            });
        })


        client.channels.cache.get(bounty_channel).send({embeds: [bountyEmbed], components: [row]});
        await interaction.reply({content: 'Bounty has successfully been marked.'});

        const buttonFilter = i => i.customId === 'bounty_success' || i.customId === "bounty_cancelled" && access_to_buttons.includes(interaction.user.id);
        const collector = client.channels.cache.get(bounty_channel).createMessageComponentCollector({
            buttonFilter,
            time: 15000
        });

        var sql = `UPDATE bounties SET completed = TRUE WHERE bounty_id = '${bounty_id}'`

        collector.on('collect', async i => {

            if (access_to_buttons.indexOf(i.user.id) > -1) {
                if (i.customId === `${bounty_id}_bounty_success`) {
                    row.components[0].setDisabled(true);
                    row.components[1].setDisabled(true);

                    pool.getConnection(function (err, conn) {
                        if (err) return console.log(err);
                        conn.query(sql, function (err) {
                            if (err) throw err;
                            console.log("Bounty logged in DB")
                        });
                    });
                    await i.update({content: '**Completed**', components: []});
                }
                if (i.customId === `${bounty_id}_bounty_cancelled`) {
                    row.components[0].setDisabled(true);
                    row.components[1].setDisabled(true);
                    await i.update({content: '**Cancelled**', components: []});
                }
            }
            if (!(access_to_buttons.indexOf(interaction.user.id) > -1)) {
                console.log("Should get message blblbl");
                await i.deferUpdate();
            }
        });
    }
})
