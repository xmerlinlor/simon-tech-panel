# simon-tech-panel
⚡ Simon Tech Free Panel

A Telegram-based free hosting panel system for creating and managing test server panels through Telegram.

🚀 Features

- 🤖 Telegram-based control
- 👤 User registration
- 💰 Points system
- 🔗 Referral rewards
- 🎯 Daily tasks
- 📦 Hosting plans
- 💎 VIP system
- 🖥️ Create Panel system
- 📂 My Panel
- 📊 User dashboard
- 🔐 Password / random password generation
- 🐍 Python panel option
- 🟢 Node.js panel option
- 👑 Admin panel option
- 💾 RAM and storage plans
- 📋 Panel history
- 👑 Owner controls

🖥️ Create Panel Flow

🚀 Create
   ↓
📧 Email
   ↓
👤 First Name
   ↓
🆔 Username
   ↓
🔑 Password / Random
   ↓
📦 Select Panel Type
   ├── 🐍 Python
   ├── 🟢 Node.js
   └── 👑 Admin Panel
   ↓
💾 Select Data Plan
   ├── 2GB
   ├── 4GB
   ├── 6GB
   ├── 8GB
   ├── 10GB
   └── 11GB / Unlimited
   ↓
⏳ Creating Panel
   ↓
✅ Panel Created

🆓 Free Testing Mode

The first version is designed for free testing.

Telegram
   ↓
Simon Tech Bot
   ↓
Render
   ↓
JSON Database
   ↓
Panel Simulator

The testing version does not require a paid domain, VPS, or Pterodactyl API key.

🌐 Deployment

The project can be deployed using:

- GitHub — source code
- Render — free web hosting/testing
- Telegram Bot API — Telegram interaction

Render provides an "onrender.com" URL for the deployed service.

🔮 Future Pterodactyl Integration

Once a real Pterodactyl server is available, the panel simulator can be replaced with real Pterodactyl provisioning.

Simon Tech Bot
      ↓
Pterodactyl Application API
      ↓
Pterodactyl Panel
      ↓
Wings
      ↓
Docker
      ↓
User Server

This will allow automatic creation of real Pterodactyl users and servers.

⚙️ Environment Variables

Create a ".env" file:

TELEGRAM_BOT_TOKEN=your_telegram_bot_token
OWNER_ID=your_telegram_user_id
PORT=3000

Never publish your Telegram bot token or other private credentials.

👑 Credits

Simon Tech

Made with ⚡ by Simon CEO — Simon Tech

📜 License

This project is intended for personal development, testing, and educational use.
