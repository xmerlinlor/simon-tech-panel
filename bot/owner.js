import { getUser, createUser, addPoints, updateUser } from "../utils/database.js";
import { mainMenu } from "./menu.js";

export function registerOwner(bot) {
  bot.action("owner", async (ctx) => {
    await ctx.answerCbQuery();

    const ownerId = String(process.env.OWNER_ID || "");

    await ctx.reply(
`╭━━━〔 👑 SIMON TECH OWNER 〕━━━╮
┃
┃ ⚡ Owner: Simon Tech
┃
┃ 🛡️ System:
┃ Simon Tech Free Panel
┃
┃ 🚀 Panel Mode:
┃ TEST / SIMULATOR
┃
┃ 💳 Panel Cost:
┃ 200 Points
┃
┃ 👥 Referral:
┃ +50 Points
┃
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯`,
      mainMenu()
    );
  });

  // ============================================
  // OWNER: ADD POINTS
  // Usage:
  // /addpoints USER_ID AMOUNT
  // ============================================

  bot.command("addpoints", async (ctx) => {
    const ownerId = String(process.env.OWNER_ID || "");

    if (!ownerId || String(ctx.from.id) !== ownerId) {
      return ctx.reply("❌ Owner only.");
    }

    const args = ctx.message.text.trim().split(/\s+/);

    if (args.length !== 3) {
      return ctx.reply(
`❌ Invalid format.

Use:
/addpoints USER_ID AMOUNT

Example:
/addpoints 123456789 500`
      );
    }

    const targetId = args[1];
    const amount = Number(args[2]);

    if (!Number.isInteger(amount) || amount <= 0) {
      return ctx.reply("❌ Amount must be a positive whole number.");
    }

    if (!getUser(targetId)) {
      createUser(targetId);
    }

    const total = addPoints(targetId, amount);

    await ctx.reply(
`╭━━━〔 💰 POINTS ADDED 〕━━━╮
┃
┃ 👤 User:
┃ ${targetId}
┃
┃ ➕ Added:
┃ ${amount} points
┃
┃ 💰 New Balance:
┃ ${total} points
┃
╰━━━━━━━━━━━━━━━━━━━━━━━━━━╯`
    );
  });

  // ============================================
  // OWNER: REMOVE POINTS
  // Usage:
  // /removepoints USER_ID AMOUNT
  // ============================================

  bot.command("removepoints", async (ctx) => {
    const ownerId = String(process.env.OWNER_ID || "");

    if (!ownerId || String(ctx.from.id) !== ownerId) {
      return ctx.reply("❌ Owner only.");
    }

    const args = ctx.message.text.trim().split(/\s+/);

    if (args.length !== 3) {
      return ctx.reply(
`❌ Invalid format.

Use:
/removepoints USER_ID AMOUNT`
      );
    }

    const targetId = args[1];
    const amount = Number(args[2]);

    if (!Number.isInteger(amount) || amount <= 0) {
      return ctx.reply("❌ Amount must be a positive whole number.");
    }

    const user = getUser(targetId);

    if (!user) {
      return ctx.reply("❌ User not found.");
    }

    if ((user.points || 0) < amount) {
      return ctx.reply("❌ User does not have enough points.");
    }

    updateUser(targetId, {
      points: (user.points || 0) - amount
    });

    const updated = getUser(targetId);

    await ctx.reply(
`╭━━━〔 💳 POINTS REMOVED 〕━━━╮
┃
┃ 👤 User:
┃ ${targetId}
┃
┃ ➖ Removed:
┃ ${amount} points
┃
┃ 💰 New Balance:
┃ ${updated.points} points
┃
╰━━━━━━━━━━━━━━━━━━━━━━━━━━╯`
    );
  });
}
