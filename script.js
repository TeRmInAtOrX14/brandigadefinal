document.addEventListener('DOMContentLoaded', function () {
  // Nav scroll shadow
  const nav = document.getElementById('nav');
  if (nav) window.addEventListener('scroll', () => nav.classList.toggle('scrolled', window.scrollY > 20));

  // Mobile hamburger
  const toggle = document.getElementById('nav-toggle');
  const navLinks = document.getElementById('nav-links');
  if (toggle && navLinks) toggle.addEventListener('click', () => navLinks.classList.toggle('open'));

  // Mobile dropdown accordion
  document.querySelectorAll('.dd-toggle').forEach(btn => {
    btn.addEventListener('click', () => btn.closest('li').classList.toggle('dd-open'));
  });

  // Animated counters
  const counters = document.querySelectorAll('.counter');
  if (counters.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseFloat(el.dataset.target);
        const prefix = el.dataset.prefix || '';
        const suffix = el.dataset.suffix || '';
        const isFloat = el.dataset.float === 'true';
        let start = 0;
        const duration = 1800;
        const step = timestamp => {
          if (!start) start = timestamp;
          const progress = Math.min((timestamp - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          const value = eased * target;
          el.textContent = prefix + (isFloat ? value.toFixed(1) : Math.floor(value).toLocaleString()) + suffix;
          if (progress < 1) requestAnimationFrame(step);
          else el.textContent = prefix + (isFloat ? target.toFixed(1) : target.toLocaleString()) + suffix;
        };
        requestAnimationFrame(step);
        observer.unobserve(el);
      });
    }, { threshold: 0.3 });
    counters.forEach(c => observer.observe(c));
  }

  // ROI Calculator
  function updateROI() {
    const inv = parseFloat(document.getElementById('r-inv')?.value || 3000);
    const deal = parseFloat(document.getElementById('r-deal')?.value || 25000);
    const rate = parseFloat(document.getElementById('r-rate')?.value || 20) / 100;
    const meetings = 12;
    const pipeline = meetings * deal;
    const revenue = pipeline * rate;
    const roi = Math.round((revenue - inv) / inv * 100);
    const savings = Math.max(0, 7500 - inv);
    const fmt = n => '$' + Math.round(n).toLocaleString();
    const set = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
    set('roi-pipeline', fmt(pipeline));
    set('roi-revenue', fmt(revenue));
    set('roi-percent', roi.toLocaleString() + '%');
    set('roi-savings', fmt(savings));
    document.querySelectorAll('.r-display').forEach(el => {
      const input = document.getElementById(el.dataset.for);
      if (!input) return;
      const v = parseFloat(input.value);
      if (el.dataset.for === 'r-inv') el.textContent = '$' + v.toLocaleString();
      else if (el.dataset.for === 'r-deal') el.textContent = '$' + v.toLocaleString();
      else if (el.dataset.for === 'r-rate') el.textContent = v + '%';
    });
  }
  ['r-inv','r-deal','r-rate'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('input', updateROI);
  });
  updateROI();
});
