const { SlashCommandBuilder, EmbedBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder} = require('discord.js');
const { token } = require('../config.json');
const axios = require('axios').default;


module.exports = {
    data: new SlashCommandBuilder()
        .setName('bounty')
        .setDescription('Registers a new bounty for your fellows to hunt.')
        .addSubcommand(subcommand =>
            subcommand
                .setName('claim')
                .setDescription("Claim an open submission")
                .addStringOption(option => option.setName("target").setDescription("Target username").setRequired(true))
                )
        .addSubcommand(subcommand =>
            subcommand
                .setName('register')
                .setDescription("Register a new bounty")
                .addStringOption(option => option.setName("target").setDescription("Target username").setRequired(true))
                .addStringOption(option => option.setName("reward").setDescription("Reward for completing the bounty").setRequired(true))
                .addStringOption(option => option.setName("race").setDescription("Target race").setRequired(false))
                .addStringOption(option => option.setName("class").setDescription("Target class").setRequired(false))

            ),
    async execute(interaction) {
        const username = interaction.options.getString("target")
        if (interaction.options._subcommand === "register") {

            // const modal = new ModalBuilder()
            //     .setCustomId('myModal')
            //     .setTitle('My Modal');
            //
            // // Add components to modal
            //
            // // Create the text input components
            // const favoriteColorInput = new TextInputBuilder()
            //     .setCustomId('favoriteColorInput')
            //     // The label is the prompt the user sees for this input
            //     .setLabel("What's your favorite color?")
            //     // Short means only a single line of text
            //     .setStyle(TextInputStyle.Short);
            //
            // const hobbiesInput = new TextInputBuilder()
            //     .setCustomId('hobbiesInput')
            //     .setLabel("What's some of your favorite hobbies?")
            //     // Paragraph means multiple lines of text.
            //     .setStyle(TextInputStyle.Paragraph);
            //
            // // An action row only holds one text input,
            // // so you need one action row per text input.
            // const firstActionRow = new ActionRowBuilder().addComponents(favoriteColorInput);
            // const secondActionRow = new ActionRowBuilder().addComponents(hobbiesInput);
            //
            // // Add inputs to the modal
            // modal.addComponents(firstActionRow, secondActionRow);
            //
            // // Show the modal to the user
            // await interaction.showModal(modal);
            //
            // if (!interaction.isModalSubmit()) return;
            // if (interaction.customId === 'myModal') {
            //     await interaction.reply({ content: 'Your submission was received successfully!' });
            // }



            const reward = interaction.options.getString("reward")
            const race = interaction.options.getString("race")
            const pClass = interaction.options.getString("class")
            // POST
            const response = await axios.post('http://localhost:8080/bounty',{
            playerName: username, playerRace: race, playerClass: pClass, reward: reward
            });
            const bounty = await response.data;
            console.log(response)

            const itemEmbed = new EmbedBuilder()
                .setTitle("*Bounty registered:* "+bounty.playerName)
                .setDescription(`**Class:** ${bounty.playerClass} | **Race:** ${bounty.playerRace}`)
                .setColor(0x8b0000)
                .setThumbnail("https://wow.zamimg.com/images/wow/icons/large/ability_hunter_snipershot.jpg")
                .addFields({name:`*Reward for termination:*`, value:`${bounty.reward}`, inline:false})
                .setFooter({ text: `Happy hunting!`});
            return interaction.reply({ embeds: [itemEmbed] });
        }
        else if (interaction.options._subcommand === "claim") {
            console.log("Claiming...")
            const response = await axios.get(`http://localhost:8080/bounty/complete/${username}`);
            const bounty = await response.data;
            const itemEmbed = new EmbedBuilder()
                .setTitle("*Bounty marked as completed:* "+bounty.playerName)
                .setDescription(`**Class:** ${bounty.playerClass} | **Race:** ${bounty.playerRace}`)
                .setColor(0x8b0000)
                .setThumbnail("https://wow.zamimg.com/images/wow/icons/large/ability_rogue_feigndeath.jpg")
                .addFields({name:`*Reward for termination:*`, value:`${bounty.reward}`, inline:false})
                .setFooter({ text: `Well done!`});
            await interaction.reply({embeds: [itemEmbed] });
        }
    },
};