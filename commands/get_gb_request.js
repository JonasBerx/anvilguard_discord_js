const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('getrequest')
        .setDescription("Get open requests")
        .addStringOption( option =>
            option.setName('id')
                .setDescription("ID of request")
                .setRequired(true)
        ),
    async execute(interaction) {
        if (!interaction.member.roles.cache.some(role => role.name === 'Thane')) {
            return interaction.reply({
                content:'You cannot perform this command.',
            });
        }
        let request_id = interaction.options.getString('id');
        SQL = `SELECT * FROM gb_requests WHERE request_id = '${request_id}'`;

        let output = ""
        pool.getConnection(function (err, conn) {
            if (err) return console.log(err);
            conn.query(SQL, function (err, results) {
                if (err) throw err;
                let out_str;
                let out = ""
                for (const res of results) {
                    console.log(res)
                    out_str = ""
                    out_str += `**Request ID**: __${res.request_id}__ - **Materials**: ${res.materials}\n` +
                    `**Time of request**: ${res.ts}\n` +
                    `**Completed**: ${res.completed === 1 ? "True": "False"}\n` +
                    `**Approved**: ${res.approved != null ? (res.approved === 1 ? "True" : "False") : "False"}\n` +
                    `**Info**: ${res.info}`

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