/**
 * Watches `.fade-up` and `.mark` elements. When one scrolls into view it gets a
 * class (`is-in` / `drawn`), the effect plays once, and we stop watching it.
 */
function setup() {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const targets = document.querySelectorAll<HTMLElement>('.fade-up, .mark');

  if (reduced || !('IntersectionObserver' in window)) {
    targets.forEach((el) => el.classList.add('is-in', 'drawn'));
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        const el = e.target as HTMLElement;
        const needed = el.classList.contains('mark') ? 0.6 : 0;
        if (e.intersectionRatio < needed) continue;
        el.classList.add(el.classList.contains('mark') ? 'drawn' : 'is-in');
        io.unobserve(el);
      }
    },
    { threshold: [0, 0.6], rootMargin: '0px 0px -5% 0px' },
  );

  targets.forEach((el) => io.observe(el));
}

setup();
document.addEventListener('astro:after-swap', setup);
