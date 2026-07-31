// Main JS: lightweight, no frameworks. Handles lazy load, search, mobile nav, likes, share, particles init.
(() => {
  'use strict';

  // Utility
  const $ = s => document.querySelector(s);
  const $$ = s => Array.from(document.querySelectorAll(s));

  // DOM refs
  const searchBtn = $('#search-btn');
  const searchOverlay = $('#search-overlay');
  const searchClose = $('#search-close');
  const searchInput = $('#search-input');
  const searchResults = $('#search-results');
  const mobileMenuBtn = $('#mobile-menu');
  const mobileNav = $('#mobile-nav-overlay');
  const themeToggle = $('#theme-toggle');
  const yearEl = $('#year');

  // Set year
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Mobile menu
  if (mobileMenuBtn && mobileNav) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileNav.classList.toggle('hidden');
      mobileNav.setAttribute('aria-hidden', mobileNav.classList.contains('hidden'));
    });
    mobileNav.addEventListener('click', (e) => {
      if (e.target === mobileNav) { mobileNav.classList.add('hidden'); mobileNav.setAttribute('aria-hidden','true'); }
    });
  }

  // Search overlay
  if (searchBtn && searchOverlay) {
    searchBtn.addEventListener('click', () => {
      searchOverlay.classList.remove('hidden');
      searchOverlay.setAttribute('aria-hidden','false');
      setTimeout(()=> searchInput && searchInput.focus(), 120);
    });
  }
  if (searchClose) {
    searchClose.addEventListener('click', () => {
      searchOverlay.classList.add('hidden');
      searchOverlay.setAttribute('aria-hidden','true');
    });
  }
  if (searchOverlay) {
    searchOverlay.addEventListener('click', (e) => {
      if (e.target === searchOverlay) {
        searchOverlay.classList.add('hidden');
        searchOverlay.setAttribute('aria-hidden','true');
      }
    });
  }

  // Instant search/filter
  const cards = Array.from(document.querySelectorAll('.card'));
  function runSearch() {
    const q = searchInput.value.trim().toLowerCase();
    const checkedFilters = Array.from(document.querySelectorAll('.filters input[type="checkbox"]:checked')).map(i => i.value);
    let resultsCount = 0;
    cards.forEach(card => {
      const title = (card.dataset.title||'').toLowerCase();
      const cat = (card.dataset.category||'').toLowerCase();
      const tags = (card.dataset.tags||'').toLowerCase();
      const res = (card.dataset.resolution||'').toLowerCase();
      let visible = true;
      if (q) visible = (title+cat+tags).includes(q);
      if (checkedFilters.length) {
        visible = visible && checkedFilters.every(f => (title+cat+tags+res).includes(f));
      }
      card.style.display = visible ? '' : 'none';
      if (visible) resultsCount++;
    });
    if (searchResults) {
      searchResults.innerHTML = `<div class="muted">${resultsCount} result${resultsCount!==1?'s':''}</div>`;
    }
  }
  if (searchInput) {
    searchInput.addEventListener('input', runSearch);
    const filterBoxes = document.querySelectorAll('.filters input[type="checkbox"]');
    filterBoxes.forEach(cb => cb.addEventListener('change', runSearch));
  }

  // Lazy loading images
  const lazyImgs = Array.from(document.querySelectorAll('img.lazy'));
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.onload = () => { img.style.opacity = '1'; img.style.transform = 'translateY(0)'; };
          img.classList.remove('lazy');
          io.unobserve(img);
        }
      });
    }, {rootMargin: '200px'});
    lazyImgs.forEach(img => io.observe(img));
  } else {
    // Fallback: load all
    lazyImgs.forEach(img => { img.src = img.dataset.src; img.onload = () => { img.style.opacity = '1'; img.style.transform = 'translateY(0)'; }; });
  }

  // Like buttons (favorites) in localStorage
  function initLikes() {
    const likes = $$('.like-btn');
    likes.forEach(btn => {
      const card = btn.closest('.card');
      const id = card ? (card.dataset.title || card.dataset.id || card.dataset.src) : null;
      if (!id) return;
      const key = `mrdrago_like_${id}`;
      const isLiked = localStorage.getItem(key) === '1';
      btn.setAttribute('aria-pressed', isLiked);
      if (isLiked) btn.classList.add('liked');
      btn.addEventListener('click', () => {
        const currently = localStorage.getItem(key) === '1';
        localStorage.setItem(key, currently ? '0' : '1');
        btn.setAttribute('aria-pressed', (!currently).toString());
      });
    });
  }
  initLikes();

  // Share and copy features (progressive enhancement)
  document.addEventListener('click', (e) => {
    const target = e.target;
    if (target.matches('.share-btn')) {
      e.preventDefault();
      const card = target.closest('.card');
      const title = card ? card.dataset.title : document.title;
      const url = location.href;
      if (navigator.share) {
        navigator.share({title, url}).catch(()=>{});
      } else {
        // fallback: copy
        navigator.clipboard && navigator.clipboard.writeText(url).then(()=> alert('Link copied to clipboard'));
      }
    } else if (target.matches('.copy-btn')) {
      const url = target.dataset.clipboard || location.href;
      navigator.clipboard && navigator.clipboard.writeText(url).then(()=> {
        target.textContent = 'Copied';
        setTimeout(()=> target.textContent = 'Copy Link', 1500);
      });
    } else if (target.matches('.download-btn')) {
      // noop; native anchor download handles it
    } else if (target.matches('.card .card-link') || target.closest('.card .card-link')) {
      // small click effect to improve feel
      // (no behavior override)
    }
  });

  // Theme toggle (persist)
  if (themeToggle) {
    const key = 'mrdrago_theme';
    const saved = localStorage.getItem(key) || 'dark';
    document.body.classList.toggle('theme-light', saved === 'light');
    themeToggle.addEventListener('click', () => {
      const isLight = document.body.classList.toggle('theme-light');
      localStorage.setItem(key, isLight ? 'light' : 'dark');
      themeToggle.setAttribute('aria-pressed', String(isLight));
    });
  }

  // Initialize particle background (simple shaders)
  function initParticles() {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = Math.max(1, window.devicePixelRatio || 1);
    let w = canvas.width = innerWidth * dpr;
    let h = canvas.height = innerHeight * dpr;
    canvas.style.width = innerWidth + 'px';
    canvas.style.height = innerHeight + 'px';
    ctx.scale(dpr, dpr);

    const particles = [];
    const emberCount = Math.round((innerWidth * innerHeight) / 70000);
    for (let i=0;i<emberCount;i++) {
      particles.push({
        x: Math.random()*innerWidth,
        y: Math.random()*innerHeight,
        vx: (Math.random()-0.5)*0.2,
        vy: - (0.2 + Math.random()*0.6),
        r: 0.5 + Math.random()*2.2,
        alpha: 0.08 + Math.random()*0.5,
        hue: 10 + Math.random()*20
      });
    }

    function resize() {
      const dpr2 = Math.max(1, window.devicePixelRatio || 1);
      w = canvas.width = innerWidth * dpr2;
      h = canvas.height = innerHeight * dpr2;
      canvas.style.width = innerWidth + 'px';
      canvas.style.height = innerHeight + 'px';
      ctx.setTransform(dpr2,0,0,dpr2,0,0);
    }
    addEventListener('resize', resize);

    let last = performance.now();
    function frame(now) {
      const dt = Math.min(50, now - last) / 16;
      last = now;
      ctx.clearRect(0,0,innerWidth,innerHeight);
      // subtle vignette
      const grad = ctx.createLinearGradient(0,0,0,innerHeight);
      grad.addColorStop(0, 'rgba(0,0,0,0.0)');
      grad.addColorStop(1, 'rgba(0,0,0,0.35)');
      ctx.fillStyle = grad;
      ctx.fillRect(0,0,innerWidth,innerHeight);

      particles.forEach(p => {
        p.x += p.vx * dt * 8;
        p.y += p.vy * dt * 8;
        if (p.y < -20) { p.y = innerHeight + 20; p.x = Math.random()*innerWidth; }
        if (p.x < -20) p.x = innerWidth + 20;
        if (p.x > innerWidth + 20) p.x = -20;

        ctx.beginPath();
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r*8);
        g.addColorStop(0, `rgba(${Math.floor(230)},${Math.floor(50)},${Math.floor(40)},${p.alpha})`);
        g.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = g;
        ctx.arc(p.x, p.y, p.r*8, 0, Math.PI*2);
        ctx.fill();
      });

      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  // Defer heavy init once page is interactive to help Lighthouse
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      setTimeout(initParticles, 200);
    });
  } else {
    setTimeout(initParticles, 200);
  }

  // Small accessibility: enable keyboard focus for cards and open wallpaper via Enter
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && document.activeElement && document.activeElement.matches('.card')) {
      const link = document.activeElement.querySelector('.card-link');
      if (link) link.click();
    }
  });

})();
