/* ====================================================
   LS BLONDE — script.js
   ==================================================== */

'use strict';

// Register GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// Initialize Lenis Smooth Scroll
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true,
  touchMultiplier: 1.5
});

lenis.on('scroll', ScrollTrigger.update);

gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});

gsap.ticker.lagSmoothing(0);

/* ---- Utilities ---- */
const qs  = (sel, ctx = document) => ctx.querySelector(sel);
const qsa = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
const on  = (el, ev, fn, opts) => el && el.addEventListener(ev, fn, opts);

/* =====================================================
   1. LOADER
   ===================================================== */
(function loader() {
  const loaderEl  = qs('#loader');
  const barEl     = qs('#loaderBar');
  const pctEl     = qs('#loaderPercentage');
  let pct = 0;

  const tick = setInterval(() => {
    pct += Math.random() * 15 + 6;
    if (pct >= 100) {
      pct = 100;
      clearInterval(tick);
      setTimeout(() => {
        loaderEl.classList.add('out');
        document.body.classList.remove('loading');
        qs('#heroImg').classList.add('loaded');
      }, 500);
    }
    const displayPct = Math.floor(pct);
    barEl.style.width = displayPct + '%';
    if (pctEl) pctEl.textContent = displayPct + '%';
  }, 100);
})();

/* =====================================================
   2. CUSTOM CURSOR  (desktop only)
   ===================================================== */
(function cursor() {
  const curEl  = qs('#cursor');
  const dotEl  = qs('#cursorDot');
  if (!curEl) return;

  let mx = 0, my = 0, fx = 0, fy = 0;

  on(document, 'mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dotEl.style.left = mx + 'px';
    dotEl.style.top  = my + 'px';
  });

  (function follow() {
    fx += (mx - fx) * .11;
    fy += (my - fy) * .11;
    curEl.style.left = fx + 'px';
    curEl.style.top  = fy + 'px';
    requestAnimationFrame(follow);
  })();

  const badgeEl = qs('#cursorBadge', curEl);
  const hoverEls = 'a, button, .scard, .rcard, .mosaic__item, .pill';
  on(document, 'mouseover', e => {
    const target = e.target.closest(hoverEls);
    if (!target) return;
    
    curEl.classList.add('is-hover');
    if (badgeEl) {
      if (e.target.closest('.mosaic__item')) {
        badgeEl.textContent = 'View';
        curEl.classList.add('has-badge');
      } else if (e.target.closest('#headerCta, #ctaStripBtn, #scardEnquireBtn')) {
        badgeEl.textContent = 'Book';
        curEl.classList.add('has-badge');
      } else if (e.target.closest('.scard, #heroExploreBtn')) {
        badgeEl.textContent = 'Explore';
        curEl.classList.add('has-badge');
      }
    }
  });
  on(document, 'mouseout', e => {
    const target = e.target.closest(hoverEls);
    if (!target) return;
    
    curEl.classList.remove('is-hover');
    curEl.classList.remove('has-badge');
    if (badgeEl) badgeEl.textContent = '';
  });
  on(document, 'mousedown', () => curEl.classList.add('is-click'));
  on(document, 'mouseup',   () => curEl.classList.remove('is-click'));
})();

/* =====================================================
   3. SCROLL PROGRESS BAR
   ===================================================== */
(function scrollProgress() {
  const bar = qs('#scrollProgress');
  if (!bar) return;
  on(window, 'scroll', () => {
    const total = document.body.scrollHeight - window.innerHeight;
    bar.style.width = ((window.scrollY / total) * 100) + '%';
  }, { passive: true });
})();

/* =====================================================
   4. HEADER — scroll class & active link
   ===================================================== */
