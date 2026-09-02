# Sleuth Forensics — Corporate Website

A production-quality corporate website for Sleuth Forensics, a cybersecurity services and digital forensics firm based in India.

## Technology

- **HTML5** — Semantic, accessible markup
- **CSS3** — Modern CSS with custom properties, no frameworks
- **JavaScript** — Vanilla JS, no dependencies
- **Fonts** — Inter + IBM Plex Mono (Google Fonts)
- **Icons** — Inline SVG, no external libraries

No build step required. No Node.js, npm, or framework dependencies for deployment.

## Structure

```
/
├── index.html                     # Homepage
├── about.html                     # About
├── industries.html                # Industries
├── resources.html                 # Insights / Resources
├── contact.html                   # Contact + Enquiry Form
├── privacy.html                   # Privacy Policy
├── terms.html                     # Terms of Service
├── 404.html                       # Custom 404 Page
├── robots.txt                     # Search engine directives
├── sitemap.xml                    # XML Sitemap
├── config.js                      # Site configuration (placeholders)
├── css/
│   ├── main.css                   # Design system + global styles
│   └── pages.css                  # Page-specific styles
├── js/
│   └── main.js                    # Navigation, form, animations
├── services/
│   ├── index.html                 # Services overview
│   ├── cybersecurity-consulting.html
│   ├── security-audits.html
│   ├── vapt.html
│   ├── network-security.html
│   ├── application-security.html
│   ├── mobile-security.html
│   ├── cloud-security.html
│   ├── identity-security.html
│   ├── endpoint-security.html
│   ├── digital-forensics.html
│   ├── dfir.html
│   ├── incident-response.html
│   ├── compromise-assessment.html
│   ├── malware-analysis.html
│   ├── ransomware.html
│   ├── threat-intelligence.html
│   ├── security-operations.html
│   ├── red-team.html
│   └── compliance.html
└── README.md
```

## Local Development

No build step is required. Serve the files with any static file server:

```bash
# Using Python
python -m http.server 8000

# Using Node.js (npx)
npx serve .

# Using PHP
php -S localhost:8000
```

Then open `http://localhost:8000` in your browser.

## Configuration: Replacing Placeholders

All business information placeholders are centralised in **`config.js`**. Open this file and replace the placeholder values:

| Placeholder | Example |
|---|---|
| `PHONE_NUMBER_HERE` | `+91 98765 43210` |
| `EMAIL_ADDRESS_HERE` | `contact@sleuthforensics.com` |
| `IR_EMAIL_ADDRESS_HERE` | `ir@sleuthforensics.com` |
| `OFFICE_ADDRESS_HERE` | `123 Cyber Lane, Mumbai 400001, India` |
| `LINKEDIN_URL_HERE` | `https://linkedin.com/company/sleuthforensics` |
| `TWITTER_URL_HERE` | `https://x.com/sleuthforensics` |
| `FORM_ENDPOINT_HERE` | `https://formspree.io/f/xxxxx` |
| `sleuthforensics.in` | `sleuthforensics.com` |

### Domain Placeholder

The domain placeholder `sleuthforensics.in` also appears in:
- All HTML files (canonical URLs, Open Graph metadata)
- `sitemap.xml`
- `robots.txt`

Use find-and-replace across all files:
```
Find: sleuthforensics.in
Replace: sleuthforensics.com
```

## Contact Form Setup

The contact form is designed to work with a serverless form handling service. **No credentials are exposed in the frontend code.**

### Recommended: Formspree

