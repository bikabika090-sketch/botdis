const {
    Client,
    GatewayIntentBits,
    EmbedBuilder,
    ActionRowBuilder,
    StringSelectMenuBuilder,
    ButtonBuilder,
    ButtonStyle,
    ChannelType,
    PermissionsBitField
} = require("discord.js");

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers
    ]
});

const TOKEN = "MTQ3MzgyNjY3ODM3NDUzMTM0Mg.G9bGTO.Vh6MR6HXqeyMje7JPyKoltHpzxeS01sx3XOSwI";
const OWNER_ID = "1254681345406402621"; // ID của nhoemm_

client.once("ready", () => {
    console.log(`🔥 Bot đã online: ${client.user.tag}`);
});

client.on("interactionCreate", async interaction => {

    // ===== LỆNH /store =====
    if (interaction.isChatInputCommand()) {

        if (interaction.commandName === "store") {

            const embed = new EmbedBuilder()
                .setColor("Green")
                .setTitle("✨ VNHEART STORE - DỊCH VỤ PREMIUM ✨")
                .setDescription("🔹 Chọn dịch vụ bên dưới để tạo ticket");

            const menu = new StringSelectMenuBuilder()
                .setCustomId("select_service")
                .setPlaceholder("Chọn dịch vụ...")
                .addOptions([
                    { label: "Mua Plugin", value: "plugin" },
                    { label: "Mua Datapack", value: "datapack" },
                    { label: "Mua File Setup", value: "setup" },
                    { label: "Thuê Dev", value: "dev" },
                    { label: "Optimize Server", value: "optimize" }
                ]);

            const row = new ActionRowBuilder().addComponents(menu);

            await interaction.reply({
                embeds: [embed],
                components: [row],
                ephemeral: true
            });
        }
    }

    // ===== CHỌN DỊCH VỤ =====
    if (interaction.isStringSelectMenu()) {

        if (interaction.customId === "select_service") {

            const service = interaction.values[0];

            const channel = await interaction.guild.channels.create({
                name: `ticket-${interaction.user.username}`,
                type: ChannelType.GuildText,
                permissionOverwrites: [
                    {
                        id: interaction.guild.id,
                        deny: [PermissionsBitField.Flags.ViewChannel]
                    },
                    {
                        id: interaction.user.id,
                        allow: [
                            PermissionsBitField.Flags.ViewChannel,
                            PermissionsBitField.Flags.SendMessages
                        ]
                    },
                    {
                        id: OWNER_ID,
                        allow: [
                            PermissionsBitField.Flags.ViewChannel,
                            PermissionsBitField.Flags.SendMessages
                        ]
                    }
                ]
            });

            const embed = new EmbedBuilder()
                .setColor("Yellow")
                .setTitle("📩 Ticket Support")
                .setDescription(`
👤 Khách hàng: ${interaction.user}
🛒 Dịch vụ: **${service.toUpperCase()}**
📌 Owner: <@${OWNER_ID}>
`);

            const row = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId("close_ticket")
                    .setLabel("Close")
                    .setStyle(ButtonStyle.Danger)
            );

            await channel.send({
                content: `<@${OWNER_ID}>`,
                embeds: [embed],
                components: [row],
                allowedMentions: { parse: ["users"] }
            });

            await interaction.reply({
                content: `✅ Đã tạo ticket: ${channel}`,
                ephemeral: true
            });
        }
    }

    // ===== CLOSE TICKET =====
    if (interaction.isButton()) {

        if (interaction.customId === "close_ticket") {

            await interaction.reply({
                content: "🔒 Ticket sẽ đóng sau 5 giây..."
            });

            setTimeout(() => {
                interaction.channel.delete().catch(() => {});
            }, 5000);
        }
    }
});

client.login('MTQ3MzgyNjY3ODM3NDUzMTM0Mg.G9bGTO.Vh6MR6HXqeyMje7JPyKoltHpzxeS01sx3XOSwI');