(function header() {
  const headerEl = qs('#header');
  const links    = qsa('.header__link');
  const sections = qsa('section[id], .hero-wrapper');

  function update() {
    headerEl.classList.toggle('scrolled', window.scrollY > 60);

    // active link
    let current = '';
    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      if (window.scrollY >= top - 150 && window.scrollY < top + height - 150) {
        current = sec.getAttribute('id');
      }
    });
    
    links.forEach(a => {
      const href = a.getAttribute('href').replace('#', '');
      a.classList.toggle('active', href === current);
    });
  }

  on(window, 'scroll', update, { passive: true });
  update();
})();

/* =====================================================
   5. MOBILE MENU
   ===================================================== */
(function mobileMenu() {
  const burger     = qs('#burger');
  const closeBtn   = qs('#mobileClose');
  const menuEl     = qs('#mobileMenu');
  const mobileLinks = qsa('.mobile-menu__link');

  const open  = () => { menuEl.classList.add('open');  burger.classList.add('open'); };
  const close = () => { menuEl.classList.remove('open'); burger.classList.remove('open'); };

  on(burger, 'click', open);
  on(closeBtn, 'click', close);
  mobileLinks.forEach(a => on(a, 'click', close));
})();

/* =====================================================
   6. GSAP SCROLLTRIGGER ANIMATIONS
   ===================================================== */

// A. Hero Zoom/Scale Down into Card Frame
(function heroScroll() {
  const wrapper = qs('.hero-wrapper');
  const mediaContainer = qs('.hero__media-container');
  const img = qs('#heroImg');
  if (!wrapper || !mediaContainer) return;

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: wrapper,
      start: 'top top',
      end: 'bottom top',
      scrub: true
    }
  });

  tl.to(mediaContainer, {
    scale: 0.9,
    borderRadius: '24px',
    ease: 'none'
  }, 0);

  tl.to(img, {
    scale: 1,
    ease: 'none'
  }, 0);

  tl.to('.hero__content, .hero__metrics, .hero__scroll-hint', {
    opacity: 0,
    y: -40,
    ease: 'none'
  }, 0);
})();

// B. Horizontal Gallery Scroll
(function galleryScroll() {
  const workSection = qs('.work');
  const workTrack = qs('.work__track');
  const pinned = qs('.work__pinned');
  const wrap = qs('.work__horizontal-wrap');
  if (!workSection || !workTrack || !pinned || !wrap) return;

  const getScrollAmount = () => {
    return workTrack.scrollWidth - window.innerWidth + 80; // track width minus viewport width + margin padding
  };

  gsap.to(workTrack, {
    x: () => -getScrollAmount(),
    ease: 'none',
    scrollTrigger: {
      trigger: workSection,
      start: 'top top',
      end: () => `+=${getScrollAmount()}`,
      pin: pinned,
      scrub: 1,
      invalidateOnRefresh: true
    }
  });
})();

// C. Staggered Reveals
(function gsapReveals() {
  gsap.utils.toArray('.reveal-up, .reveal-fade, .reveal-scale').forEach(el => {
    let animProps = { opacity: 0 };
    const delay = parseFloat(el.dataset.delay || 0) / 1000;

    if (el.classList.contains('reveal-up')) {
      animProps.y = 40;
    } else if (el.classList.contains('reveal-fade')) {
      animProps.y = 15;
    } else if (el.classList.contains('reveal-scale')) {
      animProps.scale = 0.94;
    }

    gsap.from(el, {
      ...animProps,
      duration: 0.8,
      delay: delay,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        toggleActions: 'play none none none'
      }
    });
  });
})();

/* =====================================================
   8. COUNTER ANIMATION (hero stats)
   ===================================================== */
(function counters() {
  const els = qsa('.count');
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el       = entry.target;
      const target   = parseFloat(el.dataset.target);
      const isDecimal = 'decimal' in el.dataset;
      const dur      = 1600;
      const start    = performance.now();

      function step(now) {
        const p  = Math.min((now - start) / dur, 1);
        const ep = 1 - Math.pow(1 - p, 3); // ease-out cubic
        const val = ep * target;
        el.textContent = isDecimal ? val.toFixed(1) : Math.floor(val);
        if (p < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
      io.unobserve(el);
    });
  }, { threshold: 0.5 });
  els.forEach(el => io.observe(el));
})();

