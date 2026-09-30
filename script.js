const skills = document.querySelectorAll('.skill');
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('on'); io.unobserve(e.target); }
    });
  }, { threshold: 0.4 });
  skills.forEach((s) => io.observe(s));
} else {
  skills.forEach((s) => s.classList.add('on'));
}

function fitShots() {
  document.querySelectorAll('.pshot').forEach((s) => {
    const f = s.querySelector('iframe');
    const k = s.clientWidth / 1280;
    f.style.transform = 'scale(' + k + ')';
    f.style.height = (s.clientHeight / k) + 'px';
  });
}
window.addEventListener('resize', fitShots);
window.addEventListener('load', fitShots);
fitShots();

const ktm = document.getElementById('ktm');
if (ktm && matchMedia('(hover:hover)').matches) {
  ktm.addEventListener('mousemove', (e) => {
    const r = ktm.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
    ktm.style.setProperty('--ry', ((x - .5) * 10) + 'deg');
    ktm.style.setProperty('--rx', ((.5 - y) * 8) + 'deg');
    ktm.style.setProperty('--mx', (x * 100) + '%');
  });
  ktm.addEventListener('mouseleave', () => {
    ktm.style.setProperty('--rx', '0deg');
    ktm.style.setProperty('--ry', '0deg');
  });
}
