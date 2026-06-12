/* =============================================================
   BEYOND INFINITY DEVELOPMENT — SCRIPT.JS
   Structure:
   1. Dark / Light Mode Toggle (with localStorage persistence)
   2. Mobile Navigation (Hamburger Menu)
   3. Sticky Header Active Link Highlighting on Scroll
   4. Smooth Scrolling for Nav Links
   5. Scroll Reveal Animations
   6. Back to Top Button
   7. Contact Form Validation
   8. Footer Current Year
============================================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ===========================================================
     1. DARK / LIGHT MODE TOGGLE
     - Reads saved theme from localStorage on load
     - Toggles the data-theme attribute on <html>/<body>
     - Persists user choice
  =========================================================== */
  const themeToggle = document.getElementById('themeToggle');
  const rootElement = document.documentElement;
  const THEME_KEY = 'bid-theme-preference';

  // Apply saved theme (or default to light) on page load
  const savedTheme = localStorage.getItem(THEME_KEY);
  if (savedTheme === 'dark') {
    rootElement.setAttribute('data-theme', 'dark');
    themeToggle.setAttribute('aria-pressed', 'true');
  }

  themeToggle.addEventListener('click', () => {
    const isDark = rootElement.getAttribute('data-theme') === 'dark';

    if (isDark) {
      rootElement.removeAttribute('data-theme');
      localStorage.setItem(THEME_KEY, 'light');
      themeToggle.setAttribute('aria-pressed', 'false');
    } else {
      rootElement.setAttribute('data-theme', 'dark');
      localStorage.setItem(THEME_KEY, 'dark');
      themeToggle.setAttribute('aria-pressed', 'true');
    }
  });


  /* ===========================================================
     2. MOBILE NAVIGATION (HAMBURGER MENU)
     - Toggles the off-canvas nav menu
     - Closes menu when a link is clicked (mobile UX)
     - Animates hamburger icon into an "X"
  =========================================================== */
  const hamburger = document.getElementById('hamburger');
  const navbarLinks = document.getElementById('navbarLinks');

  const closeMobileMenu = () => {
    hamburger.classList.remove('active');
    navbarLinks.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
  };

  const toggleMobileMenu = () => {
    const isOpen = navbarLinks.classList.toggle('open');
    hamburger.classList.toggle('active', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
  };

  hamburger.addEventListener('click', toggleMobileMenu);

  // Close mobile menu after clicking any nav link
  navbarLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeMobileMenu);
  });

  // Close mobile menu on outside click
  document.addEventListener('click', (event) => {
    const isClickInsideNav = navbarLinks.contains(event.target) || hamburger.contains(event.target);
    if (!isClickInsideNav && navbarLinks.classList.contains('open')) {
      closeMobileMenu();
    }
  });


  /* ===========================================================
     3. ACTIVE LINK HIGHLIGHTING ON SCROLL
     - Highlights the nav link of the section currently in view
  =========================================================== */
  const sections = document.querySelectorAll('main section[id]');
  const navLinks = document.querySelectorAll('.navbar__link');

  const highlightActiveLink = () => {
    const scrollPosition = window.scrollY + (window.innerHeight * 0.3);

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionBottom = sectionTop + section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
        navLinks.forEach((link) => {
          link.classList.toggle('active', link.getAttribute('href') === `#${sectionId}`);
        });
      }
    });
  };

  window.addEventListener('scroll', highlightActiveLink);


  /* ===========================================================
     4. SMOOTH SCROLLING FOR NAV LINKS
     - Native CSS `scroll-behavior: smooth` already covers this,
       but we add an offset adjustment so the sticky header
       doesn't overlap the section heading.
  =========================================================== */
  const allNavAnchors = document.querySelectorAll('a[href^="#"]');
  const headerHeight = document.querySelector('.site-header').offsetHeight;

  allNavAnchors.forEach((anchor) => {
    anchor.addEventListener('click', (event) => {
      const targetId = anchor.getAttribute('href');
      if (targetId.length <= 1) return; // ignore "#" only links

      const targetEl = document.querySelector(targetId);
      if (!targetEl) return;

      event.preventDefault();

      const targetPosition = targetEl.getBoundingClientRect().top + window.scrollY - headerHeight + 1;

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    });
  });


  /* ===========================================================
     5. SCROLL REVEAL ANIMATIONS
     - Uses IntersectionObserver to fade/slide elements into
       view as the user scrolls down the page.
  =========================================================== */
  const animatedElements = document.querySelectorAll('.animate-on-scroll');

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target); // animate once only
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -40px 0px'
  });

  animatedElements.forEach((el) => revealObserver.observe(el));


  /* ===========================================================
     6. BACK TO TOP BUTTON
     - Shows button after scrolling past one viewport height
     - Smoothly scrolls back to top on click
  =========================================================== */
  const backToTopBtn = document.getElementById('backToTop');

  window.addEventListener('scroll', () => {
    if (window.scrollY > window.innerHeight) {
      backToTopBtn.classList.add('show');
    } else {
      backToTopBtn.classList.remove('show');
    }
  });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });


  /* ===========================================================
     7. CONTACT FORM VALIDATION
     - Validates: name required, valid email, valid phone,
       message minimum length
     - Displays inline, accessible error messages
     - Shows success message on valid submission
  =========================================================== */
  const contactForm = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');

  // Regex patterns
  const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const PHONE_PATTERN = /^[0-9+\-\s()]{7,20}$/; // accepts digits, +, -, spaces, parentheses

  // Field configuration: validator function + error message
  const fieldValidators = {
    fullName: {
      input: () => document.getElementById('fullName'),
      errorEl: () => document.getElementById('fullNameError'),
      validate: (value) => value.trim().length >= 2,
      message: 'Please enter your full name (at least 2 characters).'
    },
    email: {
      input: () => document.getElementById('email'),
      errorEl: () => document.getElementById('emailError'),
      validate: (value) => EMAIL_PATTERN.test(value.trim()),
      message: 'Please enter a valid email address (e.g. name@example.com).'
    },
    phone: {
      input: () => document.getElementById('phone'),
      errorEl: () => document.getElementById('phoneError'),
      validate: (value) => PHONE_PATTERN.test(value.trim()),
      message: 'Please enter a valid phone number (7-20 digits).'
    },
    message: {
      input: () => document.getElementById('message'),
      errorEl: () => document.getElementById('messageError'),
      validate: (value) => value.trim().length >= 20,
      message: 'Your message should be at least 20 characters long.'
    }
  };

  /**
   * Validates a single field and updates its UI state
   * (error class + message). Returns true if valid.
   */
  const validateField = (fieldKey) => {
    const config = fieldValidators[fieldKey];
    const inputEl = config.input();
    const errorEl = config.errorEl();
    const isValid = config.validate(inputEl.value);
    const formGroup = inputEl.closest('.form-group');

    if (isValid) {
      formGroup.classList.remove('has-error');
      errorEl.textContent = '';
    } else {
      formGroup.classList.add('has-error');
      errorEl.textContent = config.message;
    }

    return isValid;
  };

  // Live validation as the user types / leaves a field
  Object.keys(fieldValidators).forEach((fieldKey) => {
    const inputEl = fieldValidators[fieldKey].input();

    inputEl.addEventListener('blur', () => validateField(fieldKey));
    inputEl.addEventListener('input', () => {
      // Only re-validate while typing if the field already has an error,
      // so users aren't shown errors before they finish typing.
      const formGroup = inputEl.closest('.form-group');
      if (formGroup.classList.contains('has-error')) {
        validateField(fieldKey);
      }
    });
  });

  // Form submission handler
  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();
    formSuccess.classList.remove('show');

    let isFormValid = true;

    Object.keys(fieldValidators).forEach((fieldKey) => {
      const fieldIsValid = validateField(fieldKey);
      if (!fieldIsValid) isFormValid = false;
    });

    if (isFormValid) {
      // Simulate successful submission (no backend connected)
      formSuccess.classList.add('show');
      contactForm.reset();

      // Clear any leftover error states
      Object.keys(fieldValidators).forEach((fieldKey) => {
        const inputEl = fieldValidators[fieldKey].input();
        inputEl.closest('.form-group').classList.remove('has-error');
        fieldValidators[fieldKey].errorEl().textContent = '';
      });

      // Hide success message after a few seconds
      setTimeout(() => {
        formSuccess.classList.remove('show');
      }, 6000);
    } else {
      // Focus the first invalid field for accessibility
      const firstErrorGroup = contactForm.querySelector('.form-group.has-error .form-input');
      if (firstErrorGroup) firstErrorGroup.focus();
    }
  });


  /* ===========================================================
     8. FOOTER CURRENT YEAR
  =========================================================== */
  const yearSpan = document.getElementById('currentYear');
  yearSpan.textContent = new Date().getFullYear();

});
