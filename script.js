// Reveal-on-scroll for major content blocks
const io = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in');
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

const candidates = document.querySelectorAll(
  '.hero-text, .hero-card, ' +
  '.section-head, ' +
  '.about-prose, .fact, ' +
  '.service, ' +
  '.workcard, .work-footer, ' +
  '.step, ' +
  '.contact > *'
);
candidates.forEach((el, i) => {
  el.classList.add('reveal');
  el.style.transitionDelay = `${Math.min(i * 50, 240)}ms`;
  io.observe(el);
});

// Top bar hairline rule on scroll
const topbar = document.querySelector('.topbar');
const onScroll = () => topbar.classList.toggle('scrolled', window.scrollY > 32);
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// Subtle hover lift on the hero card
const card = document.querySelector('.hero-card');
if (card) {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `rotate(${0.6 - x * 1.5}deg) translateY(${y * -4}px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = 'rotate(0.6deg)';
  });
}
