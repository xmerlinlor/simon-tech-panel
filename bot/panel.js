import { getUser, getUserPanels } from "../utils/database.js";
import { mainMenu, backButton } from "./menu.js";

export function registerPanel(bot) {
  // ============================================
  // MY PANEL
  // ============================================

  bot.action("my_panel", async (ctx) => {
    await ctx.answerCbQuery();

    const userId = ctx.from.id;
    const user = getUser(userId);

    if (!user) {
      return ctx.reply(
        "❌ You don't have an account yet.\n\nTap 🚀 CREATE to get started.",
        mainMenu()
      );
    }

    const panels = getUserPanels(userId);

    if (!panels.length) {
      return ctx.reply(
`╭━━━〔 📦 MY PANEL 〕━━━╮
┃
┃ You don't have any panels yet.
┃
┃ 🚀 Create your first test panel
┃ using the CREATE button.
┃
╰━━━━━━━━━━━━━━━━━━━━━━╯`,
        mainMenu()
      );
    }

    let message =
`╭━━━〔 📦 MY PANELS 〕━━━╮
┃
┃ 👤 ${user.firstName || "User"}
┃ 💰 Points: ${user.points || 0}
┃
`;

    panels.forEach((panel, index) => {
      message +=
`┃
┃ ${index + 1}. 🆔 ${panel.id}
┃    🖥️ ${panel.type}
┃    💾 ${panel.plan}
┃    🟢 ${panel.status}
┃
`;
    });

    message +=
`╰━━━━━━━━━━━━━━━━━━━━━━╯`;

    await ctx.reply(message, mainMenu());
  });

  // ============================================
  // DASHBOARD
  // ============================================

  bot.action("dashboard", async (ctx) => {
    await ctx.answerCbQuery();

    const userId = ctx.from.id;
    const user = getUser(userId);

    if (!user) {
      return ctx.reply(
        "❌ Account not found.\n\nTap 🚀 CREATE to register.",
        mainMenu()
      );
    }

    const panels = getUserPanels(userId);

    await ctx.reply(
`╭━━━〔 📊 DASHBOARD 〕━━━╮
┃
┃ 👤 USER
┃ ${user.firstName || "Unknown"}
┃
┃ 🆔 ID
┃ ${user.id}
┃
┃ 💰 POINTS
┃ ${user.points || 0}
┃
┃ 📦 PANELS
┃ ${panels.length}
┃
┃ 👥 REFERRAL CODE
┃ ${user.referralCode || "N/A"}
┃
┃ 🟢 ACCOUNT
┃ ACTIVE
┃
╰━━━━━━━━━━━━━━━━━━━━━━╯`,
      mainMenu()
    );
  });

  // ============================================
  // BACK TO MAIN MENU
  // ============================================

  bot.action("main_menu", async (ctx) => {
    await ctx.answerCbQuery();

    await ctx.reply(
`╭━━━〔 ⚡ SIMON TECH FREE PANEL 〕━━━╮
┃
┃ Select an option below.
┃
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯`,
      mainMenu()
    );
  });
}
