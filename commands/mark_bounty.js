const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('markbounty')
        .setDescription("Update a bounty status")
        .addStringOption( option =>
            option.setName('id')
                .setDescription("ID of bounty to be marked")
                .setRequired(true)
        )
        .addBooleanOption(option =>
            option.setName('approved')
                .setDescription('Completed?')
                .setRequired(true)
        ),
    async execute(interaction) {
        if (!interaction.member.roles.cache.some(role => role.name === 'Thane' || role.name==='High Thane')) {
            return interaction.reply({
                content:'You cannot perform this command.',
            });
        }
        let bounty_id = interaction.options.getString('id');
        let approved = interaction.options.getBoolean('approved')
        let SQL = ""
        if (approved) {
            SQL = `UPDATE bounties SET completed = TRUE, completed = TRUE WHERE bounty_id = '${bounty_id}'`;
        }
        if (!approved) {
            SQL = `UPDATE bounties SET completed = FALSE, completed = TRUE WHERE bounty_id = '${bounty_id}'`;
        }
        pool.getConnection(function (err, conn) {
            if (err) return console.log(err);
            conn.query(SQL, function (err) {
                if (err) throw err;
                console.log("Bounty logged in DB")
            });
        });
        if (approved) {
            return interaction.reply({
                content:`Bounty marked as completed. ${bounty_id}`,

            });
        }
        if (!approved) {
            return interaction.reply({
                content:`Bounty has been removed. ${bounty_id}`,
            });
        }
    },
};