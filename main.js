const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, GatewayIntentBits, EmbedBuilder, ActivityType } = require('discord.js');
const { token,reimburseChannel } = require('./config.json');


const client = new Client({ intents: [GatewayIntentBits.Guilds] });

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
        const bounty_name = interaction.fields.getTextInputValue('target_name');
        const bounty_race = interaction.fields.getTextInputValue('target_race');
        const bounty_reward = interaction.fields.getTextInputValue('target_race');

        const bountyEmbed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle(`Bounty requested by: ${interaction.user.username}`)
            .addFields(
                {name:"Target name", value:bounty_name, inline:false},
                     {name:"Target race", value:bounty_race, inline:false},
                     {name:"Bounty reward", value:bounty_reward, inline:false},
            );

        client.channels.cache.get('1015742051595329717').send({embeds: [bountyEmbed]});
        await interaction.reply({ content: '' });
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

client.login(token);

