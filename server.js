/**
 * CrossTecch site server.
 *
 * Every page in the project (root-level pages + the index_files/
 * fragments loaded in iframes) is now rendered through Node.js via the
 * EJS template engine instead of being handed out as static files.
 * Markup/CSS/behavior is unchanged - none of it contains EJS syntax yet,
 * so output is byte-identical to the original files - but every request
 * now runs through real server code, and any page can start using
 * server-side variables/partials going forward without another migration.
 */

require('dotenv').config();

const path = require('path');
const express = require('express');
const ejs = require('ejs');

const { connectDB } = require('./config/db');
const contactRoutes = require('./routes/contact');
const store = require('./data/store');

const app = express();
const PORT = process.env.PORT || 3000;
const ROOT = __dirname;

// ---------------------------------------------------------------------
// View engine (EJS) - used for the admin view (views/*.ejs)
// ---------------------------------------------------------------------
app.set('view engine', 'ejs');
app.set('views', path.join(ROOT, 'views'));

// ---------------------------------------------------------------------
// Body parsing for JSON APIs (e.g. the contact form)
// ---------------------------------------------------------------------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ---------------------------------------------------------------------
// Static assets. Only known asset folders are exposed - source files
// (server.js, routes/, data/, package.json, etc.) are never served.
// ---------------------------------------------------------------------
app.use('/images', express.static(path.join(ROOT, 'images')));
app.use('/videos', express.static(path.join(ROOT, 'videos')));

app.get('/header.js', (req, res) => {
  res.sendFile(path.join(ROOT, 'header.js'));
});

app.get('/crosstech-chatbot.js', (req, res) => {
  res.sendFile(path.join(ROOT, 'crosstech-chatbot.js'));
});

// ---------------------------------------------------------------------
// Render any page (root-level or index_files/) through the EJS engine
// instead of sending it as a static file.
// ---------------------------------------------------------------------
async function renderPage(res, absFilePath) {
  try {
    const html = await ejs.renderFile(absFilePath);
    res.type('html').send(html);
  } catch (err) {
    console.error('Template render error for', absFilePath, err);
    res.status(500).send('Server error rendering page.');
  }
}

// Root-level pages, at the same URLs the site already used (so every
// existing relative link - "about.html", "solution.html", header.js's
// nav links, etc. - keeps working unchanged).
const PAGES = {
  '/': 'index.html',
  '/index.html': 'index.html',
  '/about.html': 'about.html',
  '/blog.html': 'blog.html',
  '/future.html': 'future.html',
  '/ContactUs.html': 'ContactUs.html',
  '/services.html': 'services.html',
  '/bug-finder.html': 'bug-finder.html',
  '/blog-engine.html': 'blog-engine.html',
  '/Product.html': 'Product.html',
  '/solution.html': 'solution.html',
  '/Footer.html': 'Footer.html',
};

Object.entries(PAGES).forEach(([route, file]) => {
  app.get(route, (req, res) => renderPage(res, path.join(ROOT, file)));
});

// Clean-URL aliases (e.g. /about -> about.html) for nicer production URLs,
// on top of the existing .html links, which keep working unchanged.
Object.entries(PAGES).forEach(([route, file]) => {
  if (route === '/' || !route.endsWith('.html')) return;
  const clean = route.replace(/\.html$/, '');
  app.get(clean, (req, res) => renderPage(res, path.join(ROOT, file)));
});

// index_files/ fragments (the sections embedded via iframe on several
// pages) - also rendered through EJS now instead of express.static.
const INDEX_FILES_PAGES = [
  'hero1.html',
  'flow.html',
  'code.html',
  'WhyChooseUs_preview.html',
  'Our Services.html',
  'index.html',
  'hero.html',
  'about.html',
];

INDEX_FILES_PAGES.forEach((file) => {
  app.get('/index_files/' + file, (req, res) =>
    renderPage(res, path.join(ROOT, 'index_files', file))
  );
});

// Fallback static mount for index_files/ in case a non-HTML asset ever
// lives there (keeps the folder's other files reachable without a
// dedicated route).
app.use('/index_files', express.static(path.join(ROOT, 'index_files')));

// ---------------------------------------------------------------------
// Real backend: contact form API + persisted submissions
// ---------------------------------------------------------------------
app.use('/api/contact', contactRoutes);

// Diagnostics: open /api/health in the browser to see exactly why the DB
// isn't saving (missing URI, bad password, IP not whitelisted, etc.).
app.get('/api/health', async (req, res) => {
  const mongoose = require('mongoose');
  const { ensureConnected, getLastError } = require('./config/db');
  const out = {
    hasMongoUri: !!process.env.MONGODB_URI,
    uriScheme: (process.env.MONGODB_URI || '').split('://')[0] || null,
    onVercel: !!process.env.VERCEL,
  };
  try {
    out.connected = await ensureConnected();
  } catch (e) {
    out.connected = false;
  }
  out.readyState = mongoose.connection.readyState; // 1 = connected
  out.dbName = mongoose.connection.name || null;
  out.lastError = getLastError();
  res.json(out);
});

// Server-rendered (EJS) admin view over the submissions the API stores.
app.get('/admin/submissions', async (req, res) => {
  const submissions = await store.readAll();
  res.render('admin-submissions', { submissions });
});

// ---------------------------------------------------------------------
// 404
// ---------------------------------------------------------------------
app.use((req, res) => {
  res.status(404).send('404 - Not Found');
});

// Connect to MongoDB (or log a clear warning if not configured yet).
connectDB();

// On Vercel this file runs as a serverless function - Vercel calls the
// exported `app` directly per-request and must NOT have app.listen()
// binding a port. Locally (npm start / npm run dev) we need the real
// listener.
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`CrossTecch server running at http://localhost:${PORT}`);
  });
}

module.exports = app;
