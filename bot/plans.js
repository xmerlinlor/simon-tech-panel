import { mainMenu } from "./menu.js";

export function registerPlans(bot) {
  bot.action("plans", async (ctx) => {
    await ctx.answerCbQuery();

    await ctx.reply(
`╭━━━〔 📋 SIMON TECH PLANS 〕━━━╮
┃
┃ 🚀 PANEL CREATION
┃
┃ 💳 Cost: 200 Points
┃
┃ ─────────────────────────
┃
┃ 🐍 Python
┃ 🟢 Node.js
┃ 🛠️ Admin Panel
┃
┃ ─────────────────────────
┃
┃ 💾 AVAILABLE DATA
┃
┃ 🔹 2GB
┃ 🔹 4GB
┃ 🔹 6GB
┃ 🔹 8GB
┃ 🔹 10GB
┃ 🔹 11GB — UNLIMITED
┃
┃ ─────────────────────────
┃
┃ 👥 Referral Reward
┃ +50 Points / Referral
┃
┃ 🎁 Daily Task
┃ +25 Points / Day
┃
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯`,
      mainMenu()
    );
  });
}
