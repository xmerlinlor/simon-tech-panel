import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const databaseDir = path.join(__dirname, "../database");
const databaseFile = path.join(databaseDir, "data.json");

const defaultData = {
  users: {},
  panels: {},
  referrals: {},
  tasks: {},
  settings: {
    maintenance: false
  }
};

// Create database folder if it doesn't exist
if (!fs.existsSync(databaseDir)) {
  fs.mkdirSync(databaseDir, { recursive: true });
}

// Create database file if it doesn't exist
if (!fs.existsSync(databaseFile)) {
  fs.writeFileSync(
    databaseFile,
    JSON.stringify(defaultData, null, 2)
  );
}

// Read database
export function readDB() {
  try {
    const data = fs.readFileSync(databaseFile, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("❌ Database read error:", error);
    return { ...defaultData };
  }
}

// Save database
export function saveDB(data) {
  try {
    fs.writeFileSync(
      databaseFile,
      JSON.stringify(data, null, 2)
    );

    return true;
  } catch (error) {
    console.error("❌ Database save error:", error);
    return false;
  }
}

// Get user
export function getUser(userId) {
  const db = readDB();

  return db.users[userId] || null;
}

// Create user
export function createUser(userId, data = {}) {
  const db = readDB();

  if (!db.users[userId]) {
    db.users[userId] = {
      id: userId,
      points: 0,
      panels: [],
      referralCode: `SIMON-${userId}`,
      referredBy: null,
      createdAt: new Date().toISOString(),
      ...data
    };

    saveDB(db);
  }

  return db.users[userId];
}

// Update user
export function updateUser(userId, updates = {}) {
  const db = readDB();

  if (!db.users[userId]) {
    createUser(userId);
  }

  const latestDB = readDB();

  latestDB.users[userId] = {
    ...latestDB.users[userId],
    ...updates
  };

  saveDB(latestDB);

  return latestDB.users[userId];
}

// Add points
export function addPoints(userId, amount) {
  const db = readDB();

  if (!db.users[userId]) {
    createUser(userId);
  }

  const latestDB = readDB();

  latestDB.users[userId].points =
    (latestDB.users[userId].points || 0) + amount;

  saveDB(latestDB);

  return latestDB.users[userId].points;
}

// Create panel record
export function savePanel(panelId, panelData) {
  const db = readDB();

  db.panels[panelId] = {
    id: panelId,
    ...panelData,
    createdAt: new Date().toISOString()
  };

  saveDB(db);

  return db.panels[panelId];
}

// Get user panels
export function getUserPanels(userId) {
  const db = readDB();

  return Object.values(db.panels).filter(
    (panel) => String(panel.userId) === String(userId)
  );
}
