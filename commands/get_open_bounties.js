const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('openbounties')
        .setDescription("Get open bounties"),
    async execute(interaction) {
        SQL = `SELECT * FROM bounties WHERE completed = false`;

        let output = ""
        pool.getConnection(function (err, conn) {
            if (err) return console.log(err);
            conn.query(SQL, function (err, results) {
                if (err) throw err;
                let out_str;
                let out = ""
                for (const res of results) {
                    out_str = ""
                    out_str += `**Bounty ID**: __${res.bounty_id}__ - **Target Name**: ${res.target} **Target Race**: ${res.race}\n`
                    out += out_str
                }
                return interaction.reply({
                    content: out,
                    ephemeral: true
                });
            });
        });
    },
};