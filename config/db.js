/**
 * MongoDB connection (via Mongoose).
 *
 * Doesn't crash the server if the DB isn't configured/reachable yet -
 * it logs a clear warning instead, so the rest of the site keeps
 * working while only DB-backed features (the contact form, the admin
 * submissions view) report "not connected" until MONGODB_URI is set.
 */

const dns = require('dns');
const mongoose = require('mongoose');

// Node 18+ resolves DNS as IPv6-first by default, which breaks the
// `mongodb+srv://` SRV lookup on a lot of home/office networks
// (shows up as "querySrv ECONNREFUSED ..."). Forcing IPv4 first fixes
// it in almost all cases.
dns.setDefaultResultOrder('ipv4first');

// If that alone isn't enough, the culprit is usually the OS/router's
// default DNS resolver refusing SRV-type queries (common with ISP
// routers) even though normal browsing works fine. Point Node at
// public DNS resolvers instead, which support SRV lookups properly.
dns.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4']);

async function connectDB() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.warn(
      '[db] MONGODB_URI is not set. Copy .env.example to .env and fill in ' +
      'a real MongoDB connection string. The contact form API will ' +
      'return 503 until then.'
    );
    return;
  }

  try {
    await mongoose.connect(uri);
    console.log('[db] Connected to MongoDB');
  } catch (err) {
    console.error('[db] Failed to connect to MongoDB:', err.message);
  }
}

function isDbConnected() {
  return mongoose.connection.readyState === 1; // 1 = connected
}

module.exports = { connectDB, isDbConnected };
