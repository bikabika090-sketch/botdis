require('dotenv').config();

const {
    Client,
    GatewayIntentBits,
    EmbedBuilder,
    ActionRowBuilder,
    StringSelectMenuBuilder,
    ButtonBuilder,
    ButtonStyle,
    ChannelType,
    PermissionsBitField,
    REST,
    Routes,
    SlashCommandBuilder
} = require("discord.js");

const TOKEN = process.env.TOKEN;
const CLIENT_ID = process.env.CLIENT_ID; // Bot ID
const GUILD_ID = process.env.GUILD_ID;   // Server ID (để đăng ký nhanh)

const OWNER_ID = "1254681345406402621";

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.MessageContent
    ]
});

/* =========================
   REGISTER SLASH COMMAND
========================= */
async function registerCommands() {

    const commands = [
        new SlashCommandBuilder()
            .setName("store")
            .setDescription("Mở menu tạo ticket dịch vụ")
            .toJSON()
    ];

    const rest = new REST({ version: "10" }).setToken(TOKEN);

    try {
        console.log("🔄 Đang đăng ký slash command...");

        await rest.put(
            Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
            { body: commands }
        );

        console.log("✅ Đã đăng ký slash command thành công!");
    } catch (error) {
        console.error(error);
    }
}

/* =========================
   READY
========================= */
client.once("ready", async () => {
    console.log(`🔥 Bot online: ${client.user.tag}`);
    await registerCommands();
});

/* =========================
   INTERACTION
========================= */
client.on("interactionCreate", async interaction => {
    try {

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

        if (interaction.isStringSelectMenu()) {

            if (interaction.customId === "select_service") {

                const service = interaction.values[0];

                const existingChannel = interaction.guild.channels.cache.find(
                    c => c.name === `ticket-${interaction.user.id}`
                );

                if (existingChannel) {
                    return interaction.reply({
                        content: `⚠ Bạn đã có ticket: ${existingChannel}`,
                        ephemeral: true
                    });
                }

                const channel = await interaction.guild.channels.create({
                    name: `ticket-${interaction.user.id}`,
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
                    .setDescription(
`👤 Khách hàng: ${interaction.user}
🛒 Dịch vụ: **${service.toUpperCase()}**
📌 Owner: <@${OWNER_ID}>`
                    );

                const row = new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                        .setCustomId("close_ticket")
                        .setLabel("🔒 Close Ticket")
                        .setStyle(ButtonStyle.Danger)
                );

                await channel.send({
                    content: `<@${OWNER_ID}>`,
                    embeds: [embed],
                    components: [row]
                });

                await interaction.reply({
                    content: `✅ Đã tạo ticket: ${channel}`,
                    ephemeral: true
                });
            }
        }

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

    } catch (err) {
        console.error("❌ Interaction error:", err);
    }
});

client.login(TOKEN);
