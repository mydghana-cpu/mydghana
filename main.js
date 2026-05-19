/* ============================================
   MYD Ghana — main.js  v2
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ---- NAV SCROLL EFFECT ---- */
  const nav = document.querySelector('.nav');
  if (nav) {
    const updateNav = () => {
      if (window.scrollY > 60) {
        nav.classList.add('scrolled');
        nav.classList.remove('transparent');
      } else {
        nav.classList.remove('scrolled');
        if (nav.dataset.transparent !== 'false') {
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
      burger.classList.toggle('open');
      mobileMenu.classList.toggle('open');
      document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
    });

    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        burger.classList.remove('open');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
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
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );
    revealElements.forEach(el => revealObserver.observe(el));
  }

  /* ---- COUNTER ANIMATION ---- */
  const counterElements = document.querySelectorAll('[data-count]');

  const animateCounter = (el) => {
    const target = el.dataset.count;
    const isPlus = target.endsWith('+');
    const isMPlus = target.includes('M+');

    let numericTarget;
    let suffix = '';

    if (isMPlus) {
      numericTarget = parseFloat(target);
      suffix = 'M+';
    } else if (isPlus) {
      numericTarget = parseInt(target.replace(/[^0-9]/g, ''));
      suffix = '+';
    } else {
      numericTarget = parseInt(target.replace(/[^0-9]/g, ''));
    }

    const duration = 2000;
    const startTime = performance.now();

    const step = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(numericTarget * eased);

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
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__links a, .nav__mobile a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  /* ---- CONTACT FORM — sends via mailto ---- */
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = new FormData(contactForm);
      const firstName = data.get('firstName') || '';
      const lastName = data.get('lastName') || '';
      const email = data.get('email') || '';
      const subject = data.get('subject') || 'General Enquiry';
      const message = data.get('message') || '';

      const mailSubject = encodeURIComponent(`[MYD Ghana] ${subject} — ${firstName} ${lastName}`);
      const mailBody = encodeURIComponent(
        `Name: ${firstName} ${lastName}\nEmail: ${email}\nInterest: ${subject}\n\nMessage:\n${message}\n\n---\nSent via mydghana.org contact form`
      );
      window.location.href = `mailto:info@mydghana.org?subject=${mailSubject}&body=${mailBody}`;

      const btn = contactForm.querySelector('.btn[type="submit"]');
      btn.textContent = 'Opening Email Client ✓';
      btn.style.background = 'var(--green)';
      btn.style.borderColor = 'var(--green)';
      btn.style.color = 'white';
      btn.disabled = true;

      setTimeout(() => {
        btn.textContent = 'Send Message →';
        btn.style.background = '';
        btn.style.borderColor = '';
        btn.style.color = '';
        btn.disabled = false;
        contactForm.reset();
      }, 5000);
    });
  }

  /* ---- VOLUNTEER FORM — opens Google Form ---- */
  const volunteerForm = document.getElementById('volunteerForm');
  if (volunteerForm) {
    volunteerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      // Open the Google Form in a new tab
      window.open('https://forms.gle/MYDGhanaVolunteerForm', '_blank');
      const btn = volunteerForm.querySelector('.btn[type="submit"]');
      btn.textContent = 'Opening Application Form ✓';
      btn.style.background = 'var(--green)';
      btn.disabled = true;
      setTimeout(() => {
        btn.textContent = 'Submit Application →';
        btn.style.background = '';
        btn.disabled = false;
      }, 4000);
    });
  }

  /* ---- PROGRAMS TABS ---- */
  const tabs = document.querySelectorAll('.programs-tab');
  const panels = document.querySelectorAll('.program-panel');

  if (tabs.length && panels.length) {
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const target = tab.dataset.tab;

        tabs.forEach(t => t.classList.remove('active'));
        panels.forEach(p => p.classList.remove('active'));

        tab.classList.add('active');
        const panel = document.getElementById(`panel-${target}`);
        if (panel) panel.classList.add('active');

        // Smooth scroll to the panel area on mobile
        if (window.innerWidth < 768) {
          panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });

    // Handle hash links like #yfp, #mtm, etc.
    const hash = window.location.hash.replace('#', '');
    if (hash) {
      const matchingTab = document.querySelector(`[data-tab="${hash}"]`);
      if (matchingTab) {
        matchingTab.click();
        setTimeout(() => {
          document.getElementById(`panel-${hash}`)?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  }

  /* ---- SMOOTH HERO PARALLAX ---- */
  const heroBg = document.querySelector('.hero__bg');
  if (heroBg) {
    window.addEventListener('scroll', () => {
      heroBg.style.transform = `translateY(${window.scrollY * 0.2}px)`;
    }, { passive: true });
  }

});