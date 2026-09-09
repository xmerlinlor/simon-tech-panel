import { mainMenu } from "./menu.js";

export function registerVip(bot) {
  bot.action("vip", async (ctx) => {
    await ctx.answerCbQuery();

    await ctx.reply(
`╭━━━〔 💎 SIMON TECH VIP 〕━━━╮
┃
┃ 👑 VIP FEATURES
┃
┃ ⚡ Priority panel creation
┃ 📦 More panel options
┃ 🎁 Extra daily rewards
┃ 🚀 Priority support
┃ 💰 VIP point bonuses
┃
┃ ─────────────────────────
┃
┃ 🔒 VIP SYSTEM
┃
┃ VIP activation will be added
┃ when the points/payment system
┃ is completed.
┃
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯`,
      mainMenu()
    );
  });
}
