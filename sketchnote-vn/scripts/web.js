// Bản web: chuyển tab giữa các poster, phát hiệu ứng khi thẻ cuộn vào màn hình,
// bấm thẻ để xem lại, co công thức quá rộng. Không có JS thì poster vẫn hiển thị đầy đủ.
(() => {
  const posters = [...document.querySelectorAll('.poster')];
  const tabs = [...document.querySelectorAll('.web-bar [data-tab]')];

  function show(id) {
    const target = posters.find((p) => p.id === id) ? id : posters[0]?.id;
    posters.forEach((p) => { p.hidden = posters.length > 1 && p.id !== target; });
    tabs.forEach((t) => t.setAttribute('aria-selected', String(t.dataset.tab === target)));
    tabs.find((t) => t.dataset.tab === target)?.scrollIntoView({ block: 'nearest', inline: 'center' });
    replayAll();
    fit();
  }
  tabs.forEach((t) => t.addEventListener('click', () => {
    show(t.dataset.tab);
    try { history.replaceState(null, '', '#' + t.dataset.tab); } catch {}
  }));

  // Công thức rộng hơn khung thì thu nhỏ dần cho vừa (màn hình hẹp).
  function fit() {
    for (const el of document.querySelectorAll('.v-formula .tex, .display')) {
      el.style.fontSize = '';
      let f = 100;
      while (el.scrollWidth > el.clientWidth + 1 && f > 60) { f -= 5; el.style.fontSize = f + '%'; }
    }
    if (typeof drawMindmaps === 'function') drawMindmaps();
  }
  document.fonts?.ready.then(fit);
  let rt;
  addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(fit, 150); });

  const motion = !matchMedia('(prefers-reduced-motion: reduce)').matches;
  const targets = () => document.querySelectorAll('.poster:not([hidden]) :is(.hero, .card, .recap)');

  function play(el) {
    el.classList.remove('play');
    void el.offsetWidth; // khởi động lại animation
    el.classList.add('play');
  }
  function replayAll() { if (motion) targets().forEach((el) => { el.classList.remove('play'); io?.observe(el); }); }

  let io = null;
  if (motion) {
    document.documentElement.classList.add('anim');
    // Độ dài nét để vẽ dần (stroke-dashoffset); nghỉ = vẽ đủ.
    const drawable = '.doodle :is(path,circle,rect,ellipse,polyline,line), .ic :is(path,rect), .ribbon, .wave path, .v-graph .gline, .v-graph .axis path, .v-numberline .axis path, .tl-axis, .tl-done';
    for (const el of document.querySelectorAll(drawable)) {
      try {
        const L = Math.ceil(el.getTotalLength());
        if (L > 0) { el.style.setProperty('--len', L); el.style.strokeDasharray = L; }
      } catch {}
    }
    io = 'IntersectionObserver' in window ? new IntersectionObserver((entries) => {
      for (const e of entries) if (e.isIntersecting) { play(e.target); io.unobserve(e.target); }
    }, { threshold: 0.15 }) : null;
    document.addEventListener('click', (e) => {
      const card = e.target.closest('.card');
      if (card && !getSelection().toString()) play(card);
    });
    document.querySelector('.web-bar .replay')?.addEventListener('click', () => targets().forEach(play));
  } else {
    document.querySelector('.web-bar .replay')?.remove();
  }

  document.querySelectorAll('.card').forEach((c) => { c.tabIndex = 0; c.addEventListener('keydown', (e) => { if (e.key === 'Enter' && motion) play(c); }); });
  addEventListener('hashchange', () => show(location.hash.slice(1)));
  show(location.hash.slice(1));
})();
