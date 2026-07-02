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

// On serverless (Vercel), the module can be re-used across invocations but a
// fresh cold start has no connection yet. We cache the connect() PROMISE on
// the global object so concurrent/subsequent requests reuse one connection
// instead of each opening a new one (which exhausts Atlas connection limits).
let cached = global.__mongooseCache;
if (!cached) cached = global.__mongooseCache = { conn: null, promise: null };

let lastError = null;
function getLastError() { return lastError; }

// Ensures a live connection before a DB operation runs. Returns true if
// connected, false if there's no URI or the connection failed (callers then
// fall back gracefully). Safe to call on every request.
async function ensureConnected() {
  const uri = process.env.MONGODB_URI;
  if (!uri) return false;
  if (mongoose.connection.readyState === 1) return true;

  if (!cached.promise) {
    lastError = null;
    cached.promise = mongoose
      .connect(uri, { serverSelectionTimeoutMS: 8000 })
      .then((m) => m)
      .catch((err) => {
        cached.promise = null; // allow a retry on the next request
        lastError = err.message;
        console.error('[db] Failed to connect to MongoDB:', err.message);
        throw err;
      });
  }
  try {
    cached.conn = await cached.promise;
    return mongoose.connection.readyState === 1;
  } catch (_) {
    return false;
  }
}

// Kept for server startup (npm start / npm run dev). On Vercel the real
// connection is established lazily via ensureConnected() per request.
async function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.warn(
      '[db] MONGODB_URI is not set. Copy .env.example to .env (locally) or ' +
      'add it in Vercel -> Settings -> Environment Variables, then redeploy. ' +
      'Until then, submissions fall back to a local file (dev only).'
    );
    return;
  }
  const ok = await ensureConnected();
  if (ok) console.log('[db] Connected to MongoDB');
}

function isDbConnected() {
  return mongoose.connection.readyState === 1; // 1 = connected
}

module.exports = { connectDB, ensureConnected, isDbConnected, getLastError };
