const fs = require('node:fs');
const path = require('node:path');
const { Client, GatewayIntentBits, EmbedBuilder, Partials,
    ActionRowBuilder, ButtonBuilder, ButtonStyle, Collection,
} = require('discord.js');
const { token, access_to_buttons, bounty_channel, guildbank_channel, reimbursement_channel, welcome_channel, db_host,db_username,db_password,db_database} = require('./config.json');
const {createPool} = require('mysql2')

const pool = createPool({
    host:db_host,
    user:db_username,
    password:db_password,
    database:db_database,
    waitForConnections: true,
    connectionLimit: 10,
})

pool.getConnection(function(err, conn) {
    // Console log if there is an error
    if (err) return console.log(err);
    // No error found?
    console.log(`MySQL has been connected!`);

    var SQL = "CREATE TABLE IF NOT EXISTS bounties (bounty_id VARCHAR(16) PRIMARY KEY, completed BOOLEAN NOT NULL, author VARCHAR(255) NOT NULL, target VARCHAR(255) NOT NULL, race VARCHAR(25) NOT NULL, info VARCHAR(4000) NOT NULL)";
    // SQL = "DROP TABLE bounties";
    conn.query(SQL, function (err) {
        if (err) throw err;
        console.log("Bounties created")
    });
});




const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.GuildMembers],
    partials: [Partials.Message, Partials.Channel, Partials.Reaction], });

global.client = client
global.pool = pool

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
    if (!(access_to_buttons.indexOf(button.user.id) > -1)) {
        console.log("Should get message button reset")
        await button.message.reply("You cannot perform this action!");
        await i.deferUpdate()
    }

    object_id = button.customId.split('_')[0]
    object_type = button.customId.split('_')[1]
    object_result = button.customId.split('_')[2]

    console.log(button.customId)
    console.log(object_type)
    console.log(object_result)

    if (object_type === 'bounty') {
        console.log(access_to_buttons.indexOf(button.user.id))
        let author = ""
        pool.getConnection(async function (err, conn) {
            if (err) return console.log(err);
            var sql1 = `SELECT author from bounties WHERE bounty_id = '${object_id}'`

            conn.query(sql1, function (err, result) {
                if (err) throw err;
                console.log(result[0])
                author = result[0]['author']
            });

            console.log(author)
            console.log(button.user.id)
            console.log(access_to_buttons.indexOf(button.user.id) > -1)

            if (access_to_buttons.indexOf(author) > -1) {
                var sql = `UPDATE bounties SET completed = TRUE WHERE bounty_id = '${object_id}'`;
                conn.query(sql, function (err) {
                    if (err) throw err;
                    console.log("Bounty updated in DB")
                });
            }
        })
        button.message.components[0].components[0].data.disabled = true;
        if (object_result === 'completed') {
            await button.update({content: '**Completed**', components: []});
        } else {
            await button.update({content: '**Cancelled**', components: []});
        }
    }

    if (button.customId === "reimburse_cancelled") {
        button.message.components[0].components[0].data.disabled = true;
        await button.update({ content: '**Denied**', components: [] });
    }
    if (button.customId === "material_cancelled") {
        button.message.components[0].components[0].data.disabled = true
        await button.update({ content: '**Denied**', components: [] });
    }
    // if (button.customId === "bounty_cancelled") {
    //     button.message.components[0].components[0].data.disabled = true
    //     await button.update({ content: '**Cancelled**', components: [] });
    // }
    if (button.customId === "reimburse_success") {
        button.message.components[0].components[0].data.disabled = true
        await button.update({ content: '**Approved**', components: [] });
    }
    if (button.customId === "material_success") {
        button.message.components[0].components[0].data.disabled = true
        await button.update({ content: '**Approved**', components: [] });
    }
    // if (button.customId === "bounty_success") {
    //     button.message.components[0].components[0].data.disabled = true
    //     await button.update({ content: '**Completed**', components: [] });
    //
    // }
});

client.login(token);

