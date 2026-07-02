/**
 * Contact submission storage, backed by MongoDB (via Mongoose).
 *
 * Same readAll()/append() shape the old file-based version had, so
 * routes/contact.js and server.js's admin route barely changed - both
 * just needed to `await` these now, since a real database is async.
 */

const fs = require('fs');
const path = require('path');
const Submission = require('../models/Submission');
const { isDbConnected } = require('../config/db');

// File fallback used whenever MongoDB isn't connected (e.g. no MONGODB_URI
// set yet), so leads are never lost — they persist to this JSON file and
// still show up in the admin view / GET /api/contact.
const FILE = path.join(__dirname, 'contact-submissions.json');

function readFile() {
  try { return JSON.parse(fs.readFileSync(FILE, 'utf8')) || []; }
  catch (_) { return []; }
}
function writeFile(list) {
  fs.writeFileSync(FILE, JSON.stringify(list, null, 2));
}

async function readAll() {
  if (!isDbConnected()) {
    return readFile().slice().sort(function (a, b) {
      return new Date(b.receivedAt) - new Date(a.receivedAt);
    });
  }
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
  if (!isDbConnected()) {
    const list = readFile();
    const saved = Object.assign(
      { id: 'f_' + Date.now().toString(36), receivedAt: new Date().toISOString() },
      entry
    );
    list.push(saved);
    writeFile(list);
    return saved;
  }
  const doc = await Submission.create(entry);
  return { ...entry, id: doc._id.toString(), receivedAt: doc.receivedAt };
}

module.exports = { readAll, append };
