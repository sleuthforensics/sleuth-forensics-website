# Sleuth Forensics

Marketing site for Sleuth Forensics, a cybersecurity and digital forensics practice in
Bengaluru. Static HTML, CSS and a little vanilla JavaScript. No build step, no framework,
no runtime dependencies.

## Running it locally

Any static file server will do. From the repository root:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000`. There is nothing to compile or install.

## Structure

```
index.html            Home
about.html            About the practice
industries.html       Sectors
contact.html          Enquiry form + contact details
privacy.html          Privacy policy
terms.html            Terms of service
404.html              Custom not-found page (GitHub Pages serves this automatically)
services/
  index.html          Services overview, grouped into three practices
  *.html              21 individual service pages
css/site.css          The entire stylesheet
js/site.js            Masthead state, index panel, enquiry form
favicon.svg           Site icon
apple-touch-icon.png  iOS home-screen icon
og.png                Social share card (1200x630)
robots.txt            Crawl directives
sitemap.xml           URL list
CNAME                 Custom domain for GitHub Pages
.nojekyll             Tells GitHub Pages to serve files as-is
```

## Design system

Everything is driven by custom properties at the top of `css/site.css`. Changing a token
there changes it everywhere.

**Type.** Two families, four faces, loaded from Google Fonts.
Source Serif 4 (variable, with optical sizing) carries every piece of running text and
every heading. IBM Plex Mono carries labels, numbers, navigation, metadata and buttons.
Do not add a third family.

**Colour.** Warm paper (`--paper`), near-black ink (`--ink`), one vermilion accent
(`--mark`) used only to mark attention: section rules, numerals, hover and focus states.
Text colours are named by role and all of them clear WCAG 2.2 AA on their intended
background. The variants ending `-on-ink` are the ones cleared against the dark surface.
The site is deliberately light-only; `color-scheme: light` is set so browser chrome
follows.

**Layout.** A `.wrap` container capped at 78rem. `.split` and `.section-head` put a
marginal label column beside the content column, which is where the section numbering
lives. Hairline rules, no border radius (2px on form inputs only), no shadows.

**Motion.** Transitions of 160–260ms on hover, focus and the index panel, plus one staged
entrance on the hero. Nothing animates on scroll. `prefers-reduced-motion: reduce` flattens
all of it.

## Editing content

Pages are plain HTML. There is no templating layer, which means the masthead, the services
index panel and the footer are repeated in each file. When you change navigation or footer
markup, change it everywhere:

```bash
grep -rln 'panel__groups' --include='*.html' .
```

Adding a service means: create `services/<slug>.html` from an existing service page as a
template, then add it to the masthead panel and the services index on every page, and add
a `<url>` entry to `sitemap.xml`.

**No phone number or email address is published anywhere on this site.** The enquiry form
is the only contact route, and several pages depend on that: the contact page lead, the
mid-incident notice in its sidebar, the post-submit confirmation, and the contact sections
of the privacy policy and terms all describe the form rather than a direct line. If a
direct contact route is added later, revisit those four places so the copy stays true.

The postal address does appear, in the footer, the services panel, the contact page sidebar
and both legal pages:

```bash
grep -rn 'Bengaluru, Karnataka' --include='*.html' .
```

## Enquiry form

`contact.html` posts to a Google Form. The endpoint lives in one place, the `data-endpoint`
attribute on the `<form>`; the `name` attributes on the fields are the Google Form entry
IDs. `js/site.js` validates client-side, then posts into a hidden iframe because Google
Forms rejects cross-origin `fetch`. The success state is revealed on the iframe's load
event, with a four-second fallback.

To move to a different handler (Formspree, a serverless function), change `data-endpoint`
and the field `name` attributes to match.

## Deploying to GitHub Pages

Push to `main` and set **Settings → Pages → Deploy from a branch → main → / (root)**.

Every internal link is relative and every asset path is relative, so the site works from a
repository subpath (`username.github.io/repo/`) as well as from a custom domain. `CNAME`
points at `sleuthforensics.in`; delete it if you are not using that domain. `.nojekyll`
stops GitHub Pages running the files through Jekyll.

The canonical URLs, `og:url` and `sitemap.xml` are absolute and point at
`https://sleuthforensics.in`. If the domain changes, update them:

```bash
grep -rl 'sleuthforensics.in' --include='*.html' --include='*.xml' --include='*.txt' .
```

## Analytics and security headers

Google Analytics (`G-XHT1ZTL52J`) loads asynchronously on every page. It is the only
third-party script. The privacy policy describes it accurately; if you remove it, update
the **Cookies and analytics** section of `privacy.html` to match.

GitHub Pages cannot set response headers. To add a Content-Security-Policy, HSTS,
`X-Content-Type-Options` and the rest, put the site behind Cloudflare (free tier, keeps
GoDaddy as registrar) and set them as Transform Rules.

## Accessibility

Semantic landmarks, one `<h1>` per page and no skipped heading levels. The index panel is
keyboard operable: Escape closes it and returns focus to its trigger, and while it covers
the viewport on mobile focus is trapped inside it. All interactive elements clear a 44px
minimum target. Text contrast meets WCAG 2.2 AA throughout. Keep it that way when editing:
the `--text-3` and `--text-2-on-ink` tokens are the lightest values that still pass.
