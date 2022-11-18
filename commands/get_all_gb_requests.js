const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('getallrequests')
        .setDescription("Get all requests - (For tracking purposes)"),
    async execute(interaction) {
        if (!interaction.member.roles.cache.some(role => role.name === 'Thane')) {
            return interaction.reply({
                content:'You cannot perform this command.',
            });
        }
        SQL = `SELECT * FROM gb_requests`;

        let output = ""
        pool.getConnection(function (err, conn) {
            if (err) return console.log(err);
            conn.query(SQL, function (err, results) {
                if (err) throw err;
                let out_str;
                let out = ""
                for (const res of results) {
                    out_str = ""
                    out_str += `**ID**: __${res.request_id}__`+
                        ` **Completed**: ${res.completed === 1 ? "True": "False"}\n`
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