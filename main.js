(() => {
  const btn = document.getElementById('read-more-btn');
  const shortText = document.getElementById('short-text');
  const full = document.getElementById('full-text');

  if (!btn || !shortText || !full) return;

  btn.addEventListener('click', () => {
    const expanded = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', String(!expanded));

    if (!expanded) {
      full.hidden = false;
      shortText.hidden = true;
      btn.textContent = 'Zwiń';
      // delikatne przesunięcie focusu dla klawiatury
      full.focus?.();
    } else {
      full.hidden = true;
      shortText.hidden = false;
      btn.textContent = 'Czytaj więcej';
      btn.focus();
    }
  });
})();