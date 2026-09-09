import "dotenv/config";
import express from "express";
import { Telegraf } from "telegraf";

import { startCommand } from "./bot/start.js";
import { registerCreate } from "./bot/create.js";
import { registerPanel } from "./bot/panel.js";
import { registerReferral } from "./bot/referral.js";
import { registerTasks } from "./bot/tasks.js";
import { registerPlans } from "./bot/plans.js";
import { registerHelp } from "./bot/help.js";
import { registerVip } from "./bot/vip.js";
import { registerOwner } from "./bot/owner.js";

const app = express();

const PORT = process.env.PORT || 3000;
const TOKEN = process.env.TELEGRAM_BOT_TOKEN;

if (!TOKEN) {
  console.error("❌ TELEGRAM_BOT_TOKEN is missing!");
  process.exit(1);
}

const bot = new Telegraf(TOKEN);

// ============================================
// HEALTH CHECK
// ============================================

app.get("/", (req, res) => {
  res.status(200).send("⚡ Simon Tech Free Panel is ONLINE");
});

// ============================================
// START
// ============================================

bot.start(startCommand);

// ============================================
// REGISTER SYSTEMS
// ============================================

registerCreate(bot);
registerPanel(bot);
registerReferral(bot);
registerTasks(bot);
registerPlans(bot);
registerHelp(bot);
registerVip(bot);
registerOwner(bot);

// ============================================
// ERROR HANDLER
// ============================================

bot.catch((error) => {
  console.error("❌ Telegram error:", error);
});

// ============================================
// START SERVER
// ============================================

app.listen(PORT, "0.0.0.0", async () => {
  console.log(`🌐 Server running on port ${PORT}`);

  try {
    await bot.launch();

    console.log("🤖 Simon Tech Free Panel is ONLINE");
  } catch (error) {
    console.error("❌ Bot failed to start:", error);
  }
});

// ============================================
// GRACEFUL SHUTDOWN
// ============================================

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
