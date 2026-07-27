# Esquires' Legal — Website

Static site (HTML/CSS/vanilla JS, no build step) for Esquires' Legal,
with a Decap CMS admin panel at `/admin`. Content is the firm's own
profile and Principal Counsel documents, reproduced verbatim.

## File structure

```
index.html            Home
about.html             About
practice-areas.html    Practice Areas (16, accordion)
principal.html          Principal Counsel — Austin J. Otah
contact.html            Contact
privacy.html            Privacy Policy (placeholder — see below)
404.html                 Not-found page
style.css / script.js   Shared across every page
images/                  All photos + README.md (asset checklist below)
content/settings.json  Phones, emails, hours, social links — CMS-editable
blog/                   Blog posts (Markdown) — see "About the blog" below
admin/                  Decap CMS (index.html + config.yml)
```

---

## Deploying to Netlify via GitHub

Decap CMS needs a real Git repository behind the site — a plain drag-and-drop
Netlify Drop deploy has nowhere to commit changes to, so this site is set up
for the GitHub‑connected path instead:

1. **Create a GitHub repository** and push this entire folder to it
   (`git init`, `git add .`, `git commit -m "Initial site"`, `git remote add origin <your-repo-url>`, `git push -u origin main`).
2. **In Netlify:** *Add new site → Import an existing project → Deploy with GitHub*,
   then pick the repository.
3. **Build settings:** leave the build command **empty** and set the
   publish directory to the repository root (`/`) — there's no build step.
4. Click **Deploy site**. Netlify will give you a `*.netlify.app` URL
   immediately; add a custom domain later under **Domain settings** whenever
   you're ready.

## Setting up `/admin` access

Decap is configured for Netlify's **Git Gateway**, which lets you manage
editor logins without running a separate OAuth server:

1. In the Netlify dashboard for this site, go to **Site configuration →
   Identity** and click **Enable Identity**.
2. Under **Identity → Registration**, set it to **Invite only** (recommended,
   so the public can't self-register as editors).
3. Under **Identity → Services**, enable **Git Gateway**.
4. Go to the **Identity** tab and **Invite users** — enter the email(s) of
   whoever should be able to log in at `/admin` (e.g. Austin, or whoever
   manages the site). They'll get an email invite to set a password.
5. Visit `https://<your-site>.netlify.app/admin` and log in.

From `/admin` an editor can:
- **Site Settings** — update phone numbers, emails, business hours, and
  social links. These are wired live: saving here updates the footer on
  every page and the Contact page directly, no code edit needed.
- **Media Library** — upload or replace photos. **Upload the file using the
  exact filename from the checklist below** (e.g. `logo.svg`,
  `hero-scales.jpg`) so it lines up with what the pages already expect —
  see `images/README.md` for the full list and where each one is used.
- **Blog** — create, edit, and delete posts (title, date, author, featured
  image, categories, tags, draft/publish, body). See the note below on what
  this does and doesn't do yet.

### About the blog

The Blog collection in `/admin` fully supports authoring — posts save as
Markdown files in `blog/` with an editorial draft/publish workflow. What
this phase does **not** include is a template that turns those files into
visitable blog pages on the live site (that needs either a build step or a
client-side renderer, which is a larger piece of work). Authoring is ready
now; rendering the posts publicly is part of the planned full-featured
version with a custom backend.

---

## Placeholder assets still needed

These files don't exist yet — until they do, the site shows a styled
placeholder in their place (nothing is broken, it's designed to fail
gracefully). Drop each file into `images/` with the **exact filename**
below, either directly or via the CMS Media Library, and it appears with
no code changes.

- [ ] `logo.svg` (or `.png`, transparent background) — used in every header and footer
- [ ] `favicon.svg` — currently a placeholder monogram, replace with the official mark
- [ ] `hero-scales.jpg` — Home page hero image (portrait, ~4:5)
- [ ] `chambers-library.jpg` — Home, "Why Choose Us" (portrait, ~3:4)
- [ ] `chambers-books.jpg` — About page, full-width band (wide, ~21:9)
- [ ] `principal-portrait.jpg` — Austin J. Otah, Principal Counsel hero (portrait, ~4:5)
- [ ] `principal-desk.jpg` — Austin J. Otah, full-width band (wide, ~21:9)
- [ ] **Google Maps embed** for the Abuja office — not a file; see the HTML
      comment directly above the placeholder in `contact.html` for the
      exact markup to paste in once you have the embed URL

Full details (suggested dimensions, notes) are in `images/README.md`.

## Also still open

- **Privacy Policy** — `privacy.html` is intentionally a placeholder per
  your instruction; the real policy should be drafted with counsel before
  launch.
- **Business hours** — set to a generic Monday–Friday default in
  `content/settings.json`; update via Site Settings in `/admin` once
  confirmed.
