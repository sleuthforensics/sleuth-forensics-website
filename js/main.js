/* ============================================================
   SLEUTH FORENSICS — Main JavaScript
   ============================================================
   Minimal, vanilla JS. No frameworks. No dependencies.
   ============================================================ */

(function () {
  'use strict';

  /* -------------------------------------------------------- */
  /*  Header scroll state                                     */
  /* -------------------------------------------------------- */

  var header = document.querySelector('.header');
  if (header) {
    var onScroll = function () {
      if (window.scrollY > 10) {
        header.classList.add('header--scrolled');
      } else {
        header.classList.remove('header--scrolled');
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }


  /* -------------------------------------------------------- */
  /*  Mobile menu                                             */
  /* -------------------------------------------------------- */

  var menuToggle = document.getElementById('menu-toggle');
  var mobileNav = document.getElementById('mobile-nav');
  var menuClose = document.getElementById('menu-close');

  function openMobileMenu() {
    if (!mobileNav || !menuToggle) return;
    mobileNav.classList.add('mobile-nav--open');
    document.body.classList.add('menu-open');
    menuToggle.setAttribute('aria-expanded', 'true');
    // Focus first link
    var firstLink = mobileNav.querySelector('a, button');
    if (firstLink) firstLink.focus();
  }

  function closeMobileMenu() {
    if (!mobileNav || !menuToggle) return;
    mobileNav.classList.remove('mobile-nav--open');
    document.body.classList.remove('menu-open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.focus();
  }

  if (menuToggle) {
    menuToggle.addEventListener('click', function () {
      var isOpen = mobileNav.classList.contains('mobile-nav--open');
      if (isOpen) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });
  }

  if (menuClose) {
    menuClose.addEventListener('click', closeMobileMenu);
  }

  // Close on Escape
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      closeMobileMenu();
      closeMegaMenu();
    }
  });


  /* -------------------------------------------------------- */
  /*  Mobile accordion (Services submenu)                     */
  /* -------------------------------------------------------- */

  var accordionTriggers = document.querySelectorAll('.mobile-nav__accordion-trigger');
  accordionTriggers.forEach(function (trigger) {
    trigger.addEventListener('click', function () {
      var body = trigger.nextElementSibling;
      var isOpen = body.classList.contains('mobile-nav__accordion-body--open');
      // Close all
      document.querySelectorAll('.mobile-nav__accordion-body').forEach(function (b) {
        b.classList.remove('mobile-nav__accordion-body--open');
      });
      document.querySelectorAll('.mobile-nav__accordion-trigger').forEach(function (t) {
        t.setAttribute('aria-expanded', 'false');
      });
      // Toggle current
      if (!isOpen) {
        body.classList.add('mobile-nav__accordion-body--open');
        trigger.setAttribute('aria-expanded', 'true');
      }
    });
  });


  /* -------------------------------------------------------- */
  /*  Desktop mega-menu                                       */
  /* -------------------------------------------------------- */

  var servicesToggle = document.getElementById('services-toggle');
  var megaMenu = document.getElementById('mega-menu');

  function openMegaMenu() {
    if (!megaMenu || !servicesToggle) return;
    megaMenu.classList.add('mega-menu--open');
    servicesToggle.setAttribute('aria-expanded', 'true');
  }

  function closeMegaMenu() {
    if (!megaMenu || !servicesToggle) return;
    megaMenu.classList.remove('mega-menu--open');
    servicesToggle.setAttribute('aria-expanded', 'false');
  }

  if (servicesToggle) {
    var hoverTimeout;
    
    function handleMouseEnter() {
      clearTimeout(hoverTimeout);
      openMegaMenu();
    }
    
    function handleMouseLeave() {
      hoverTimeout = setTimeout(function() {
        closeMegaMenu();
      }, 150);
    }

    servicesToggle.addEventListener('mouseenter', handleMouseEnter);
    servicesToggle.addEventListener('mouseleave', handleMouseLeave);
    
    if (megaMenu) {
      megaMenu.addEventListener('mouseenter', handleMouseEnter);
      megaMenu.addEventListener('mouseleave', handleMouseLeave);
    }

    servicesToggle.addEventListener('click', function (e) {
      e.preventDefault();
      var isOpen = megaMenu.classList.contains('mega-menu--open');
      if (isOpen) {
        closeMegaMenu();
      } else {
        openMegaMenu();
      }
    });

    // Close when clicking outside
    document.addEventListener('click', function (e) {
      if (megaMenu && megaMenu.classList.contains('mega-menu--open')) {
        if (!megaMenu.contains(e.target) && !servicesToggle.contains(e.target)) {
          closeMegaMenu();
        }
      }
    });

    // Keyboard: close on Tab out of mega-menu
    if (megaMenu) {
      megaMenu.addEventListener('keydown', function (e) {
        if (e.key === 'Tab') {
          var links = megaMenu.querySelectorAll('a');
          var lastLink = links[links.length - 1];
          if (e.target === lastLink && !e.shiftKey) {
            closeMegaMenu();
          }
        }
      });
    }
  }


  /* -------------------------------------------------------- */
  /*  Scroll reveal animations                                */
  /* -------------------------------------------------------- */

  var reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale, .reveal-stagger');
  if (reveals.length > 0 && 'IntersectionObserver' in window) {
    var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!prefersReducedMotion.matches) {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var target = entry.target;
            
            // Handle stagger children
            if (target.classList.contains('reveal-stagger')) {
              var children = target.children;
              for (var i = 0; i < children.length; i++) {
                children[i].style.transitionDelay = (i * 0.15) + 's';
              }
              target.classList.add('reveal-stagger--visible');
            } else {
              // Handle standard variants
              if (target.classList.contains('reveal')) target.classList.add('reveal--visible');
              else if (target.classList.contains('reveal-left')) target.classList.add('reveal-left--visible');
              else if (target.classList.contains('reveal-right')) target.classList.add('reveal-right--visible');
              else if (target.classList.contains('reveal-scale')) target.classList.add('reveal-scale--visible');
            }
            
            observer.unobserve(target);
          }
        });
      }, {
        threshold: 0.15,
        rootMargin: '0px 0px -40px 0px'
      });

      reveals.forEach(function (el) {
        observer.observe(el);
      });
    } else {
      // If reduced motion, just show everything immediately
      reveals.forEach(function (el) {
        if (el.classList.contains('reveal-stagger')) {
          el.classList.add('reveal-stagger--visible');
        } else {
          el.style.opacity = '1';
          el.style.transform = 'none';
        }
      });
    }
  }


  /* -------------------------------------------------------- */
  /*  Contact form validation                                 */
  /* -------------------------------------------------------- */

  var contactForm = document.getElementById('contact-form');
  if (contactForm) {
    function handleFormSubmit(e) {
      e.preventDefault();

      var valid = true;

      // Clear previous errors
      contactForm.querySelectorAll('.form-group--error').forEach(function (g) {
        g.classList.remove('form-group--error');
      });

      // Validate required fields
      var requiredFields = contactForm.querySelectorAll('[required]');
      requiredFields.forEach(function (field) {
        var group = field.closest('.form-group');
        if (!field.value.trim()) {
          if (group) group.classList.add('form-group--error');
          valid = false;
        }
      });

      // Validate email
      var emailField = contactForm.querySelector('[type="email"]');
      if (emailField && emailField.value.trim()) {
        var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(emailField.value.trim())) {
          var emailGroup = emailField.closest('.form-group');
          if (emailGroup) emailGroup.classList.add('form-group--error');
          valid = false;
        }
      }

      if (!valid) {
        // Focus first error
        var firstError = contactForm.querySelector('.form-group--error input, .form-group--error textarea, .form-group--error select');
        if (firstError) firstError.focus();
        return;
      }

      // Check if a real form endpoint is configured
      if (typeof SITE_CONFIG !== 'undefined' && SITE_CONFIG.formEndpoint && SITE_CONFIG.formEndpoint !== 'FORM_ENDPOINT_HERE') {
        // Google Forms submission via hidden iframe
        // This avoids CORS issues entirely — the form submits natively into an invisible iframe
        var iframeName = 'sleuth_form_target_' + Date.now();
        var iframe = document.createElement('iframe');
        iframe.name = iframeName;
        iframe.style.display = 'none';
        document.body.appendChild(iframe);

        // Set form to submit into the hidden iframe
        contactForm.setAttribute('target', iframeName);
        contactForm.setAttribute('action', SITE_CONFIG.formEndpoint);
        contactForm.setAttribute('method', 'POST');

        // Show success immediately — Google Forms always accepts valid POST data
        // We show success before submit to avoid any timing issues with iframe load
        showFormSuccess();

        // Remove this listener temporarily to prevent recursion, then submit natively
        contactForm.removeEventListener('submit', handleFormSubmit);
        contactForm.submit();

        // Clean up iframe after a delay
        setTimeout(function () {
          if (iframe.parentNode) iframe.parentNode.removeChild(iframe);
        }, 5000);

        return; // Don't fall through
      } else {
        // No endpoint configured — show success for demo, log to console
        console.info('[Sleuth Forensics] Form submission captured. To enable real form submission, configure SITE_CONFIG.formEndpoint in config.js with a secure form handling service (e.g., Formspree, Netlify Forms, or a serverless function).');
        showFormSuccess();
      }
    }
    contactForm.addEventListener('submit', handleFormSubmit);
  }

  function showFormSuccess() {
    var form = document.getElementById('contact-form');
    var success = document.getElementById('form-success');
    if (form) form.style.display = 'none';
    if (success) success.classList.add('form-success--visible');
  }



  // Clear individual field errors on input
  document.querySelectorAll('.form-group input, .form-group textarea, .form-group select').forEach(function (field) {
    field.addEventListener('input', function () {
      var group = field.closest('.form-group');
      if (group) group.classList.remove('form-group--error');
    });
  });


  /* -------------------------------------------------------- */
  /*  Smooth scroll for anchor links                          */
  /* -------------------------------------------------------- */

  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var href = link.getAttribute('href');
      if (href === '#') return;
      var target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        var headerHeight = header ? header.offsetHeight : 0;
        var top = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;
        window.scrollTo({ top: top, behavior: 'smooth' });
        closeMobileMenu();
      }
    });
  });

  /* -------------------------------------------------------- */
  /*  Hero Slider (Netflix-style)                             */
  /* -------------------------------------------------------- */

  var heroSlider = document.getElementById('main-hero-slider');
  if (heroSlider) {
    var slides = heroSlider.querySelectorAll('.hero-slide');
    var btnPrev = heroSlider.querySelector('.hero-slider__arrow--prev');
    var btnNext = heroSlider.querySelector('.hero-slider__arrow--next');
    var progressFill = heroSlider.querySelector('.hero-slider__progress-fill');
    
    var slidesContainer = heroSlider.querySelector('.hero-slider__slides');
    var currentSlide = 0;
    var slideDuration = 5000;
    var slideTimer = null;
    var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function goToSlide(index) {
      slides[currentSlide].classList.remove('active');
      
      currentSlide = index;
      if (currentSlide < 0) currentSlide = slides.length - 1;
      if (currentSlide >= slides.length) currentSlide = 0;
      
      if (slidesContainer && !prefersReducedMotion) {
        slidesContainer.style.transform = 'translateX(-' + (currentSlide * 100) + '%)';
      }
      
      slides[currentSlide].classList.add('active');
      resetProgress();
    }

    function resetProgress() {
      if (prefersReducedMotion) return;
      
      // Reset CSS transition for the candlestick
      if (progressFill) {
        progressFill.classList.remove('animating');
        void progressFill.offsetWidth; // Force DOM reflow to restart animation
        progressFill.classList.add('animating');
      }
      
      // Reset auto-advance timer
      clearTimeout(slideTimer);
      slideTimer = setTimeout(function() {
        goToSlide(currentSlide + 1);
      }, slideDuration);
    }

    if (btnPrev) {
      btnPrev.addEventListener('click', function() {
        goToSlide(currentSlide - 1);
      });
    }
    
    if (btnNext) {
      btnNext.addEventListener('click', function() {
        goToSlide(currentSlide + 1);
      });
    }

    // Init
    if (!prefersReducedMotion) {
      resetProgress();
    } else if (progressFill) {
      // Hide progress bar if animations are disabled at the OS level
      progressFill.style.display = 'none'; 
    }
  }

})();
