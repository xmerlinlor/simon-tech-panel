import { createUser } from "../utils/database.js";
import { mainMenu } from "./menu.js";

export async function startCommand(ctx) {
  const user = ctx.from;

  createUser(user.id, {
    firstName: user.first_name || "",
    lastName: user.last_name || "",
    username: user.username || ""
  });

  await ctx.reply(
`╭━━━〔 ⚡ SIMON TECH FREE PANEL 〕━━━╮
┃
┃ 👋 Welcome, ${user.first_name || "User"}!
┃
┃ 🚀 Create your free test hosting
┃    panel directly from Telegram.
┃
┃ 💰 Earn points
┃ 👥 Invite friends
┃ 🎁 Complete daily tasks
┃ 📦 Manage your panels
┃
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯`,
    mainMenu()
  );
}
