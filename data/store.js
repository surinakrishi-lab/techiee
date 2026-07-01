/**
 * Contact submission storage, backed by MongoDB (via Mongoose).
 *
 * Same readAll()/append() shape the old file-based version had, so
 * routes/contact.js and server.js's admin route barely changed - both
 * just needed to `await` these now, since a real database is async.
 */

const Submission = require('../models/Submission');
const { isDbConnected } = require('../config/db');

function dbNotConnectedError() {
  const err = new Error(
    'Database not connected. Copy .env.example to .env, set MONGODB_URI, and restart the server.'
  );
  err.code = 'DB_NOT_CONNECTED';
  return err;
}

async function readAll() {
  if (!isDbConnected()) return [];
  const docs = await Submission.find().sort({ receivedAt: -1 }).lean();
  return docs.map((d) => ({
    id: d._id.toString(),
    name: d.name,
    email: d.email,
    company: d.company,
    need: d.need,
    budget: d.budget,
    message: d.message,
    receivedAt: d.receivedAt,
  }));
}

async function append(entry) {
  if (!isDbConnected()) throw dbNotConnectedError();
  const doc = await Submission.create(entry);
  return { ...entry, id: doc._id.toString(), receivedAt: doc.receivedAt };
}

module.exports = { readAll, append };
