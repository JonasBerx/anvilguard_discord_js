const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, GatewayIntentBits, EmbedBuilder, ActivityType, Events, Partials, channelLink} = require('discord.js');
const { token,reimburseChannel } = require('./config.json');


const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMessageReactions],
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




client.on('interactionCreate', async interaction => {
    if (!interaction.isModalSubmit()) return;
    if (interaction.customId === 'reimburseModal') {
        const costs = interaction.fields.getTextInputValue('costs');
        const costs_context = interaction.fields.getTextInputValue('costs_context');
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
        // Send message to Thane channel to trace the requests that get sent in.
        client.channels.cache.get(reimburseChannel).send({embeds: [reimburseEmbed]});
        await interaction.reply({ content: 'Your submission was received successfully!' });
    }
    if (interaction.customId === 'bountyModal') {

        const filter = (reaction, user) => {
            return ['👍', '👎'].includes(reaction.emoji.name) && user.id === interaction.user.id;
        };

        const bounty_name = interaction.fields.getTextInputValue('target_name');
        const bounty_race = interaction.fields.getTextInputValue('target_race');
        const bounty_reward = interaction.fields.getTextInputValue('target_race');

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
                {name: "Bounty reward", value: bounty_reward, inline: false},
            )
            .setFooter({text: "Loremaster Hendrik", iconURL: 'https://i.imgur.com/vYQlnnA.png'})

        client.channels.cache.get('1015742051595329717').send({embeds: [bountyEmbed]}).then(
            embedMessage => {
                let reactionEmoji = embedMessage.guild.emojis.cache.find(emoji => emoji.name === 'wow_cross');
                embedMessage.react(reactionEmoji)
                    .then(() => {
                            reactionEmoji = embedMessage.guild.emojis.cache.find(emoji => emoji.name === 'wow_triangle');
                            embedMessage.react(reactionEmoji)
                        }
                    ).catch(err => console.error("something went wrong", err))
            });

        await interaction.reply({content: 'Bounty has successfully been marked.'});
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

        client.channels.cache.get('1015742051595329717').send({embeds: [materialEmbed]}).then(
            embedMessage => {
                let reactionEmoji = embedMessage.guild.emojis.cache.find(emoji => emoji.name === 'wow_cross');
                embedMessage.react(reactionEmoji)
                    .then(() => {
                            reactionEmoji = embedMessage.guild.emojis.cache.find(emoji => emoji.name === 'wow_triangle');
                            embedMessage.react(reactionEmoji)
                        }
                    ).catch(err => console.error("something went wrong", err))
            });
        await interaction.reply({ content: 'Request is being processed.' });
    }
});

client.on(Events.MessageReactionAdd, async(reaction, user) => {
    if (reaction.partial) {
        try {
            await reaction.fetch();

        } catch (err) {
            console.log(err)
            return;
        }
        console.log(reaction.message)
        // TODO also add channel IDS here
        // TODO WTF IS Going on here?
        if (reaction.emoji.name === 'anvilguard' && reaction.message.channelId === '999755188837552221' && user.id==='232566719183323136') {
            reaction.message.reactions.removeAll().catch(err => {
                console.log("err")})
            await reaction.message.reply("Bounty has been completed.")
        }
        if (reaction.emoji.name === 'anvilguard' && reaction.message.channelId === '1015742051595329717' && user.id==='232566719183323136') {
            reaction.message.reactions.removeAll().catch(err => {
                console.log("err")})
            await reaction.message.reply("Request has been fulfilled.")
        }
        if (reaction.emoji.name === 'wow_cross' && reaction.message.channelId === '999755188837552221' && user.id==='232566719183323136') {
            reaction.message.reactions.removeAll().catch(err => {
                console.log("err")})
            await reaction.message.reply("Bounty has been cancelled.")

        }
        if (reaction.emoji.name === 'wow_cross' && reaction.message.channelId === '1015742051595329717' && user.id==='232566719183323136') {
            reaction.message.reactions.removeAll().catch(err => {
                console.log("err")})
            await reaction.message.reply("Request has been denied.")

        }
    }});

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

client.login(token);

