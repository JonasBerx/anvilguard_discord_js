const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('gbrequest')
        .setDescription("Mark a GB request")
        .addStringOption( option =>
            option.setName('id')
                .setDescription("ID of request to be marked")
                .setRequired(true)
            )
        .addBooleanOption(option =>
            option.setName('approved')
                .setDescription('Approved or Denied?')
                .setRequired(true)
        ),
    async execute(interaction) {
        if (!interaction.member.roles.cache.some(role => role.name === 'Thane')) {
            return interaction.reply({
                content:'You cannot perform this command.',
            });
        }
        let request_id = interaction.options.getString('id');
        let approved = interaction.options.getBoolean('approved')
        let SQL = ""
        if (approved) {
            SQL = `UPDATE gb_requests SET approved = TRUE, completed = TRUE WHERE request_id = '${request_id}'`;
        }
        if (!approved) {
            SQL = `UPDATE gb_requests SET approved = FALSE, completed = TRUE WHERE request_id = '${request_id}'`;
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
                content:'Request approved.',

            });
        }
        if (!approved) {
            return interaction.reply({
                content:'Request denied.',
            });
        }
    },
};