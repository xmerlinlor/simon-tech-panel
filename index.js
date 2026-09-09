import "dotenv/config";
import express from "express";
import { Telegraf } from "telegraf";

const app = express();
const PORT = process.env.PORT || 3000;
const TOKEN = process.env.TELEGRAM_BOT_TOKEN;

if (!TOKEN) {
  console.error("❌ TELEGRAM_BOT_TOKEN is missing!");
  process.exit(1);
}

const bot = new Telegraf(TOKEN);

// ============================================
// HOME / HEALTH CHECK
// ============================================

app.get("/", (req, res) => {
  res.status(200).send("⚡ Simon Tech Free Panel is ONLINE");
});

// ============================================
// BASIC START COMMAND
// ============================================

bot.start(async (ctx) => {
  await ctx.reply(
    `╭━━━〔 ⚡ SIMON TECH FREE PANEL 〕━━━╮
┃
┃ 👋 Welcome to Simon Tech Free Panel
┃
┃ 🚀 Create and manage your free
┃    test hosting panels directly
┃    through Telegram.
┃
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯`,
    {
      reply_markup: {
        inline_keyboard: [
          [
            { text: "🚀 CREATE", callback_data: "create_panel" },
            { text: "📦 MY PANEL", callback_data: "my_panel" }
          ],
          [
            { text: "👥 REFERRAL", callback_data: "referral" },
            { text: "📋 PLANS", callback_data: "plans" }
          ],
          [
            { text: "🎁 DAILY TASKS", callback_data: "daily_tasks" },
            { text: "💎 VIP", callback_data: "vip" }
          ],
          [
            { text: "❓ HELP", callback_data: "help" },
            { text: "👑 OWNER", callback_data: "owner" }
          ],
          [
            { text: "📊 DASHBOARD", callback_data: "dashboard" }
          ]
        ]
      }
    }
  );
});

// ============================================
// BUTTON TEST
// ============================================

bot.action("help", async (ctx) => {
  await ctx.answerCbQuery();

  await ctx.reply(
    `╭━━━〔 ❓ HELP 〕━━━╮
┃
┃ 🚀 CREATE
┃ Create a new test hosting panel.
┃
┃ 📦 MY PANEL
┃ View your created panels.
┃
┃ 👥 REFERRAL
┃ Invite users and earn points.
┃
┃ 🎁 DAILY TASKS
┃ Complete tasks and earn points.
┃
┃ 💎 VIP
┃ View VIP features.
┃
┃ 📋 PLANS
┃ View available hosting plans.
┃
╰━━━━━━━━━━━━━━━━━━╯`
  );
});

// ============================================
// OTHER BUTTONS — TEMPORARY
// ============================================

bot.action(
  [
    "create_panel",
    "my_panel",
    "referral",
    "plans",
    "daily_tasks",
    "vip",
    "owner",
    "dashboard"
  ],
  async (ctx) => {
    await ctx.answerCbQuery();
    await ctx.reply(
      "⚙️ This section is being connected. The full Simon Tech system will be added next."
    );
  }
);

// ============================================
// ERROR HANDLER
// ============================================

bot.catch((err) => {
  console.error("❌ Telegram bot error:", err);
});

// ============================================
// START SERVER + BOT
// ============================================

app.listen(PORT, "0.0.0.0", async () => {
  console.log(`🌐 Simon Tech Panel running on port ${PORT}`);

  try {
    await bot.launch();
    console.log("🤖 Telegram bot is ONLINE");
  } catch (error) {
    console.error("❌ Failed to start Telegram bot:", error);
  }
});

// ============================================
// GRACEFUL SHUTDOWN
// ============================================

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
