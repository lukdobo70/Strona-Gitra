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
    5: 9,
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

document.addEventListener("DOMContentLoaded", function () {
  const body = document.body;
  const openBtn = document.querySelector(".nav-toggle");
  const closeBtn = document.querySelector(".mobile-nav-close");
  const overlay = document.querySelector(".mobile-nav-overlay");
  const mobileLinks = document.querySelectorAll(".mobile-nav a");

  if (!openBtn || !closeBtn || !overlay) return;

  function openMenu() {
    body.classList.add("mobile-nav-open");
    openBtn.setAttribute("aria-expanded", "true");
  }

  function closeMenu() {
    body.classList.remove("mobile-nav-open");
    openBtn.setAttribute("aria-expanded", "false");
  }

  openBtn.addEventListener("click", openMenu);
  closeBtn.addEventListener("click", closeMenu);
  overlay.addEventListener("click", closeMenu);

  mobileLinks.forEach(link => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      closeMenu();
    }
  });
});