/* Otago Deerstalkers – main.js */

// Mobile nav toggle with backdrop
(function () {
  const toggle   = document.querySelector('.nav-toggle');
  const links    = document.querySelector('.nav-links');
  if (!toggle || !links) return;

  const backdrop = document.createElement('div');
  backdrop.className = 'nav-backdrop';
  document.body.appendChild(backdrop);

  function closeNav() {
    links.classList.remove('open');
    backdrop.classList.remove('open');
    toggle.setAttribute('aria-expanded', false);
    toggle.querySelectorAll('span').forEach(s => s.style.transform = '');
  }

  toggle.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    backdrop.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', open);
    toggle.querySelectorAll('span').forEach((s, i) => {
      s.style.transform = open
        ? (i === 0 ? 'translateY(7px) rotate(45deg)' : i === 2 ? 'translateY(-7px) rotate(-45deg)' : 'scale(0)')
        : '';
    });
  });

  backdrop.addEventListener('click', closeNav);
  links.querySelectorAll('a').forEach(a => a.addEventListener('click', closeNav));
})();

// Mark current nav link active
(function () {
  const path = window.location.pathname.replace(/\/$/, '').split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href').replace(/\/$/, '').split('/').pop();
    if (href === path) a.classList.add('active');
  });
})();

// Smooth-reveal sections on scroll
(function () {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('revealed'); io.unobserve(e.target); } });
  }, { threshold: 0.1 });
  els.forEach(el => io.observe(el));
})();
