# The Sixteenth Night — book site

Static site for the novel *The Sixteenth Night* by Rabi Samuel.
No build step. Plain HTML, CSS, and JS. Deployable on any static host
(Cloudflare Pages, GitHub Pages, Netlify).

## Structure
- `index.html` — home (hero, synopsis, characters)
- `the-book.html` — book details and buy button
- `author.html` — author bio
- `gallery.html` — cover art gallery
- `contact.html` — contact form (Formspree)
- `css/style.css`, `js/site.js`, `images/`

## Placeholders to replace before launch
1. **Amazon ASIN** — in `index.html` and `the-book.html`, replace
   `href="#"` and `data-asin="PLACEHOLDER_ASIN"` on the `.amazon-buy`
   links with the real listing. The regional-routing script in
   `js/site.js` activates automatically once a real ASIN is present.
2. **Contact email** — `hello@example.com` appears in `author.html`
   and `contact.html`.
3. **Formspree form ID** — `contact.html` currently reuses the Cold
   Mine form (`xjgzgovn`) in two places: the form `action` URL and the
   `formId` in the inline script. Create a new form at formspree.io
   and replace both.
4. **og:url** — in `index.html`, set to the live domain.


https://tsn-site.rabi-samuel.workers.dev/