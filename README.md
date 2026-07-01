# CrossTecch site — Node.js backend

The site is now served by a real Node.js/Express server instead of raw
static files. This is the setup that was added:

## Run it

```
npm install
npm start        # or: npm run dev  (nodemon, auto-restart)
```

Then open http://localhost:3000

## What changed

- **`server.js`** — Express app. **Every page in the project — all
  root-level pages and all `index_files/*.html` iframe fragments — is
  now rendered through the EJS engine (`ejs.renderFile`) instead of
  being handed out as a static file.** Same URLs as before
  (`/about.html`, `/ContactUs.html`, `/index_files/hero1.html`, ...)
  plus clean-URL aliases (`/about`, `/services`, ...). Only `images/`
  and `videos/` are served as plain static assets — `server.js`,
  `routes/`, `data/`, and `package.json` are never exposed over HTTP.
- **`routes/contact.js`** — real `POST /api/contact` endpoint with
  validation, plus `GET /api/contact` to read stored leads as JSON.
- **`views/admin-submissions.ejs`** — server-rendered (EJS) page at
  `/admin/submissions` listing every contact form lead that's come in.
- **`ContactUs.html`** — the contact form now posts JSON to
  `/api/contact` (our own Node backend) instead of the old Google Apps
  Script URL. Validation and UI behavior are unchanged.

## Database (MongoDB)

Contact submissions are now stored in MongoDB via Mongoose, not a JSON
file.

- **`config/db.js`** — connects to `MONGODB_URI` on startup. If it's
  not set, the server still starts (so you can browse the site), but
  logs a warning and `/api/contact` returns `503` until it's connected.
- **`models/Submission.js`** — the Mongoose schema (`name`, `email`,
  `company`, `need`, `budget`, `message`, `receivedAt`).
- **`data/store.js`** — `readAll()` / `append()`, now backed by
  `Submission` instead of a file. `routes/contact.js` and the
  `/admin/submissions` view didn't need to change beyond `await`ing
  them, since the shape stayed the same.

### To connect it to a real database

1. Get a free MongoDB Atlas cluster: https://www.mongodb.com/cloud/atlas/register
   (create an M0 cluster → add a database user/password → allow your IP
   under Network Access → "Connect" → "Drivers" → copy the connection
   string).
2. `cp .env.example .env` and paste your connection string into
   `MONGODB_URI` (fill in `<username>`, `<password>`, `<cluster-url>`).
3. `npm install` (pulls in `mongoose` + `dotenv`), then `npm start`.
   You should see `[db] Connected to MongoDB` in the console.
4. Submit the Contact Us form, then check `http://localhost:3000/admin/submissions`
   — the lead should show up there, and in Atlas's own web UI
   (Collections → `crosstecch.submissions`).

Prefer Postgres/MySQL/SQLite instead? Say the word and I'll swap
`config/db.js` + `models/Submission.js` + `data/store.js` for that
instead — `routes/contact.js` and the admin view won't need to change.

## Why the page markup itself wasn't rewritten

None of the pages contained `<% %>` / `<%= %>` EJS syntax, so routing
them through `ejs.renderFile` produces byte-identical output to the
old static files — every page is now genuinely served by the Node
backend with zero risk of visual regressions. What's deliberately
**not** done yet is folding the duplicated `<head>`/nav/footer markup
across pages into shared EJS partials (`<%- include(...) %>`). That's
a real next step, but it means editing the inside of large, hand-tuned
files with no automated tests, so it's best done one page at a time
with a visual check after each, rather than all at once with no way to
preview the result.

## Suggested next steps

- Fold the duplicated `<head>` boilerplate, `header.js`'s nav markup,
  and the `Footer.html` iframe block into real EJS partials
  (`views/partials/head.ejs`, `nav.ejs`, `footer.ejs`), one page at a
  time, using `<%- include('partials/nav') %>`.
- Add Nodemailer (or a CRM webhook) in `routes/contact.js` so a new
  submission also sends a notification email.
