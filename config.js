/**
 * Sleuth Forensics — Site Configuration
 * ============================================================
 * Replace the placeholder values below with your actual
 * business information. This is the ONLY file you need to
 * edit for contact details, social links, and form settings.
 * ============================================================
 */

const SITE_CONFIG = {

  // Company
  companyName: 'Sleuth Forensics',
  domain: 'sleuthforensics.in',           // e.g. 'sleuthforensics.com'
  tagline: 'Cybersecurity & Digital Forensics',

  // Contact
  phone: '+91 81974 66502',           // e.g. '+91 98765 43210'
  email: 'prem@sleuthforensics.in',          // e.g. 'contact@sleuthforensics.com'
  irEmail: 'info@sleuthforensics.in',     // Incident response email
  address: 'Sleuth Forensics Consultancy Services, Bangalore, Karnataka, India',       // e.g. '123 Cyber Lane, Mumbai 400001, India'

  // Social
  linkedin: 'LINKEDIN_URL_HERE',        // e.g. 'https://linkedin.com/company/sleuthforensics'
  twitter: 'TWITTER_URL_HERE',          // e.g. 'https://x.com/sleuthforensics'
  github: '',                           // Optional

  // Legal
  registrationNumber: 'COMPANY_REGISTRATION_NUMBER_HERE',
  copyrightYear: '2026',

  // Form handling
  // Replace with your form endpoint (Formspree, Netlify Forms, etc.)
  formEndpoint: 'https://docs.google.com/forms/d/e/1FAIpQLScPKhBFQwS0CP4fkg7dw9YfEbXEe0eGC90xZjH8w-QyevInEA/formResponse',   // e.g. 'https://formspree.io/f/xxxxx'

  // Analytics (optional — add your tracking ID)
  analyticsId: '',
};

/* ---------------------------------------------------------- */
/*  Inject placeholders into the page on load                 */
/* ---------------------------------------------------------- */

document.addEventListener('DOMContentLoaded', function () {

  // Phone
  document.querySelectorAll('[data-config="phone"]').forEach(function (el) {
    el.textContent = SITE_CONFIG.phone;
    if (el.tagName === 'A') el.href = 'tel:' + SITE_CONFIG.phone.replace(/\s/g, '');
  });

  // Email
  document.querySelectorAll('[data-config="email"]').forEach(function (el) {
    el.textContent = SITE_CONFIG.email;
    if (el.tagName === 'A') el.href = 'mailto:' + SITE_CONFIG.email;
  });

  // IR Email
  document.querySelectorAll('[data-config="irEmail"]').forEach(function (el) {
    el.textContent = SITE_CONFIG.irEmail;
    if (el.tagName === 'A') el.href = 'mailto:' + SITE_CONFIG.irEmail;
  });

  // Address
  document.querySelectorAll('[data-config="address"]').forEach(function (el) {
    el.textContent = SITE_CONFIG.address;
  });

  // LinkedIn
  document.querySelectorAll('[data-config="linkedin"]').forEach(function (el) {
    if (el.tagName === 'A') el.href = SITE_CONFIG.linkedin;
  });

  // Twitter
  document.querySelectorAll('[data-config="twitter"]').forEach(function (el) {
    if (el.tagName === 'A') el.href = SITE_CONFIG.twitter;
  });

  // Copyright
  document.querySelectorAll('[data-config="copyrightYear"]').forEach(function (el) {
    el.textContent = SITE_CONFIG.copyrightYear;
  });

  // Registration
  document.querySelectorAll('[data-config="registrationNumber"]').forEach(function (el) {
    el.textContent = SITE_CONFIG.registrationNumber;
  });
});
