const Database = require("wow-classic-items");
const { EmbedBuilder } = require('discord.js');

const items = new Database.Items()
const professions = new Database.Professions()
const zones = new Database.Zones()
const classes = new Database.Classes()

const { SlashCommandBuilder } = require('discord.js');

tooltip_colors= {
    "POOR":0x9d9d9d,
    "COMMON" : 0xffffff,
    "UNCOMMON" : 0x1eff00,
    "RARE" : 0x0070dd,
    "EPIC" : 0xa335ee,
    "LEGENDARY" : 0xff8000,
    "MISC" : 0xD7D100,
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('find')
        .setDescription('Finds an item in the WoW Classic database.')
        .addStringOption(option =>
            option.setName("item-name")
                .setDescription("The name of the item you're looking for")
                .setRequired(true)
                .setAutocomplete(true)),
    async execute(interaction) {
        const item = interaction.options.getString("text")

        // TODO - Improve search algorithm of the database to allow a list of items that could match if the exact name is not found.
        const found_item = items.filter((i) => i.name === item)[0]
        let tooltip = found_item.tooltip

        let wowhead_url = 'https://classic.wowhead.com/item=' +
            (found_item.itemId).toString()
        // https://wow.zamimg.com/images/wow/icons/large/
        icon_url = (found_item.icon).toString()
        console.log(wowhead_url)
        console.log(icon_url)
        const itemEmbed = new EmbedBuilder()
            .setTitle(tooltip[0].label)
            .setDescription(tooltip[1].label)
            .setColor(tooltip_colors[(tooltip[0].format).toUpperCase()])
            .setURL(wowhead_url)
            .setThumbnail(icon_url)
        // switch (found_item.class){
        //     case "Weapon":
        let value_string = ''
        for (let i = 2; i < tooltip.length; i++) {
            if (tooltip[i].label === 'Sell Price:') {
                const sellPrice = found_item.sellPrice
                let g = ~~(sellPrice / 10000)
                // console.log(g)
                let s = ~~((sellPrice-(g*10000)) / 100)
                // console.log(s)
                let c = sellPrice-(g*10000)-(s*100)
                // console.log(c)
                value_string += tooltip[i].label +` **${g}g ${s}s ${c}c**\n`;
            } else if (tooltip[i].format === 'alignRight') {
                value_string += `**${tooltip[i].label}**` + '\n';
            } else if (tooltip[i].label.startsWith('Use:')) {
                value_string += `*${tooltip[i].label}*` + '\n';
            } else if (tooltip[i].label.startsWith('Chance on hit:')) {
                value_string += `*${tooltip[i].label}*` + '\n';
            } else if (tooltip[i].label.startsWith('Equip:')) {
                value_string += `*${tooltip[i].label}*` + '\n';
            } else {
                value_string += tooltip[i].label + '\n';
            }
        }
        itemEmbed.addFields({
            name: 'Tooltip',
            value: value_string,
            inline: true })
        // }


        return interaction.reply({ embeds: [itemEmbed] });
    },
};