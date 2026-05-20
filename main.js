/* ============================================
   MYD Ghana — main.js  v3
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ---- NAV SCROLL EFFECT ---- */
  const nav = document.querySelector('.nav');
  if (nav) {
    const updateNav = () => {
      const isTransparent = nav.dataset.transparent !== 'false';
      if (window.scrollY > 60) {
        nav.classList.add('scrolled');
        nav.classList.remove('transparent');
      } else {
        nav.classList.remove('scrolled');
        if (isTransparent) {
          nav.classList.add('transparent');
        }
      }
    };
    updateNav();
    window.addEventListener('scroll', updateNav, { passive: true });
  }

  /* ---- HAMBURGER MENU ---- */
  const burger = document.querySelector('.nav__burger');
  const mobileMenu = document.querySelector('.nav__mobile');

  if (burger && mobileMenu) {
    burger.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.toggle('open');
      burger.classList.toggle('open', isOpen);
      burger.setAttribute('aria-expanded', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        burger.classList.remove('open');
        mobileMenu.classList.remove('open');
        burger.setAttribute('aria-expanded', false);
        document.body.style.overflow = '';
      });
    });

    /* Close on Escape */
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
        burger.classList.remove('open');
        mobileMenu.classList.remove('open');
        burger.setAttribute('aria-expanded', false);
        document.body.style.overflow = '';
        burger.focus();
      }
    });
  }

  /* ---- SCROLL REVEAL ---- */
  const revealElements = document.querySelectorAll('.reveal');
  if (revealElements.length) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -30px 0px' }
    );
    revealElements.forEach(el => revealObserver.observe(el));
  }

  /* ---- COUNTER ANIMATION ---- */
  const counterElements = document.querySelectorAll('[data-count]');

  const animateCounter = (el) => {
    const target = el.dataset.count;
    const isMPlus = target.includes('M+');
    const isPlus = target.endsWith('+') && !isMPlus;
    const isYear = /^\d{4}$/.test(target);

    let numericTarget;
    let suffix = '';

    if (isMPlus) {
      numericTarget = parseFloat(target) * 10;
      suffix = 'M+';
    } else if (isPlus) {
      numericTarget = parseInt(target.replace(/[^0-9]/g, ''), 10);
      suffix = '+';
    } else {
      numericTarget = parseInt(target.replace(/[^0-9]/g, ''), 10);
    }

    const duration = isYear ? 1200 : 2000;
    const startTime = performance.now();
    const startValue = isYear ? numericTarget - 4 : 0;

    const step = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(startValue + (numericTarget - startValue) * eased);

      if (isMPlus) {
        el.textContent = (current / 10).toFixed(1) + 'M+';
      } else {
        el.textContent = current.toLocaleString() + suffix;
      }

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target;
      }
    };

    requestAnimationFrame(step);
  };

  if (counterElements.length) {
    const counterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            counterObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );
    counterElements.forEach(el => counterObserver.observe(el));
  }

  /* ---- ACTIVE NAV LINK ---- */
  const setActiveNav = () => {
    const path = window.location.pathname;
    const currentPage = path.split('/').pop() || 'index.html';
    const normalised = currentPage === '' ? 'index.html' : currentPage;

    document.querySelectorAll('.nav__links a, .nav__mobile a').forEach(link => {
      link.classList.remove('active');
      const href = link.getAttribute('href')?.split('#')[0];
      if (href === normalised || (normalised === 'index.html' && href === 'index.html')) {
        link.classList.add('active');
      }
    });
  };
  setActiveNav();

  /* ---- CONTACT FORM — sends via mailto ---- */
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = new FormData(contactForm);
      const firstName = data.get('firstName') || '';
      const lastName  = data.get('lastName')  || '';
      const email     = data.get('email')     || '';
      const subject   = data.get('subject')   || 'General Enquiry';
      const message   = data.get('message')   || '';

      const mailSubject = encodeURIComponent(`[MYD Ghana] ${subject} — ${firstName} ${lastName}`);
      const mailBody    = encodeURIComponent(
        `Name: ${firstName} ${lastName}\nEmail: ${email}\nInterest: ${subject}\n\nMessage:\n${message}\n\n---\nSent via mydghana.org contact form`
      );
      window.location.href = `mailto:info@mydghana.org?subject=${mailSubject}&body=${mailBody}`;

      const btn = contactForm.querySelector('.btn[type="submit"]');
      btn.textContent = 'Opening Email Client ✓';
      btn.style.background    = 'var(--green)';
      btn.style.borderColor   = 'var(--green)';
      btn.style.color         = 'white';
      btn.disabled            = true;

      setTimeout(() => {
        btn.textContent         = 'Send via Email →';
        btn.style.background    = '';
        btn.style.borderColor   = '';
        btn.style.color         = '';
        btn.disabled            = false;
        contactForm.reset();
      }, 5000);
    });
  }

  /* ---- VOLUNTEER FORM — opens Google Form ---- */
  const volunteerForm = document.getElementById('volunteerForm');
  if (volunteerForm) {
    volunteerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      window.open('https://forms.gle/UXujGbHb64DSsJGb9', '_blank', 'noopener,noreferrer');

      const btn = volunteerForm.querySelector('.btn[type="submit"]');
      const orig = btn.textContent;
      btn.textContent      = 'Opening Application Form ✓';
      btn.style.background = 'var(--green)';
      btn.disabled         = true;

      setTimeout(() => {
        btn.textContent      = orig;
        btn.style.background = '';
        btn.disabled         = false;
      }, 4000);
    });
  }

  /* ---- PROGRAMS TABS ---- */
  const tabs   = document.querySelectorAll('.programs-tab');
  const panels = document.querySelectorAll('.program-panel');

  if (tabs.length && panels.length) {
    const activateTab = (tabId) => {
      tabs.forEach(t => t.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));

      const tab   = document.querySelector(`[data-tab="${tabId}"]`);
      const panel = document.getElementById(`panel-${tabId}`);
      if (tab)   tab.classList.add('active');
      if (panel) panel.classList.add('active');
    };

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const target = tab.dataset.tab;
        activateTab(target);
        if (window.innerWidth < 768) {
          document.getElementById(`panel-${target}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });

    /* Handle hash links like #yfp, #mtm */
    const hash = window.location.hash.replace('#', '');
    if (hash && document.querySelector(`[data-tab="${hash}"]`)) {
      activateTab(hash);
      setTimeout(() => {
        document.getElementById(`panel-${hash}`)?.scrollIntoView({ behavior: 'smooth' });
      }, 150);
    }
  }

  /* ---- SMOOTH HERO PARALLAX (requestAnimationFrame throttled) ---- */
  const heroBg = document.querySelector('.hero__bg');
  if (heroBg) {
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          heroBg.style.transform = `translateY(${window.scrollY * 0.18}px)`;
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  /* ---- TOPBAR DISMISS ---- */
  const topbar = document.querySelector('.topbar');
  if (topbar) {
    /* Shift nav down if topbar present */
    const topbarH = topbar.offsetHeight;
    const navEl   = document.getElementById('mainNav');
    if (navEl) navEl.style.top = topbarH + 'px';
  }

});


/* ---- SCROLL TO TOP BUTTON ---- */
const scrollBtn = document.createElement('button');
scrollBtn.id = 'scrollTopBtn';
scrollBtn.setAttribute('aria-label', 'Scroll to top');
scrollBtn.innerHTML = `<svg viewBox="0 0 24 24"><path d="M18 15l-6-6-6 6"/></svg>`;
document.body.appendChild(scrollBtn);

window.addEventListener('scroll', () => {
  scrollBtn.classList.toggle('visible', window.scrollY > 600);
}, { passive: true });

scrollBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});