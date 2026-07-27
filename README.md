# Esquires' Legal — Website

**Version:** v1.0.0

Static site (HTML/CSS/vanilla JS, no build step) for Esquires' Legal,
with a Decap CMS admin panel at `/admin`. Content is the firm's own
profile and Principal Counsel documents, reproduced verbatim.

## File structure

```
index.html             Home
about.html              About
practice-areas.html     Practice Areas (16, accordion)
principal.html          Principal Counsel — Austin J. Otah
contact.html            Contact
privacy.html            Privacy Policy (placeholder — see below)
404.html                Not-found page
style.css / script.js   Shared across every page
images/                 All photos + README.md (asset checklist below)
content/settings.json   Phones, emails, hours, social links — CMS-editable
blog/                   Blog posts (Markdown) — see "About the blog" below
admin/                  Decap CMS (index.html + config.yml)
```

> **Previewing locally:** double-clicking `index.html` works for a quick
> look, but the browser will block the Site Settings fetch when opened
> this way (a browser security rule for local files, not a bug) — the
> footer will just show its built-in default values instead. Once
> deployed to Netlify this works normally.

---

## Deploying to Netlify via GitHub

Decap CMS needs a real Git repository behind the site — a plain drag-and-drop
Netlify Drop deploy has nowhere to commit changes to, so this site is set up
for the GitHub‑connected path instead.

**If you're comfortable with the command line:**

1. **Create a GitHub repository** and push this entire folder to it
   (`git init`, `git add .`, `git commit -m "Initial site"`, `git remote add origin <your-repo-url>`, `git push -u origin main`).
2. **In Netlify:** *Add new site → Import an existing project → Deploy with GitHub*,
   then pick the repository.
3. **Build settings:** leave the build command **empty** and set the
   publish directory to the repository root (`/`) — there's no build step.
4. Click **Deploy site**. Netlify will give you a `*.netlify.app` URL
   immediately; add a custom domain later under **Domain settings** whenever
   you're ready.

**If you'd rather avoid the command line:** install the free
[GitHub Desktop](https://desktop.github.com) app — it can create the
repository and push these files with a few clicks instead of typing
commands. From step 2 onward, the Netlify process is identical.

The site needs no build command and no environment variables — a deploy
that publishes the repository root as-is is the entire configuration.

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

### ⚠️ A known risk: Netlify Identity

Being transparent about something I found while validating this for
deployment, not glossing over it: **Netlify has deprecated Netlify
Identity** (the login service Git Gateway depends on). It hasn't been
removed — existing and new setups are still working as of this writing —
but Netlify has said clearly it's on the way out, with no fixed date.

Practically, this means:
- `/admin` should work exactly as described above today.
- There's a real, non-zero chance Netlify disables new Identity
  activations at some point without much notice.
- If you ever go to enable Identity and the option is gone or broken, the
  most straightforward replacement built specifically for this situation
  is **[DecapBridge](https://decapbridge.com)** (free tier available) — it
  swaps in with a small change to the `backend:` block in
  `admin/config.yml`, no rebuild of the CMS itself required.

Given v2 replaces this CMS entirely with a custom Supabase dashboard, my
recommendation is: don't treat this as urgent, but don't be surprised by
it either. If `/admin` login stops working before v2 ships, this is why.

### Netlify Identity token routing (invite/recovery links open the homepage)

**Symptom:** clicking an invite or password-reset email link
(`yoursite.netlify.app/#invite_token=...` or `#recovery_token=...`) just
shows the homepage instead of a "set your password" screen.

**Cause:** those links point to the site root by default, but only
`/admin/` has the Identity widget loaded to actually process the token —
on any other page, the token just sits unused in the URL. This is a
routing mismatch, not a broken or deprecated service.

**Fixed two ways, so it works regardless of email settings:**
1. Every public page now checks its URL hash on load and forwards
   `invite_token` / `recovery_token` / `confirmation_token` /
   `email_change_token` straight to `/admin/`, where the widget picks it
   up automatically — no matter what a given email link points to.
2. For the fastest, most direct experience (skips the forwarding hop),
   you can optionally also update Netlify's email templates: **Site
   configuration → Identity → Emails**, change each template's link from
   `{{ site_url }}/#...` to `{{ site_url }}/admin/#...`. Not required —
   just nicer.

If a fresh invite link *still* doesn't work after this, the link itself
has likely expired or was already used — send a new invite from
**Identity → Invite users** rather than re-clicking an old email.

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

---

## Pre-launch checklist

Run through this once, right before sending the link to the client.

**Deployment**
- [ ] Site deploys on Netlify with an empty build command and root publish directory
- [ ] Every page loads at its real URL (`/about`, `/practice-areas`, etc. — try both with and without `.html`)
- [ ] Visiting a nonexistent URL shows the branded 404 page, not Netlify's default
- [ ] Hard-refresh each page once (Cmd/Ctrl+Shift+R) to rule out stale cached assets

**Visual / assets**
- [ ] Fonts render as the intended serif/sans pairing, not a fallback system font
- [ ] No broken-image icons anywhere — only the intentional styled placeholders
- [ ] Open the browser console on each page — should be empty (aside from the settings-fetch note above if testing pre-deploy)

**Forms**
- [ ] In Netlify: **Site configuration → Forms**, confirm form detection is **on**
- [ ] After first deploy, confirm a form named "contact" appears in the Forms tab
- [ ] Submit a real test enquiry from both the Home and Contact page forms and confirm both arrive
- [ ] Submit once with the honeypot field manually filled (via browser dev tools) and confirm it's rejected

**CMS**
- [ ] Identity + Git Gateway enabled (see setup steps above)
- [ ] `/admin` loads the login screen, not a blank page or spinner
- [ ] Send yourself a fresh invite; clicking it should land on `/admin/`
      with a "set your password" screen, not the homepage
- [ ] Log in and confirm both collections (Site Settings, Blog) are visible
- [ ] Edit one Site Settings field, save, and confirm it updates on the live site within a minute or two
- [ ] Upload a test image via the Media Library and confirm it lands in `images/`

**Content**
- [ ] All 7 placeholder image slots are either filled or acceptable to launch without (see checklist above)
- [ ] Phone numbers, emails, and hours in Site Settings are the real, confirmed values
- [ ] Privacy Policy — confirm the client is fine launching with the placeholder, or hold launch until real copy is ready