/* =====================================================
   9. GALLERY / LIGHTBOX
   ===================================================== */
(function gallery() {
  const items      = qsa('.mosaic__item');
  const lb         = qs('#lightbox');
  const lbBd       = qs('#lbBackdrop');
  const lbImg      = qs('#lbImg');
  const lbCaption  = qs('#lbCaption');
  const lbClose    = qs('#lbClose');
  const lbPrev     = qs('#lbPrev');
  const lbNext     = qs('#lbNext');

  let currentIdx = 0;
  const imgData = items.map(item => ({
    src:     item.querySelector('img').src,
    alt:     item.querySelector('img').alt,
    caption: item.dataset.caption || ''
  }));

  function openAt(idx) {
    currentIdx = ((idx % imgData.length) + imgData.length) % imgData.length;
    const d = imgData[currentIdx];
    lbImg.src = d.src;
    lbImg.alt = d.alt;
    lbCaption.textContent = d.caption;
    lb.classList.add('open');
    lbBd.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeLb() {
    lb.classList.remove('open');
    lbBd.classList.remove('open');
    document.body.style.overflow = '';
  }

  items.forEach((item, i) => on(item, 'click', () => openAt(i)));
  on(lbClose,  'click', closeLb);
  on(lbBd,     'click', closeLb);
  on(lbPrev,   'click', () => openAt(currentIdx - 1));
  on(lbNext,   'click', () => openAt(currentIdx + 1));
  on(document, 'keydown', e => {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape')    closeLb();
    if (e.key === 'ArrowLeft') openAt(currentIdx - 1);
    if (e.key === 'ArrowRight')openAt(currentIdx + 1);
  });

  // touch swipe for lightbox
  let ts = 0;
  on(lb, 'touchstart', e => { ts = e.touches[0].clientX; }, { passive: true });
  on(lb, 'touchend',   e => {
    const diff = ts - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) diff > 0 ? openAt(currentIdx + 1) : openAt(currentIdx - 1);
  }, { passive: true });
})();

/* =====================================================
   10. REVIEWS SLIDER
   ===================================================== */
(function reviewsSlider() {
  const track   = qs('#reviewsTrack');
  const prevBtn = qs('#rPrev');
  const nextBtn = qs('#rNext');
  const dotsWrap= qs('#rDots');
  if (!track) return;

  const cards   = qsa('.rcard', track);
  const total   = cards.length;
  let idx       = 0;
  let perView   = getPerView();
  let maxIdx    = total - perView;
  let autoTimer;

  function getPerView() {
    if (window.innerWidth <= 768)  return 1;
    if (window.innerWidth <= 1024) return 2;
    return 3;
  }

  function buildDots() {
    dotsWrap.innerHTML = '';
    const dotCount = Math.max(0, total - perView) + 1;
    for (let i = 0; i < dotCount; i++) {
      const d = document.createElement('button');
      d.className = 'rdot' + (i === idx ? ' active' : '');
      d.setAttribute('aria-label', `Go to review ${i + 1}`);
      on(d, 'click', () => goTo(i));
      dotsWrap.appendChild(d);
    }
  }

  function goTo(i) {
    idx = Math.max(0, Math.min(i, maxIdx));
    const w = cards[0].getBoundingClientRect().width + 24; // gap 1.5rem ≈ 24px
    track.style.transform = `translateX(${-idx * w}px)`;
    dotsWrap.querySelectorAll('.rdot').forEach((d, di) =>
      d.classList.toggle('active', di === idx)
    );
  }

  function startAuto() {
    autoTimer = setInterval(() => goTo(idx >= maxIdx ? 0 : idx + 1), 4800);
  }
  function stopAuto() { clearInterval(autoTimer); }

  on(prevBtn, 'click', () => { stopAuto(); goTo(idx - 1); startAuto(); });
  on(nextBtn, 'click', () => { stopAuto(); goTo(idx + 1); startAuto(); });
  on(track, 'mouseenter', stopAuto);
  on(track, 'mouseleave', startAuto);

  // Touch swipe
  let touchStart = 0;
  on(track, 'touchstart', e => { touchStart = e.touches[0].clientX; }, { passive: true });
  on(track, 'touchend',   e => {
    const diff = touchStart - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) { stopAuto(); goTo(diff > 0 ? idx + 1 : idx - 1); startAuto(); }
  }, { passive: true });

  on(window, 'resize', () => {
    perView = getPerView();
    maxIdx  = total - perView;
    idx     = Math.min(idx, maxIdx);
    buildDots();
    goTo(idx);
  });

  buildDots();
  startAuto();
})();

