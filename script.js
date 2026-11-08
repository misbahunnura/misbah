const reduce = matchMedia('(prefers-reduced-motion:reduce)').matches;
const fine = matchMedia('(hover:hover) and (pointer:fine)').matches;

/* hitung naik */
function count(el, dur) {
  const to = +el.dataset.to, pct = el.textContent.includes('%');
  if (reduce) return;
  const t0 = performance.now();
  (function step(t) {
    const k = Math.min(1, (t - t0) / dur), v = Math.round(to * (1 - Math.pow(1 - k, 3)));
    el.textContent = v + (pct ? '%' : '');
    if (k < 1) requestAnimationFrame(step);
  })(t0);
}
setTimeout(() => document.querySelectorAll('.stats b').forEach((b) => count(b, 1200)), 1700);

/* ring skill */
const skills = document.querySelectorAll('.skill');
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver((es) => {
    es.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('on'); count(e.target.querySelector('b'), 1600); io.unobserve(e.target); }
    });
  }, { threshold: 0.4 });
  skills.forEach((s) => io.observe(s));
} else skills.forEach((s) => s.classList.add('on'));

/* pratinjau proyek */
function fitShots() {
  document.querySelectorAll('.pshot').forEach((s) => {
    const f = s.querySelector('iframe');
    if (!f) return;
    const k = s.clientWidth / 1280;
    f.style.transform = 'scale(' + k + ')';
    f.style.height = (s.clientHeight / k) + 'px';
  });
}
addEventListener('resize', fitShots);
addEventListener('load', fitShots);
fitShots();

/* muncul saat scroll */
const rvs = document.querySelectorAll('.rv');
if ('IntersectionObserver' in window) {
  const ro = new IntersectionObserver((es) => {
    es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); ro.unobserve(e.target); } });
  }, { threshold: 0.12 });
  rvs.forEach((el) => ro.observe(el));
} else rvs.forEach((el) => el.classList.add('in'));

/* menu aktif + progress */
const navLinks = document.querySelectorAll('.links a');
const secs = [...navLinks].map((a) => document.querySelector(a.getAttribute('href')));
const bar = document.querySelector('.progress');
function onScroll() {
  const max = document.documentElement.scrollHeight - innerHeight;
  bar.style.setProperty('--p', max > 0 ? scrollY / max : 0);
  let cur = -1;
  secs.forEach((s, i) => { if (s && s.getBoundingClientRect().top < innerHeight * 0.45) cur = i; });
  navLinks.forEach((a, i) => a.classList.toggle('active', i === cur));
}
addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* teks role mengetik */
const roleEl = document.getElementById('role');
if (roleEl && !reduce) {
  const words = ['Mahasiswa Teknik Informatika', 'Pengembang Web', 'Semester 5'];
  let w = 0, c = words[0].length, del = false;
  (function tick() {
    const full = words[w];
    c += del ? -1 : 1;
    roleEl.textContent = full.slice(0, c);
    let d = del ? 35 : 70;
    if (!del && c === full.length) { del = true; d = 2200; }
    else if (del && c === 0) { del = false; w = (w + 1) % words.length; d = 350; }
    setTimeout(tick, d);
  })();
}

/* carousel proyek: titik penanda (HP) */
const proj = document.getElementById('projects'), dots = document.getElementById('dots');
if (proj && dots) {
  const cards = [...proj.children];
  cards.forEach(() => dots.appendChild(document.createElement('i')));
  const setDot = () => {
    const mid = proj.scrollLeft + proj.clientWidth / 2;
    let best = 0, bd = 1e9;
    cards.forEach((c, i) => { const d = Math.abs(c.offsetLeft + c.offsetWidth / 2 - mid); if (d < bd) { bd = d; best = i; } });
    [...dots.children].forEach((d, i) => d.classList.toggle('on', i === best));
  };
  proj.addEventListener('scroll', setDot, { passive: true });
  addEventListener('resize', setDot);
  setDot();
}

/* lightbox sertifikat */
const lb = document.getElementById('lightbox'), lbImg = lb.querySelector('img');
document.querySelectorAll('[data-zoom]').forEach((box) => {
  box.addEventListener('click', () => {
    const im = box.querySelector('img');
    if (!im || im.style.display === 'none' || !im.naturalWidth) return;
    lbImg.src = im.src; lbImg.alt = im.alt; lb.showModal();
  });
});
lb.addEventListener('click', () => lb.close());

/* efek khusus desktop */
if (fine) {
  const glow = document.querySelector('.glow'), cur = document.querySelector('.cursor');
  const photo = document.querySelector('.hero .photo');
  let mx = 0, my = 0, cx = 0, cy = 0;
  addEventListener('mousemove', (e) => {
    mx = e.clientX; my = e.clientY;
    cur.style.opacity = 1;
    glow.style.setProperty('--gx', mx + 'px');
    glow.style.setProperty('--gy', my + 'px');
    if (photo) photo.style.transform = 'translate(' + ((mx / innerWidth - .5) * -14) + 'px,' + ((my / innerHeight - .5) * -14) + 'px)';
  });
  (function loop() {
    cx += (mx - cx) * 0.18; cy += (my - cy) * 0.18;
    cur.style.transform = 'translate(' + cx + 'px,' + cy + 'px)';
    requestAnimationFrame(loop);
  })();
  document.querySelectorAll('a,[data-zoom],button').forEach((el) => {
    el.addEventListener('mouseenter', () => cur.classList.add('big'));
    el.addEventListener('mouseleave', () => cur.classList.remove('big'));
  });
  document.querySelectorAll('.mag').forEach((el) => {
    el.addEventListener('mousemove', (e) => {
      const r = el.getBoundingClientRect();
      el.style.transform = 'translate(' + ((e.clientX - r.left - r.width / 2) * .22) + 'px,' + ((e.clientY - r.top - r.height / 2) * .3) + 'px)';
    });
    el.addEventListener('mouseleave', () => { el.style.transform = ''; });
  });
  const ktm = document.getElementById('ktm');
  if (ktm) {
    ktm.addEventListener('mousemove', (e) => {
      const r = ktm.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
      ktm.style.setProperty('--ry', ((x - .5) * 10) + 'deg');
      ktm.style.setProperty('--rx', ((.5 - y) * 8) + 'deg');
      ktm.style.setProperty('--mx', (x * 100) + '%');
    });
    ktm.addEventListener('mouseleave', () => { ktm.style.setProperty('--rx', '0deg'); ktm.style.setProperty('--ry', '0deg'); });
  }
}
