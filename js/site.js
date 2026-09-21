/* Sleuth Forensics — interaction layer.
   Three jobs: the masthead rule, the index panel, the enquiry form. */

(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* --- Masthead: hairline appears once the page has moved --- */

  var masthead = document.querySelector('.masthead');

  if (masthead) {
    var setScrolled = function () {
      masthead.dataset.scrolled = window.scrollY > 4 ? 'true' : 'false';
    };
    setScrolled();
    window.addEventListener('scroll', setScrolled, { passive: true });
  }

  /* --- Index panel: services menu on desktop, whole menu on mobile --- */

  var panel = document.getElementById('index-panel');
  var triggers = Array.prototype.slice.call(document.querySelectorAll('[data-panel-trigger]'));

  if (panel && triggers.length) {
    var overlayQuery = window.matchMedia('(max-width: 61.999rem)');

    var focusable = function () {
      return Array.prototype.slice.call(
        panel.querySelectorAll('a[href], button:not([disabled])')
      ).filter(function (el) { return el.offsetParent !== null; });
    };

    var isOpen = function () { return panel.dataset.open === 'true'; };

    var setOpen = function (open) {
      panel.dataset.open = open ? 'true' : 'false';
      masthead.dataset.open = open ? 'true' : 'false';
      triggers.forEach(function (t) { t.setAttribute('aria-expanded', String(open)); });
      document.body.dataset.locked = open && overlayQuery.matches ? 'true' : 'false';
    };

    var open = function (trigger) {
      setOpen(true);
      panel.dataset.returnTo = trigger && trigger.id ? trigger.id : '';
    };

    var close = function (returnFocus) {
      if (!isOpen()) return;
      setOpen(false);
      if (returnFocus) {
        var back = document.getElementById(panel.dataset.returnTo || '');
        if (back) back.focus();
      }
    };

    triggers.forEach(function (trigger) {
      trigger.addEventListener('click', function () {
        if (isOpen()) { close(false); } else { open(trigger); }
      });
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && isOpen()) { close(true); return; }

      // Keep focus inside the panel while it covers the page (mobile).
      if (e.key !== 'Tab' || !isOpen()) return;

      var items = focusable();
      if (!items.length) return;

      if (overlayQuery.matches) {
        var first = items[0];
        var last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      } else if (!e.shiftKey && document.activeElement === items[items.length - 1]) {
        // On desktop the panel is a dropdown: tabbing out of it simply closes it.
        close(false);
      }
    });

    document.addEventListener('click', function (e) {
      if (!isOpen() || overlayQuery.matches) return;
      if (panel.contains(e.target)) return;
      if (triggers.some(function (t) { return t.contains(e.target); })) return;
      close(false);
    });

    overlayQuery.addEventListener('change', function () { close(false); });
  }

  /* --- Enquiry form --- */

  var form = document.getElementById('enquiry');

  if (form) {
    var endpoint = form.dataset.endpoint || '';
    var done = document.getElementById('enquiry-done');
    var submitBtn = form.querySelector('button[type="submit"]');

    var mark = function (field, invalid) {
      var group = field.closest('.field');
      if (group) group.dataset.invalid = invalid ? 'true' : 'false';
      field.setAttribute('aria-invalid', invalid ? 'true' : 'false');
    };

    var validEmail = function (value) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
    };

    var check = function (field) {
      var value = field.value.trim();
      if (field.hasAttribute('required') && !value) return false;
      if (field.type === 'email' && value && !validEmail(value)) return false;
      return true;
    };

    Array.prototype.forEach.call(form.elements, function (field) {
      if (!field.name) return;
      field.addEventListener('blur', function () { mark(field, !check(field)); });
      field.addEventListener('input', function () {
        if (field.getAttribute('aria-invalid') === 'true' && check(field)) mark(field, false);
      });
    });

    var reveal = function () {
      form.hidden = true;
      if (!done) return;
      done.hidden = false;
      done.focus();
    };

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var firstBad = null;
      Array.prototype.forEach.call(form.elements, function (field) {
        if (!field.name) return;
        var ok = check(field);
        mark(field, !ok);
        if (!ok && !firstBad) firstBad = field;
      });

      if (firstBad) { firstBad.focus(); return; }
      if (!endpoint) { reveal(); return; }

      // Google Forms rejects cross-origin fetch, so post into a hidden iframe.
      var sink = document.createElement('iframe');
      sink.name = 'enquiry-sink-' + Date.now();
      sink.hidden = true;
      sink.setAttribute('aria-hidden', 'true');
      sink.setAttribute('tabindex', '-1');
      document.body.appendChild(sink);

      var settled = false;
      var settle = function () {
        if (settled) return;
        settled = true;
        reveal();
        window.setTimeout(function () { sink.remove(); }, 1000);
      };

      sink.addEventListener('load', settle);
      window.setTimeout(settle, 4000);

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending…';
      }

      form.setAttribute('action', endpoint);
      form.setAttribute('method', 'POST');
      form.setAttribute('target', sink.name);
      HTMLFormElement.prototype.submit.call(form);
    });
  }

  /* --- Anchors clear the sticky masthead --- */

  var scrollToTarget = function (target, behavior) {
    var offset = masthead ? masthead.offsetHeight + 24 : 0;
    window.scrollTo({
      top: target.getBoundingClientRect().top + window.scrollY - offset,
      behavior: behavior
    });
  };

  document.addEventListener('click', function (e) {
    var link = e.target.closest ? e.target.closest('a[href^="#"]') : null;
    if (!link) return;

    var id = link.getAttribute('href');
    if (id === '#' || id.length < 2) return;

    var target = document.getElementById(id.slice(1));
    if (!target) return;

    e.preventDefault();
    scrollToTarget(target, reduceMotion.matches ? 'instant' : 'smooth');
    target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
    history.replaceState(null, '', id);
  });

  /* --- Deep links arriving from another page ---
     The browser resolves the fragment before the web fonts swap in, so the
     target has moved by the time layout settles and the landing falls short.
     Re-scroll once the fonts are in, unless the reader has already taken over. */

  if (location.hash.length > 1) {
    var landing = document.getElementById(decodeURIComponent(location.hash.slice(1)));

    if (landing) {
      var readerMoved = false;
      var takeOver = function () { readerMoved = true; };
      ['wheel', 'touchstart', 'keydown'].forEach(function (evt) {
        window.addEventListener(evt, takeOver, { passive: true, once: true });
      });

      var settle = function () {
        if (!readerMoved) scrollToTarget(landing, 'instant');
      };

      settle();
      if (document.fonts) document.fonts.ready.then(settle);
    }
  }
})();
