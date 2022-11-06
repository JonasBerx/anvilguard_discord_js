const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, GatewayIntentBits, EmbedBuilder, ActivityType, Events, Partials, channelLink,
    ActionRowBuilder, ButtonBuilder, ButtonStyle,
} = require('discord.js');
const { token, access_to_buttons, bounty_channel, guildbank_channel, reimbursement_channel, welcome_channel } = require('./config.json');


const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.GuildMembers],
    partials: [Partials.Message, Partials.Channel, Partials.Reaction], });

client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    client.commands.set(command.data.name, command);
}

client.once('ready', () => {
    console.log('Ready!');
    client.user.setPresence({ activities: [{ name: 'EverlookWoW' }], status: 'online' });

});

client.on('guildMemberAdd', async member => {
    console.log(member)

    let member_id = member.user.id
    const tavern_channel = '982689005072187414'
    const welcome_channel = '987423966710861904'
    const bot_welcome_channel = '1035211574488596622'
    const announcements_channel = '992836933942259813'
    let ch = member.guild.channels.cache.get(bot_welcome_channel)
    let welcome_str = `Well met <@${member.id}>! Welcome to **The Anvilguard**!\nMake sure to check the ${member.guild.channels.cache.get(welcome_channel).toString()} and ${member.guild.channels.cache.get(announcements_channel).toString()} first! \n\nCome join us in the ${member.guild.channels.cache.get(tavern_channel).toString()}`
    await member.guild.channels.cache.get(bot_welcome_channel).send(welcome_str);
});




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
                {name:"Amount", value:costs, inline:false},

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
        await interaction.reply({ content: 'Your submission was received successfully!' });

        const buttonFilter = i => i.customId === 'reimburse_success' || i.customId==="reimburse_cancelled" && i.user.id in access_to_buttons;
        const collector = client.channels.cache.get(reimbursement_channel).createMessageComponentCollector({ buttonFilter, time: 15000 });

        collector.on('collect', async i => {
            if (i.customId === 'reimburse_success' && access_to_buttons.includes(interaction.user.id)) {
                row.components[0].setDisabled(true);
                row.components[1].setDisabled(true);
                await i.update({ content: '**Approved**', components: [] });
            }
            if (i.customId === 'reimburse_cancelled' && access_to_buttons.includes(interaction.user.id)) {
                row.components[0].setDisabled(true);
                row.components[1].setDisabled(true);
                await i.update({ content: '**Denied**', components: [] });
            }
        });
    }
    if (interaction.customId === 'bountyModal') {
        const bounty_name = interaction.fields.getTextInputValue('target_name');
        const bounty_race = interaction.fields.getTextInputValue('target_race');
        const bounty_reward = interaction.fields.getTextInputValue('target_reward');

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
            )
            .setFooter({text: "Loremaster Hendrik", iconURL: 'https://i.imgur.com/vYQlnnA.png'});

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('bounty_success')
                    .setLabel('Completed')
                    .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                    .setCustomId('bounty_cancelled')
                    .setLabel('Cancelled')
                    .setStyle(ButtonStyle.Danger)
            );

        client.channels.cache.get(bounty_channel).send({embeds: [bountyEmbed], components:[row]});
        await interaction.reply({content: 'Bounty has successfully been marked.'});

        const buttonFilter = i => i.customId === 'bounty_success' || i.customId==="bounty_cancelled" && access_to_buttons.includes(interaction.user.id);
        const collector = client.channels.cache.get(bounty_channel).createMessageComponentCollector({ buttonFilter, time: 15000 });

        collector.on('collect', async i => {
            if (i.customId === 'bounty_success' && access_to_buttons.includes(interaction.user.id)) {
                row.components[0].setDisabled(true);
                row.components[1].setDisabled(true);
                await i.update({ content: '**Completed**', components: [] });
            }
            if (i.customId === 'bounty_cancelled' && access_to_buttons.includes(interaction.user.id)) {
                row.components[0].setDisabled(true);
                row.components[1].setDisabled(true);
                await i.update({ content: '**Cancelled**', components: [] });
            }
        });
    }
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
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
});

client.on('interactionCreate', async (button) => {
    if (!button.isButton()) return;
    console.log(access_to_buttons.includes(button.user.id))
    console.log(button.member.roles.find( r => r.name === 'Thane'))
    if (!access_to_buttons.includes(button.user.id)) return;
    if (!button.member.roles.find( r => r.name === 'Thane')) return;

    if (button.customId === "reimburse_cancelled") {
        button.message.components[0].components[0].data.disabled = true
        await button.update({ content: '**Denied**', components: [] });
    }
    if (button.customId === "material_cancelled") {
        button.message.components[0].components[0].data.disabled = true
        await button.update({ content: '**Denied**', components: [] });
    }
    if (button.customId === "bounty_cancelled") {
        button.message.components[0].components[0].data.disabled = true
        await button.update({ content: '**Cancelled**', components: [] });
    }
    if (button.customId === "reimburse_success") {
        button.message.components[0].components[0].data.disabled = true
        await button.update({ content: '**Approved**', components: [] });
    }
    if (button.customId === "material_success") {
        button.message.components[0].components[0].data.disabled = true
        await button.update({ content: '**Approved**', components: [] });
    }
    if (button.customId === "bounty_success") {
        button.message.components[0].components[0].data.disabled = true
        await button.update({ content: '**Completed**', components: [] });

    }
});

client.login(token);

