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

const alertBox = document.getElementById("site-alert");
const closeAlert = document.getElementById("close-alert");

if (alertBox && closeAlert) {
  closeAlert.addEventListener("click", () => {
    alertBox.style.display = "none";
  });
}
document.addEventListener("DOMContentLoaded", () => {
  const ratings = {
    5: 8,
    4: 0,
    3: 0,
    2: 0,
    1: 0
  };

  const ratingScore = document.getElementById("rating-score");
  const ratingCount = document.getElementById("rating-count");
  const ratingStars = document.getElementById("rating-stars");

  const stars5 = document.getElementById("stars-5");
  const stars4 = document.getElementById("stars-4");
  const stars3 = document.getElementById("stars-3");
  const stars2 = document.getElementById("stars-2");
  const stars1 = document.getElementById("stars-1");

  if (
    !ratingScore ||
    !ratingCount ||
    !ratingStars ||
    !stars5 ||
    !stars4 ||
    !stars3 ||
    !stars2 ||
    !stars1
  ) {
    return;
  }

  stars5.textContent = ratings[5];
  stars4.textContent = ratings[4];
  stars3.textContent = ratings[3];
  stars2.textContent = ratings[2];
  stars1.textContent = ratings[1];

  let totalReviews = 0;
  let totalScore = 0;

  for (const star in ratings) {
    const count = Number(ratings[star]);
    totalReviews += count;
    totalScore += Number(star) * count;
  }

  if (totalReviews === 0) {
    ratingScore.textContent = "0.0";
    ratingCount.textContent = "0";
    ratingStars.textContent = "☆☆☆☆☆";
    return;
  }

  const average = (totalScore / totalReviews).toFixed(1);

  ratingScore.textContent = average;
  ratingCount.textContent = totalReviews;

  const rounded = Math.round(Number(average));
  ratingStars.textContent = "★".repeat(rounded) + "☆".repeat(5 - rounded);
});
document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const menuToggle = document.querySelector(".menu-toggle");
  const mobileMenu = document.getElementById("mobile-menu");
  const overlay = document.getElementById("sidebar-overlay");
  const closeBtn = document.querySelector(".sidebar-close");
  const mobileLinks = document.querySelectorAll(".mobile-nav-link");

  if (!menuToggle || !mobileMenu || !overlay || !closeBtn) return;

  function openMenu() {
    body.classList.add("menu-open");
    menuToggle.setAttribute("aria-expanded", "true");
  }

  function closeMenu() {
    body.classList.remove("menu-open");
    menuToggle.setAttribute("aria-expanded", "false");
  }

  function toggleMenu() {
    if (body.classList.contains("menu-open")) {
      closeMenu();
    } else {
      openMenu();
    }
  }

  menuToggle.addEventListener("click", toggleMenu);
  closeBtn.addEventListener("click", closeMenu);
  overlay.addEventListener("click", closeMenu);

  mobileLinks.forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && body.classList.contains("menu-open")) {
      closeMenu();
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 900 && body.classList.contains("menu-open")) {
      closeMenu();
    }
  });
});