/* =====================================================
   11. SMOOTH SCROLL for anchor links
   ===================================================== */
qsa('a[href^="#"]').forEach(a => {
  on(a, 'click', e => {
    const target = qs(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

/* =====================================================
   12. SERVICE CARD — subtle tilt on mouse move
   ===================================================== */
qsa('.scard:not(.scard--list)').forEach(card => {
  on(card, 'mousemove', e => {
    const r  = card.getBoundingClientRect();
    const rx = ((e.clientY - r.top)  / r.height - .5) * -6;
    const ry = ((e.clientX - r.left) / r.width  - .5) *  6;
    card.style.transform = `translateY(-10px) rotateX(${rx}deg) rotateY(${ry}deg)`;
    card.style.transition = 'transform .1s';
  });
  on(card, 'mouseleave', () => {
    card.style.transform = '';
    card.style.transition = 'transform .5s cubic-bezier(0.16,1,0.3,1)';
  });
});

/* =====================================================
   13. HERO SCROLL HINT — hide after first scroll
   ===================================================== */
(function scrollHint() {
  const hint = qs('#scrollHint');
  if (!hint) return;
  const hide = () => { hint.style.opacity = '0'; hint.style.pointerEvents = 'none'; };
  on(window, 'scroll', hide, { passive: true, once: true });
})();

/* =====================================================
   14. FAQ ACCORDION LOGIC
   ===================================================== */
(function faqAccordion() {
  const items = qsa('.faq__item');
  items.forEach(item => {
    const question = qs('.faq__question', item);
    const answer = qs('.faq__answer', item);
    
    on(question, 'click', () => {
      const active = item.classList.contains('active');
      
      // Close all items
      items.forEach(otherItem => {
        otherItem.classList.remove('active');
        qs('.faq__question', otherItem).setAttribute('aria-expanded', 'false');
        qs('.faq__answer', otherItem).style.maxHeight = null;
      });
      
      if (!active) {
        item.classList.add('active');
        question.setAttribute('aria-expanded', 'true');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });
})();

/* =====================================================
   15. BACK TO TOP BUTTON WITH PROGRESS RING
   ===================================================== */
(function backToTopBtn() {
  const btn = qs('#backToTop');
  const progressCircle = qs('#backToTopProgress');
  if (!btn || !progressCircle) return;

  const totalLength = 125.6; // 2 * Math.PI * r (r=20)

  function update() {
    const scrollY = window.scrollY;
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;

    if (scrollY > 300) {
      btn.classList.add('show');
    } else {
      btn.classList.remove('show');
    }

    if (totalHeight > 0) {
      const progress = scrollY / totalHeight;
      const offset = totalLength - (progress * totalLength);
      progressCircle.style.strokeDashoffset = offset;
    }
  }

  on(window, 'scroll', update, { passive: true });
  
  on(btn, 'click', () => {
    if (typeof lenis !== 'undefined') {
      lenis.scrollTo(0);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });

  update();
})();

/* =====================================================
   16. DYNAMIC COPYRIGHT YEAR AUTO-UPDATER
   ===================================================== */
(function autoCopyrightYear() {
  const yearEl = qs('#currentYear');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
})();


/* =====================================================
   17. DYNAMIC OPEN/CLOSED STATUS INDICATOR
   ===================================================== */
(function dynamicStatus() {
  const statusText = qs('#statusText');
  const statusPulse = qs('#statusPulse');
  const statusTag = qs('#heroStatusTag');
  if (!statusText || !statusPulse) return;

  function updateStatus() {
    const now = new Date();
    const day = now.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    const hour = now.getHours();
    
    const isOpenDay = day !== 1; // Closed Monday
    const isOpenHour = hour >= 10 && hour < 20; // 10 AM to 8 PM

    if (isOpenDay && isOpenHour) {
      statusText.textContent = `Open Now · Closes at 8 PM`;
      statusPulse.classList.remove('closed-dot');
      statusTag?.classList.remove('closed-tag');
    } else {
      let nextDayText = "tomorrow at 10 AM";
      if (day === 1) {
        nextDayText = "Tuesday at 10 AM";
      } else if (day === 0 && hour >= 20) {
        nextDayText = "Tuesday at 10 AM";
      }
      statusText.textContent = `Closed · Opens ${nextDayText}`;
      statusPulse.classList.add('closed-dot');
      statusTag?.classList.add('closed-tag');
    }
  }
  updateStatus();
  setInterval(updateStatus, 60000);
})();


/* =====================================================
   18. INTERACTIVE QUICK BOOKING MODAL
   ===================================================== */
(function bookingModal() {
  const modal = qs('#bookingModal');
  const backdrop = qs('#bookingBackdrop');
  const closeBtn = qs('#bookingClose');
  const successCloseBtn = qs('#successClose');
  const form = qs('#bookingForm');
  const modalBody = qs('#bookingModalBody');
  const successScreen = qs('#bookingSuccess');
  
  const bookTriggers = qsa('#headerCta, #ctaStripBtn');

  if (!modal || !backdrop) return;

  const dateInput = qs('#bookingDate');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;
  }

  function openModal(e) {
    if (e) e.preventDefault();
    modal.classList.add('open');
    backdrop.classList.add('open');
    if (typeof lenis !== 'undefined') lenis.stop();
    
    form.reset();
    modalBody.style.display = 'block';
    successScreen.style.display = 'none';
  }

  function closeModal() {
    modal.classList.remove('open');
    backdrop.classList.remove('open');
    if (typeof lenis !== 'undefined') lenis.start();
  }

  bookTriggers.forEach(btn => on(btn, 'click', openModal));
  on(closeBtn, 'click', closeModal);
  on(backdrop, 'click', closeModal);
  on(successCloseBtn, 'click', closeModal);

  on(form, 'submit', e => {
    e.preventDefault();
    
    gsap.to(modalBody, {
      opacity: 0,
      duration: 0.3,
      onComplete: () => {
        modalBody.style.display = 'none';
        modalBody.style.opacity = 1;
        successScreen.style.display = 'flex';
        
        gsap.fromTo('.success-circle', 
          { strokeDashoffset: 157 },
          { strokeDashoffset: 0, duration: 0.6, ease: 'power2.out' }
        );
        gsap.fromTo('.success-check', 
          { strokeDashoffset: 48 },
          { strokeDashoffset: 0, duration: 0.4, delay: 0.5, ease: 'power2.out' }
        );
      }
    });
  });
})();


/* =====================================================
   19. PRICING ACCORDION LOGIC
   ===================================================== */
(function pricingAccordion() {
  const items = qsa('.p-accordion__item');
  items.forEach(item => {
    const header = qs('.p-accordion__header', item);
    const content = qs('.p-accordion__content', item);
    if (!header || !content) return;
    
    on(header, 'click', () => {
      const active = item.classList.contains('active');
      
      items.forEach(otherItem => {
        otherItem.classList.remove('active');
        const otherContent = qs('.p-accordion__content', otherItem);
        if (otherContent) otherContent.style.maxHeight = null;
      });
      
      if (!active) {
        item.classList.add('active');
        content.style.maxHeight = content.scrollHeight + 'px';
      }
    });
  });
})();




