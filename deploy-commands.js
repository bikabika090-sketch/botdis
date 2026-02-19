const { REST, Routes, SlashCommandBuilder } = require('discord.js');

const commands = [
    new SlashCommandBuilder()
        .setName('store')
        .setDescription('Mở menu VNHeart Store')
        .toJSON()
];

const rest = new REST({ version: '10' }).setToken('MTQ3MzgyNjY3ODM3NDUzMTM0Mg.GvEi8g.s9X4xWWNuACXSVrBHHqlnVAQE9k5ZXIEr_JZSU');

(async () => {
    try {
        console.log('Đang đăng ký slash command...');

        await rest.put(
            Routes.applicationGuildCommands(
                '1473826678374531342',
                '1323919712211701861'
            ),
            { body: commands }
        );

        console.log('Đăng ký thành công!');
    } catch (error) {
        console.error(error);
    }
})();
