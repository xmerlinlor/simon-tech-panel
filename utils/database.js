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

// ============================================
// DATABASE SETUP
// ============================================

if (!fs.existsSync(databaseDir)) {
  fs.mkdirSync(databaseDir, { recursive: true });
}

if (!fs.existsSync(databaseFile)) {
  fs.writeFileSync(
    databaseFile,
    JSON.stringify(defaultData, null, 2)
  );
}

// ============================================
// READ DATABASE
// ============================================

export function readDB() {
  try {
    const data = fs.readFileSync(databaseFile, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("❌ Database read error:", error);

    fs.writeFileSync(
      databaseFile,
      JSON.stringify(defaultData, null, 2)
    );

    return JSON.parse(JSON.stringify(defaultData));
  }
}

// ============================================
// SAVE DATABASE
// ============================================

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

// ============================================
// USER
// ============================================

export function getUser(userId) {
  const db = readDB();

  return db.users[String(userId)] || null;
}

export function createUser(userId, data = {}) {
  const db = readDB();
  const id = String(userId);

  if (!db.users[id]) {
    db.users[id] = {
      id,
      firstName: data.firstName || "",
      lastName: data.lastName || "",
      username: data.username || "",

      // POINT SYSTEM
      points: 0,

      // REFERRAL
      referralCode: `SIMON-${id}`,
      referredBy: null,
      referralCount: 0,

      // PANELS
      panels: [],

      createdAt: new Date().toISOString()
    };

    saveDB(db);
  }

  return db.users[id];
}

export function updateUser(userId, updates = {}) {
  const db = readDB();
  const id = String(userId);

  if (!db.users[id]) {
    db.users[id] = {
      id,
      points: 0,
      panels: [],
      referralCode: `SIMON-${id}`,
      referralCount: 0,
      referredBy: null,
      createdAt: new Date().toISOString()
    };
  }

  db.users[id] = {
    ...db.users[id],
    ...updates
  };

  saveDB(db);

  return db.users[id];
}

// ============================================
// POINT SYSTEM
// ============================================

export function getPoints(userId) {
  const user = getUser(userId);

  return user?.points || 0;
}

export function addPoints(userId, amount) {
  const db = readDB();
  const id = String(userId);

  if (!db.users[id]) {
    createUser(userId);
  }

  const latestDB = readDB();

  latestDB.users[id].points =
    (latestDB.users[id].points || 0) + Number(amount);

  saveDB(latestDB);

  return latestDB.users[id].points;
}

export function removePoints(userId, amount) {
  const db = readDB();
  const id = String(userId);

  if (!db.users[id]) {
    return false;
  }

  const points = db.users[id].points || 0;
  const cost = Number(amount);

  if (points < cost) {
    return false;
  }

  db.users[id].points = points - cost;

  saveDB(db);

  return true;
}

export function hasEnoughPoints(userId, amount) {
  return getPoints(userId) >= Number(amount);
}

// ============================================
// REFERRAL
// ============================================

export function rewardReferral(referrerId, referredUserId) {
  const db = readDB();

  const referrer = String(referrerId);
  const referred = String(referredUserId);

  if (!db.users[referrer]) {
    return false;
  }

  if (!db.users[referred]) {
    return false;
  }

  // Prevent self-referral
  if (referrer === referred) {
    return false;
  }

  // Prevent rewarding the same user twice
  if (db.users[referred].referredBy) {
    return false;
  }

  db.users[referred].referredBy = referrer;

  db.users[referrer].points =
    (db.users[referrer].points || 0) + 50;

  db.users[referrer].referralCount =
    (db.users[referrer].referralCount || 0) + 1;

  if (!db.referrals[referrer]) {
    db.referrals[referrer] = [];
  }

  db.referrals[referrer].push({
    userId: referred,
    reward: 50,
    createdAt: new Date().toISOString()
  });

  saveDB(db);

  return true;
}

// ============================================
// PANELS
// ============================================

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

export function getUserPanels(userId) {
  const db = readDB();
  const id = String(userId);

  return Object.values(db.panels).filter(
    (panel) => String(panel.userId) === id
  );
}
