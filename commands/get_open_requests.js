const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('openrequests')
        .setDescription("Get open requests"),
    async execute(interaction) {
        if (!interaction.member.roles.cache.some(role => role.name === 'Thane')) {
            return interaction.reply({
                content:'You cannot perform this command.',
            });
        }
        SQL = `SELECT * FROM gb_requests WHERE completed = 0`;

        let output = ""
        pool.getConnection(function (err, conn) {
            if (err) return console.log(err);
            conn.query(SQL, function (err, results) {
                if (err) throw err;
                let out_str;
                let out = ""
                for (const res of results) {
                    out_str = ""
                    out_str += `**Request ID**: __${res.request_id}__ - **Materials**: ${res.materials}\n---\n`
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