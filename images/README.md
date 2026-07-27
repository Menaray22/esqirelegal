# Image drop-in guide

Every photo on the site is referenced by a fixed filename below. The layout
already expects these paths — until a real file exists at that path, the
page shows a styled placeholder naming the shot, so nothing looks broken
in the meantime.

**To add a real photo: save it with the exact filename below into this
`images/` folder. No HTML or CSS changes needed.** This is also how the
Decap CMS media fields will be wired once the CMS phase is built — each
field will write to one of these same paths.

| Filename | Used on | Suggested shape | Notes |
|---|---|---|---|
| `logo.svg` (or `.png`) | Every page, header + footer | Wide, transparent background | Official wordmark |
| `favicon.svg` | Browser tab | Square | Placeholder monogram in place now |
| `hero-scales.jpg` | Home hero | Portrait, ~4:5 | Currently using the firm's own "scales at sunset" cover image conceptually — supply the licensed/original file |
| `chambers-library.jpg` | Home, "Why Choose Us" | Portrait, ~3:4 | Chambers interior / law library |
| `chambers-books.jpg` | About, full-width band | Wide, ~21:9 | Law library shelving / books |
| `principal-portrait.jpg` | Principal Counsel hero | Portrait, ~4:5 | Austin J. Otah |
| `principal-desk.jpg` | Principal Counsel, full-width band | Wide, ~21:9 | Austin J. Otah in chambers |

**Map (Contact page):** currently a styled placeholder, not an image file — there's
an HTML comment directly above it in `contact.html` showing the `<iframe>` markup
to paste in once you have a Google Maps embed URL for the Abuja office.

More entries will be added here as the Blog is built out (featured images, etc.).
