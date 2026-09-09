import { getUser, createUser, addPoints } from "../utils/database.js";
import { mainMenu } from "./menu.js";

const DAILY_REWARD = 25;

export function registerTasks(bot) {
  bot.action("daily_tasks", async (ctx) => {
    await ctx.answerCbQuery();

    const userId = ctx.from.id;

    if (!getUser(userId)) {
      createUser(userId, {
        firstName: ctx.from.first_name || "",
        username: ctx.from.username || ""
      });
    }

    const user = getUser(userId);

    await ctx.reply(
`╭━━━〔 🎁 DAILY TASKS 〕━━━╮
┃
┃ 💰 Daily Reward
┃ +${DAILY_REWARD} points
┃
┃ Complete today's task to
┃ receive your points.
┃
╰━━━━━━━━━━━━━━━━━━━━━━━━╯`,
      {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: `🎁 CLAIM +${DAILY_REWARD} POINTS`,
                callback_data: "claim_daily"
              }
            ],
            [
              {
                text: "🔙 BACK TO MENU",
                callback_data: "main_menu"
              }
            ]
          ]
        }
      }
    );
  });

  // ============================================
  // CLAIM DAILY REWARD
  // ============================================

  bot.action("claim_daily", async (ctx) => {
    await ctx.answerCbQuery();

    const userId = ctx.from.id;

    if (!getUser(userId)) {
      createUser(userId, {
        firstName: ctx.from.first_name || "",
        username: ctx.from.username || ""
      });
    }

    const user = getUser(userId);

    const today = new Date().toISOString().slice(0, 10);

    if (user.lastDailyClaim === today) {
      return ctx.reply(
`╭━━━〔 ⏳ ALREADY CLAIMED 〕━━━╮
┃
┃ ❌ You already claimed today's
┃    reward.
┃
┃ 🎁 Come back tomorrow.
┃
┃ 💰 Current Points:
┃ ${user.points || 0}
┃
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯`,
        mainMenu()
      );
    }

    const newPoints = addPoints(userId, DAILY_REWARD);

    // Save today's claim
    const updatedUser = getUser(userId);

    updatedUser.lastDailyClaim = today;

    const { updateUser } = await import("../utils/database.js");

    updateUser(userId, {
      lastDailyClaim: today
    });

    await ctx.reply(
`╭━━━〔 🎉 REWARD CLAIMED 〕━━━╮
┃
┃ ✅ Daily task completed!
┃
┃ 🎁 Reward:
┃ +${DAILY_REWARD} points
┃
┃ 💰 Total Points:
┃ ${newPoints}
┃
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯`,
      mainMenu()
    );
  });
}
