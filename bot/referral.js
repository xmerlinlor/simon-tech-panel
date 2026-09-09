import { getUser, createUser } from "../utils/database.js";
import { mainMenu } from "./menu.js";

export function registerReferral(bot) {

  // ============================================
  // REFERRAL BUTTON
  // ============================================

  bot.action("referral", async (ctx) => {
    await ctx.answerCbQuery();

    const userId = String(ctx.from.id);

    if (!getUser(userId)) {
      createUser(userId, {
        firstName: ctx.from.first_name || "",
        lastName: ctx.from.last_name || "",
        username: ctx.from.username || ""
      });
    }

    const user = getUser(userId);

    let botUsername = ctx.botInfo?.username;

    if (!botUsername) {
      const botInfo = await ctx.telegram.getMe();
      botUsername = botInfo.username;
    }

    const referralCode = user.referralCode || `SIMON-${userId}`;

    const referralLink =
      `https://t.me/${botUsername}?start=${encodeURIComponent(referralCode)}`;

    const shareUrl =
      `https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${encodeURIComponent(
        "🚀 Join Simon Tech Free Panel and earn free hosting points!"
      )}`;

    await ctx.reply(
`╭━━━〔 👥 REFERRAL SYSTEM 〕━━━╮
┃
┃ 💰 Your Points:
┃ ${user.points || 0}
┃
┃ 👥 Referrals:
┃ ${user.referralCount || 0}
┃
┃ 🎁 Reward:
┃ +50 Points per referral
┃
┃ 🔗 Your Referral Link:
┃ ${referralLink}
┃
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯`,
      {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "📤 SHARE REFERRAL",
                url: shareUrl
              }
            ],
            [
              {
                text: "🔗 OPEN REFERRAL LINK",
                url: referralLink
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
  // /referral COMMAND
  // ============================================

  bot.command("referral", async (ctx) => {

    const userId = String(ctx.from.id);

    if (!getUser(userId)) {
      createUser(userId, {
        firstName: ctx.from.first_name || "",
        lastName: ctx.from.last_name || "",
        username: ctx.from.username || ""
      });
    }

    const user = getUser(userId);

    let botUsername = ctx.botInfo?.username;

    if (!botUsername) {
      const botInfo = await ctx.telegram.getMe();
      botUsername = botInfo.username;
    }

    const referralCode = user.referralCode || `SIMON-${userId}`;

    const referralLink =
      `https://t.me/${botUsername}?start=${encodeURIComponent(referralCode)}`;

    const shareUrl =
      `https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${encodeURIComponent(
        "🚀 Join Simon Tech Free Panel and earn free hosting points!"
      )}`;

    await ctx.reply(
`╭━━━〔 👥 YOUR REFERRAL 〕━━━╮
┃
┃ 💰 Points:
┃ ${user.points || 0}
┃
┃ 👥 Referrals:
┃ ${user.referralCount || 0}
┃
┃ 🎁 Reward:
┃ +50 Points
┃
┃ 🔗 Referral Link:
┃ ${referralLink}
┃
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯`,
      {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "📤 SHARE REFERRAL",
                url: shareUrl
              }
            ],
            [
              {
                text: "🔗 OPEN REFERRAL LINK",
                url: referralLink
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
}