1. Create a free account at [formspree.io](https://formspree.io)
2. Create a new form and get your form endpoint
3. Add the endpoint to `config.js`:
   ```js
   formEndpoint: 'https://formspree.io/f/your-form-id',
   ```

### Alternative Options

- **Netlify Forms** — If you ever migrate to Netlify
- **Google Forms** — Embed or redirect
- **Custom serverless function** — AWS Lambda, Google Cloud Functions, etc.

The form currently validates inputs client-side and shows a success message. Without a configured endpoint, submissions are logged to the browser console with instructions.

## GitHub Pages Deployment

### 1. Create a GitHub Repository

```bash
git init
git add .
git commit -m "Initial commit: Sleuth Forensics website"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/sleuthforensics.git
git push -u origin main
```

### 2. Enable GitHub Pages

1. Go to **Settings** > **Pages** in your repository
2. Under **Source**, select **Deploy from a branch**
3. Select **main** branch, **/ (root)** folder
4. Click **Save**

Your site will be available at: `https://YOUR_USERNAME.github.io/sleuthforensics/`

### 3. Custom Domain

1. In **Settings** > **Pages**, enter your custom domain (e.g., `sleuthforensics.com`)
2. Click **Save**
3. Create a `CNAME` file in the repository root:
   ```
   sleuthforensics.com
   ```
4. Enable **Enforce HTTPS** (after DNS propagation)

### 4. Custom 404 Page

GitHub Pages automatically serves `404.html` for missing pages. The custom 404 page is already included.

## GoDaddy DNS Configuration

### Option A: Direct to GitHub Pages

Configure DNS records in GoDaddy:

| Type | Name | Value | TTL |
|------|------|-------|-----|
| A | @ | 185.199.108.153 | 600 |
| A | @ | 185.199.109.153 | 600 |
| A | @ | 185.199.110.153 | 600 |
| A | @ | 185.199.111.153 | 600 |
| CNAME | www | YOUR_USERNAME.github.io | 600 |

### Option B: Via Cloudflare (Recommended)

Using Cloudflare adds performance (CDN), security (DDoS protection, WAF), and allows you to set security headers:

1. Create a free Cloudflare account
2. Add your domain to Cloudflare
3. Update nameservers in GoDaddy to point to Cloudflare
4. Configure DNS in Cloudflare (same records as above)
5. Enable SSL/TLS mode: **Full (strict)**
6. Add security headers via Cloudflare Page Rules or Transform Rules:

```
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; img-src 'self' data:; connect-src 'self' https://formspree.io
```

**Why Cloudflare?**
- Free CDN with edge caching worldwide
- DDoS protection included
- Ability to set HTTP security headers (not possible with GitHub Pages alone)
- Free SSL certificates with automatic renewal
- Analytics without third-party tracking scripts
- Does NOT require moving your domain registrar from GoDaddy

## Security Recommendations

### What This Website Implements
- No inline JavaScript event handlers
- No `eval()` or dynamic code execution
- No credentials, API keys, or secrets in frontend code
- No third-party tracking scripts
- Input validation on contact form
- Output encoding in all user-visible content
- Minimal external dependencies (only Google Fonts CDN)

### What Requires Server/CDN Configuration
These headers should be configured via Cloudflare or your hosting provider:

- **Content-Security-Policy** — Restrict script and resource sources
- **X-Content-Type-Options: nosniff** — Prevent MIME sniffing
- **X-Frame-Options: DENY** — Prevent clickjacking
- **Referrer-Policy: strict-origin-when-cross-origin** — Control referrer info
- **Permissions-Policy** — Disable unnecessary browser APIs
- **Strict-Transport-Security** — Force HTTPS (set via Cloudflare or hosting)

GitHub Pages serves over HTTPS by default when a custom domain is configured with "Enforce HTTPS" enabled.

## Accessibility

The website follows WCAG 2.1 AA guidelines:

- Semantic HTML with proper heading hierarchy
- ARIA landmarks and labels where appropriate
- Keyboard-navigable interface with visible focus indicators
- Accessible forms with labels, error messages, and descriptions
- Sufficient colour contrast throughout
- `prefers-reduced-motion` media query respected
- Screen reader-friendly navigation and content structure

## Browser Support

Designed for modern browsers:
- Chrome / Edge (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Mobile Safari / Chrome (iOS / Android)

## Maintenance

### Adding new content
- Copy an existing service page as a template
- Update the content, metadata, and breadcrumbs
- Add the page to `sitemap.xml`
- Add a link in `services/index.html` and the navigation mega-menu

### Updating styles
- All design tokens are CSS custom properties in `css/main.css`
- Page-specific styles are in `css/pages.css`
- Change colours, spacing, or typography in one place

## Files to Delete Before Deploying

The `generate-services.js` file was used during development to create service pages. It can be safely deleted before deployment:

```bash
rm generate-services.js
```

## License

All rights reserved. This website and its content are proprietary to Sleuth Forensics.
