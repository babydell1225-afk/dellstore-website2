// ORBIT Mobile — shared interactions

document.addEventListener('DOMContentLoaded', () => {
  // Mobile nav toggle
  const toggle = document.querySelector('.nav-toggle');
  const panel = document.querySelector('.mobile-panel');
  if (toggle && panel) {
    toggle.addEventListener('click', () => {
      const isOpen = panel.classList.toggle('open');
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
    panel.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => panel.classList.remove('open'));
    });
  }

  // Product filter (Products page)
  const chips = document.querySelectorAll('.chip[data-filter]');
  const products = document.querySelectorAll('[data-category]');
  if (chips.length && products.length) {
    chips.forEach(chip => {
      chip.addEventListener('click', () => {
        chips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        const filter = chip.getAttribute('data-filter');
        products.forEach(card => {
          const match = filter === 'all' || card.getAttribute('data-category') === filter;
          card.style.display = match ? '' : 'none';
        });
      });
    });
  }

  // Contact form: friendly inline confirmation (no backend)
  const form = document.querySelector('#contact-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      const original = btn.textContent;
      btn.textContent = 'Terkirim ✓';
      btn.disabled = true;
      form.reset();
      setTimeout(() => { btn.textContent = original; btn.disabled = false; }, 2600);
    });
  }
});
