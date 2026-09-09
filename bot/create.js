import { Markup } from "telegraf";
import {
  createUser,
  updateUser,
  savePanel,
  getUserPanels,
  getPoints,
  removePoints
} from "../utils/database.js";

import { panelTypes, dataPlans, mainMenu } from "./menu.js";
import crypto from "crypto";

const sessions = new Map();

const PANEL_COST = 200;

function generatePassword() {
  return crypto.randomBytes(6).toString("base64url");
}

export function registerCreate(bot) {

  // ============================================
  // CREATE BUTTON
  // ============================================

  bot.action("create_panel", async (ctx) => {
    await ctx.answerCbQuery();

    const userId = ctx.from.id;

    createUser(userId, {
      firstName: ctx.from.first_name || "",
      lastName: ctx.from.last_name || "",
      username: ctx.from.username || ""
    });

    const points = getPoints(userId);

    if (points < PANEL_COST) {
      return ctx.reply(
`╭━━━〔 🚫 INSUFFICIENT POINTS 〕━━━╮
┃
┃ 💰 Your Points: ${points}
┃
┃ 🚀 Panel Cost: ${PANEL_COST} points
┃
┃ ❌ You need ${PANEL_COST - points}
┃    more points.
┃
┃ 👥 Refer friends to earn
┃ +50 points for each referral.
┃
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯`,
        mainMenu()
      );
    }

    sessions.set(userId, {
      step: "email",
      data: {}
    });

    await ctx.reply(
`╭━━━〔 📧 CREATE NEW PANEL 〕━━━╮
┃
┃ 💰 Cost: ${PANEL_COST} points
┃
┃ Send your email address.
┃
┃ Example:
┃ user@example.com
┃
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯`
    );
  });

  // ============================================
  // PANEL TYPE
  // ============================================

  bot.action(
    ["type_python", "type_node", "type_admin"],
    async (ctx) => {
      await ctx.answerCbQuery();

      const userId = ctx.from.id;
      const session = sessions.get(userId);

      if (!session || !session.data.username) {
        return ctx.reply(
          "❌ Your creation session expired. Tap 🚀 CREATE again.",
          mainMenu()
        );
      }

      const typeMap = {
        type_python: "Python",
        type_node: "Node.js",
        type_admin: "Admin Panel"
      };

      session.data.type = typeMap[ctx.callbackQuery.data];

      await ctx.reply(
`╭━━━〔 📋 PANEL TYPE 〕━━━╮
┃
┃ ✅ Selected:
┃ ${session.data.type}
┃
┃ 💰 Cost:
┃ ${PANEL_COST} points
┃
┃ Now select your data plan.
┃
╰━━━━━━━━━━━━━━━━━━━━━━━━╯`,
        dataPlans()
      );

      session.step = "plan";
    }
  );

  // ============================================
  // DATA PLANS
  // ============================================

  bot.action(
    [
      "plan_2gb",
      "plan_4gb",
      "plan_6gb",
      "plan_8gb",
      "plan_10gb",
      "plan_11gb"
    ],
    async (ctx) => {
      await ctx.answerCbQuery();

      const userId = ctx.from.id;
      const session = sessions.get(userId);

      if (!session || session.step !== "plan") {
        return ctx.reply(
          "❌ Your creation session expired. Tap 🚀 CREATE again.",
          mainMenu()
        );
      }

      // Check points again before final creation
      const currentPoints = getPoints(userId);

      if (currentPoints < PANEL_COST) {
        sessions.delete(userId);

        return ctx.reply(
`╭━━━〔 🚫 NOT ENOUGH POINTS 〕━━━╮
┃
┃ 💰 Your Points: ${currentPoints}
┃
┃ 🚀 Required: ${PANEL_COST}
┃
┃ ❌ You need ${PANEL_COST - currentPoints}
┃    more points.
┃
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯`,
          mainMenu()
        );
      }

      const plans = {
        plan_2gb: "2GB",
        plan_4gb: "4GB",
        plan_6gb: "6GB",
        plan_8gb: "8GB",
        plan_10gb: "10GB",
        plan_11gb: "11GB — UNLIMITED"
      };

      const plan = plans[ctx.callbackQuery.data];

      session.data.plan = plan;

      const panelId =
        "ST-" +
        Date.now().toString(36).toUpperCase() +
        "-" +
        Math.floor(Math.random() * 999);

      // ========================================
      // CREATE PANEL
      // ========================================

      const panel = savePanel(panelId, {
        userId,
        email: session.data.email,
        firstName: session.data.firstName,
        username: session.data.username,
        password: session.data.password,
        type: session.data.type,
        plan,
        status: "active",
        simulator: true
      });

      if (!panel) {
        return ctx.reply(
          "❌ Panel creation failed. No points were deducted.",
          mainMenu()
        );
      }

      // ========================================
      // DEDUCT 200 POINTS
      // ========================================

      const paymentSuccessful = removePoints(
        userId,
        PANEL_COST
      );

      if (!paymentSuccessful) {
        return ctx.reply(
          "❌ Payment verification failed. Please try again.",
          mainMenu()
        );
      }

      // ========================================
      // SAVE PANEL TO USER
      // ========================================

      const user = createUser(userId);

      updateUser(userId, {
        panels: [...(user.panels || []), panelId]
      });

      const remainingPoints = getPoints(userId);

      sessions.delete(userId);

      await ctx.reply(
`╭━━━〔 ✅ PANEL CREATED 〕━━━╮
┃
┃ 🆔 Panel ID:
┃ ${panelId}
┃
┃ 👤 Username:
┃ ${panel.username}
┃
┃ 📧 Email:
┃ ${panel.email}
┃
┃ 🔑 Password:
┃ ${panel.password}
┃
┃ 🖥️ Type:
┃ ${panel.type}
┃
┃ 💾 Plan:
┃ ${panel.plan}
┃
┃ 💳 Cost:
┃ ${PANEL_COST} points
┃
┃ 💰 Remaining:
┃ ${remainingPoints} points
┃
┃ 🟢 Status:
┃ ACTIVE
┃
┃ ⚠️ TEST MODE
┃ This is currently a simulator.
┃ Real Pterodactyl provisioning will
┃ be connected later.
┃
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯`,
        mainMenu()
      );
    }
  );

  // ============================================
  // TEXT INPUT
  // ============================================

  bot.on("text", async (ctx) => {
    const userId = ctx.from.id;
    const text = ctx.message.text.trim();

    if (text.startsWith("/")) return;

    const session = sessions.get(userId);

    if (!session) return;

    // ========================================
    // EMAIL
    // ========================================

    if (session.step === "email") {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text)) {
        return ctx.reply(
          "❌ Invalid email address.\n\nPlease send a valid email, for example:\nuser@example.com"
        );
      }

      session.data.email = text;
      session.step = "firstName";

      return ctx.reply(
`╭━━━〔 👤 FIRST NAME 〕━━━╮
┃
┃ Send your first name.
┃
┃ Example:
┃ Simontech
┃
╰━━━━━━━━━━━━━━━━━━━━━━━╯`
      );
    }

    // ========================================
    // FIRST NAME
    // ========================================

    if (session.step === "firstName") {
      session.data.firstName = text;
      session.step = "username";

      return ctx.reply(
`╭━━━〔 🆔 USERNAME 〕━━━╮
┃
┃ Send the username you want
┃ to use for your panel.
┃
┃ Example:
┃ SimonTech
┃
╰━━━━━━━━━━━━━━━━━━━━━━━╯`
      );
    }

    // ========================================
    // USERNAME
    // ========================================

    if (session.step === "username") {
      if (!/^[a-zA-Z0-9_.-]{3,32}$/.test(text)) {
        return ctx.reply(
          "❌ Invalid username.\n\nUse 3–32 characters containing letters, numbers, `_`, `-`, or `.`."
        );
      }

      session.data.username = text;
      session.step = "password";

      return ctx.reply(
`╭━━━〔 🔑 PASSWORD 〕━━━╮
┃
┃ Send your password.
┃
┃ Or send:
┃ random
┃
┃ to generate a secure password.
┃
╰━━━━━━━━━━━━━━━━━━━━━━╯`
      );
    }

    // ========================================
    // PASSWORD
    // ========================================

    if (session.step === "password") {
      if (text.toLowerCase() === "random") {
        session.data.password = generatePassword();
      } else {
        if (text.length < 6) {
          return ctx.reply(
            "❌ Password must contain at least 6 characters."
          );
        }

        session.data.password = text;
      }

      session.step = "type";

      return ctx.reply(
`╭━━━〔 ✅ INFORMATION SAVED 〕━━━╮
┃
┃ 📧 Email: ${session.data.email}
┃ 👤 Name: ${session.data.firstName}
┃ 🆔 Username: ${session.data.username}
┃ 🔑 Password: ${session.data.password}
┃
┃ 💰 Panel Cost: ${PANEL_COST} points
┃
┃ Select your panel type:
┃
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯`,
        panelTypes()
      );
    }
  });
}
