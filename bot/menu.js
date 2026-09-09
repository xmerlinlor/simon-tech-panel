import { Markup } from "telegraf";

export function mainMenu() {
  return Markup.inlineKeyboard([
    [
      Markup.button.callback("🚀 CREATE", "create_panel"),
      Markup.button.callback("📦 MY PANEL", "my_panel")
    ],
    [
      Markup.button.callback("👥 REFERRAL", "referral"),
      Markup.button.callback("📋 PLANS", "plans")
    ],
    [
      Markup.button.callback("🎁 DAILY TASKS", "daily_tasks"),
      Markup.button.callback("💎 VIP", "vip")
    ],
    [
      Markup.button.callback("❓ HELP", "help"),
      Markup.button.callback("👑 OWNER", "owner")
    ],
    [
      Markup.button.callback("📊 DASHBOARD", "dashboard")
    ]
  ]);
}

export function backButton() {
  return Markup.inlineKeyboard([
    [Markup.button.callback("🔙 BACK TO MENU", "main_menu")]
  ]);
}

export function panelTypes() {
  return Markup.inlineKeyboard([
    [
      Markup.button.callback("🐍 Python", "type_python"),
      Markup.button.callback("🟢 Node.js", "type_node")
    ],
    [
      Markup.button.callback("🛠️ Admin Panel", "type_admin")
    ]
  ]);
}

export function dataPlans() {
  return Markup.inlineKeyboard([
    [
      Markup.button.callback("2GB — PTS", "plan_2gb"),
      Markup.button.callback("4GB — PTS", "plan_4gb")
    ],
    [
      Markup.button.callback("6GB — PTS", "plan_6gb"),
      Markup.button.callback("8GB — PTS", "plan_8gb")
    ],
    [
      Markup.button.callback("10GB — PTS", "plan_10gb")
    ],
    [
      Markup.button.callback("11GB — UNLIMITED", "plan_11gb")
    ]
  ]);
}
