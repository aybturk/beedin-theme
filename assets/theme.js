/**
 * BEEDIN THEME — theme.js
 * Vanilla JS only. No jQuery. No heavy frameworks.
 * < 15KB minified.
 */

(function() {
  'use strict';

  /* ============================================================
     INITIALIZATION
     ============================================================ */

  document.addEventListener('DOMContentLoaded', function() {
    HeaderScrollState.init();
    MobileMenu.init();
    SearchToggle.init();
    CartDrawer.init();
    ScrollReveal.init();
    QuantityStepper.init();
  });


  /* ============================================================
     1. HEADER SCROLL STATE
     Adds .is-scrolled to #site-header after scrolling 50px.
     ============================================================ */

  var HeaderScrollState = {
    header: null,
    threshold: 50,
    ticking: false,

    init: function() {
      this.header = document.getElementById('site-header');
      if (!this.header) return;

      this.onScroll = this.onScroll.bind(this);
      window.addEventListener('scroll', this.onScroll, { passive: true });
      this.onScroll(); // Run once on load
    },

    onScroll: function() {
      if (!this.ticking) {
        window.requestAnimationFrame(function() {
          HeaderScrollState.update();
          HeaderScrollState.ticking = false;
        });
        this.ticking = true;
      }
    },

    update: function() {
      if (!this.header) return;
      if (window.scrollY > this.threshold) {
        this.header.classList.add('is-scrolled');
      } else {
        this.header.classList.remove('is-scrolled');
      }
    }
  };


  /* ============================================================
     2. MOBILE MENU
     Toggles body class 'mobile-menu-open', manages aria states.
     ============================================================ */

  var MobileMenu = {
    toggle: null,
    nav: null,
    overlay: null,
    closeBtn: null,

    init: function() {
      this.toggle = document.getElementById('mobile-menu-toggle');
      this.nav = document.getElementById('mobile-nav');
      this.overlay = document.getElementById('mobile-nav-overlay');
      this.closeBtn = document.getElementById('mobile-nav-close');

      if (!this.toggle || !this.nav) return;

      this.toggle.addEventListener('click', this.open.bind(this));
      if (this.closeBtn) this.closeBtn.addEventListener('click', this.close.bind(this));
      if (this.overlay) this.overlay.addEventListener('click', this.close.bind(this));

      // Close on Escape key
      document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && document.body.classList.contains('mobile-menu-open')) {
          MobileMenu.close();
        }
      });
    },

    open: function() {
      document.body.classList.add('mobile-menu-open');
      this.nav.classList.add('is-open');
      this.nav.setAttribute('aria-hidden', 'false');
      this.toggle.setAttribute('aria-expanded', 'true');
      if (this.overlay) this.overlay.setAttribute('aria-hidden', 'false');

      // Trap focus
      this.nav.querySelector('a, button') && this.nav.querySelector('a, button').focus();
    },

    close: function() {
      document.body.classList.remove('mobile-menu-open');
      this.nav.classList.remove('is-open');
      this.nav.setAttribute('aria-hidden', 'true');
      this.toggle.setAttribute('aria-expanded', 'false');
      if (this.overlay) this.overlay.setAttribute('aria-hidden', 'true');
      this.toggle.focus();
    }
  };


  /* ============================================================
     3. SEARCH TOGGLE
     Shows/hides the search bar below the header.
     ============================================================ */

  var SearchToggle = {
    toggle: null,
    bar: null,
    closeBtn: null,
    input: null,

    init: function() {
      this.toggle = document.getElementById('search-toggle');
      this.bar = document.getElementById('search-bar');
      this.closeBtn = document.getElementById('search-close');

      if (!this.toggle || !this.bar) return;

      this.input = this.bar.querySelector('input[type="search"]');

      this.toggle.addEventListener('click', this.open.bind(this));
      if (this.closeBtn) this.closeBtn.addEventListener('click', this.close.bind(this));

      // Close on Escape
      document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && SearchToggle.bar && SearchToggle.bar.classList.contains('is-open')) {
          SearchToggle.close();
        }
      });

      // Close on click outside
      document.addEventListener('click', function(e) {
        if (
          SearchToggle.bar &&
          SearchToggle.bar.classList.contains('is-open') &&
          !SearchToggle.bar.contains(e.target) &&
          e.target !== SearchToggle.toggle
        ) {
          SearchToggle.close();
        }
      });
    },

    open: function() {
      this.bar.classList.add('is-open');
      this.bar.setAttribute('aria-hidden', 'false');
      this.toggle.setAttribute('aria-expanded', 'true');
      // Focus the input after transition
      setTimeout(function() {
        if (SearchToggle.input) SearchToggle.input.focus();
      }, 200);
    },

    close: function() {
      this.bar.classList.remove('is-open');
      this.bar.setAttribute('aria-hidden', 'true');
      this.toggle.setAttribute('aria-expanded', 'false');
      this.toggle.focus();
    }
  };


  /* ============================================================
     4. CART DRAWER
     Opens/closes via body class 'cart-drawer-open'.
     Cart toggle can be on the cart icon (if cart type = drawer).
     ============================================================ */

  var CartDrawer = {
    drawer: null,
    overlay: null,
    closeBtn: null,
    cartToggle: null,

    init: function() {
      this.drawer = document.getElementById('cart-drawer');
      this.overlay = document.getElementById('cart-drawer-overlay');
      this.closeBtn = document.getElementById('cart-drawer-close');
      this.cartToggle = document.getElementById('cart-toggle');

      if (!this.drawer) return;

      // Cart icon: intercept if drawer is enabled
      if (this.cartToggle) {
        this.cartToggle.addEventListener('click', function(e) {
          // Only intercept if drawer exists and we're not on cart page
          if (CartDrawer.drawer && !window.location.pathname.includes('/cart')) {
            e.preventDefault();
            CartDrawer.open();
          }
        });
      }

      if (this.closeBtn) {
        this.closeBtn.addEventListener('click', this.close.bind(this));
      }

      if (this.overlay) {
        this.overlay.addEventListener('click', this.close.bind(this));
      }

      // Escape key
      document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && document.body.classList.contains('cart-drawer-open')) {
          CartDrawer.close();
        }
      });
    },

    open: function() {
      document.body.classList.add('cart-drawer-open');
      this.drawer.setAttribute('aria-hidden', 'false');
      if (this.overlay) this.overlay.setAttribute('aria-hidden', 'false');
      // Focus close button
      if (this.closeBtn) {
        setTimeout(function() {
          CartDrawer.closeBtn.focus();
        }, 300);
      }
    },

    close: function() {
      document.body.classList.remove('cart-drawer-open');
      this.drawer.setAttribute('aria-hidden', 'true');
      if (this.overlay) this.overlay.setAttribute('aria-hidden', 'true');
      if (this.cartToggle) this.cartToggle.focus();
    }
  };


  /* ============================================================
     5. SCROLL REVEAL
     IntersectionObserver on .reveal elements.
     Adds .is-visible when element enters viewport.
     ============================================================ */

  var ScrollReveal = {
    observer: null,
    elements: [],

    init: function() {
      // Skip if user prefers reduced motion
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        // Make all reveal elements visible immediately
        document.querySelectorAll('.reveal').forEach(function(el) {
          el.classList.add('is-visible');
        });
        return;
      }

      if (!('IntersectionObserver' in window)) {
        // Fallback: show all
        document.querySelectorAll('.reveal').forEach(function(el) {
          el.classList.add('is-visible');
        });
        return;
      }

      this.observer = new IntersectionObserver(
        function(entries) {
          entries.forEach(function(entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-visible');
              ScrollReveal.observer.unobserve(entry.target);
            }
          });
        },
        {
          threshold: 0.1,
          rootMargin: '0px 0px -40px 0px'
        }
      );

      this.observeAll();
    },

    observeAll: function() {
      document.querySelectorAll('.reveal').forEach(function(el) {
        ScrollReveal.observer.observe(el);
      });
    },

    // Call this after dynamic content is injected
    refresh: function() {
      if (!this.observer) return;
      document.querySelectorAll('.reveal:not(.is-visible)').forEach(function(el) {
        ScrollReveal.observer.observe(el);
      });
    }
  };


  /* ============================================================
     6. QUANTITY STEPPER
     Handles +/- buttons on product page and cart.
     Works with data-quantity-target attribute.
     ============================================================ */

  var QuantityStepper = {
    init: function() {
      // Event delegation on document
      document.addEventListener('click', function(e) {
        var btn = e.target.closest('.quantity-stepper__btn');
        if (!btn) return;

        var targetId = btn.dataset.quantityTarget;
        var input = document.getElementById(targetId) || btn.closest('.quantity-stepper').querySelector('.quantity-stepper__input');
        if (!input) return;

        var current = parseInt(input.value, 10) || 1;
        var min = parseInt(input.min, 10) || 0;
        var max = parseInt(input.max, 10) || Infinity;

        if (btn.classList.contains('quantity-stepper__btn--plus')) {
          input.value = Math.min(current + 1, max);
        } else if (btn.classList.contains('quantity-stepper__btn--minus')) {
          input.value = Math.max(current - 1, min);
        }

        // Dispatch change event for any listeners
        input.dispatchEvent(new Event('change', { bubbles: true }));
      });
    }
  };


  /* ============================================================
     7. ANNOUNCEMENT BAR DISMISS
     (Also handled inline in the section, but this is the fallback)
     ============================================================ */
  // Already handled per-section via inline script in announcement-bar.liquid


  /* ============================================================
     8. VARIANT SELECTION (Product Page)
     Updates hidden input when a radio is selected.
     ============================================================ */

  document.addEventListener('change', function(e) {
    var radio = e.target.closest('.product-main__option-radio');
    if (!radio) return;

    var form = radio.closest('form');
    if (!form) return;

    // Update is-selected class on sibling labels
    var optionGroup = radio.closest('.product-main__option-values');
    if (optionGroup) {
      optionGroup.querySelectorAll('.product-main__option-btn').forEach(function(label) {
        label.classList.remove('is-selected');
      });
      radio.closest('.product-main__option-btn').classList.add('is-selected');
    }

    // Update selected value display (for Color options)
    var optionName = radio.name;
    var selectedDisplay = document.getElementById('selected-' + optionName.toLowerCase().replace(/\s+/g, '-'));
    if (selectedDisplay) {
      selectedDisplay.textContent = radio.value;
    }
  });


  /* ============================================================
     9. SMOOTH FOCUS FOR ANCHOR LINKS
     ============================================================ */

  document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
      var target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // Set focus for accessibility
        target.setAttribute('tabindex', '-1');
        target.focus({ preventScroll: true });
      }
    });
  });


  /* ============================================================
     10. EXPOSE PUBLIC API
     ============================================================ */

  window.BeedinTheme = {
    CartDrawer: CartDrawer,
    ScrollReveal: ScrollReveal,
    MobileMenu: MobileMenu
  };

})();
