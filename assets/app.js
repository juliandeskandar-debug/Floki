// Kate Doyle — merged site interactions
(function () {
  // Mobile menu
  const toggle = document.querySelector('.menu-toggle');
  const menu = document.querySelector('.menu');
  if (toggle) toggle.addEventListener('click', () => menu.classList.toggle('open'));
  document.querySelectorAll('.menu a').forEach(a =>
    a.addEventListener('click', () => menu.classList.remove('open')));

  // Hero slider
  const slides = document.querySelectorAll('.hero .slide');
  if (slides.length > 1) {
    let i = 0;
    setInterval(() => {
      slides[i].classList.remove('active');
      i = (i + 1) % slides.length;
      slides[i].classList.add('active');
    }, 5000);
  }

  // Reveal on scroll
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));

  // Gallery: load manifest, render, filter, lightbox
  const grid = document.getElementById('gallery-grid');
  if (grid) {
    fetch('assets/gallery.json')
      .then(r => r.json())
      .then(items => {
        const series = ['All', ...Array.from(new Set(items.map(i => i.series)))];
        const chips = document.getElementById('chips');
        series.forEach((s, idx) => {
          const b = document.createElement('button');
          b.className = 'chip' + (idx === 0 ? ' active' : '');
          b.textContent = s;
          b.dataset.series = s;
          b.addEventListener('click', () => {
            document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
            b.classList.add('active');
            render(s);
          });
          chips.appendChild(b);
        });

        function render(filter) {
          grid.innerHTML = '';
          items.filter(i => filter === 'All' || i.series === filter).forEach(i => {
            const card = document.createElement('figure');
            card.className = 'card reveal in';
            card.innerHTML =
              `<img loading="lazy" src="assets/img/${i.file}" alt="${i.title}">` +
              `<figcaption class="cap">${i.title}<br><small style="color:var(--muted)">${i.series}</small></figcaption>`;
            card.addEventListener('click', () => openLb(`assets/img/${i.file}`, `${i.title} — ${i.series}`));
            grid.appendChild(card);
          });
        }
        render('All');
      })
      .catch(() => { grid.innerHTML = '<p class="lead">Gallery loading…</p>'; });
  }

  // Lightbox
  const lb = document.getElementById('lightbox');
  const lbImg = lb ? lb.querySelector('img') : null;
  const lbCap = lb ? lb.querySelector('.lb-cap') : null;
  window.openLb = function (src, cap) {
    if (!lb) return;
    lbImg.src = src; lbCap.textContent = cap || '';
    lb.classList.add('open');
  };
  if (lb) {
    lb.addEventListener('click', () => lb.classList.remove('open'));
    document.addEventListener('keydown', e => { if (e.key === 'Escape') lb.classList.remove('open'); });
  }
})();
