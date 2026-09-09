import { mainMenu } from "./menu.js";

export function registerHelp(bot) {
  bot.action("help", async (ctx) => {
    await ctx.answerCbQuery();

    await ctx.reply(
`╭━━━〔 ❓ SIMON TECH HELP 〕━━━╮
┃
┃ 🚀 CREATE
┃ Create a new test hosting panel.
┃
┃ 📦 MY PANEL
┃ View your created panels.
┃
┃ 👥 REFERRAL
┃ Get +50 points for each
┃ successful referral.
┃
┃ 🎁 DAILY TASKS
┃ Claim +25 points once daily.
┃
┃ 📋 PLANS
┃ View available panel types
┃ and data plans.
┃
┃ 📊 DASHBOARD
┃ View your account statistics.
┃
┃ 💎 VIP
┃ View VIP features.
┃
┃ 👑 OWNER
┃ View owner information.
┃
┃
┃ 💳 PANEL COST
┃ 200 points
┃
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯`,
      mainMenu()
    );
  });
}
