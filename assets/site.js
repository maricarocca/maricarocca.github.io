/* Optional enhancements only: language links also work without JavaScript. */
'use strict';
(function () {
  const isEnglish = document.documentElement.lang === 'en';
  document.querySelectorAll('[data-language]').forEach(function (link) {
    link.addEventListener('click', function () {
      const url = new URL(link.href);
      if (window.location.hash) url.hash = window.location.hash;
      link.href = url.href;
    });
  });

  document.querySelectorAll('[data-carousel]').forEach(function (card) {
    const track = card.querySelector('.book-track');
    const slides = Array.from(card.querySelectorAll('.book-slide'));
    const captions = Array.from(card.querySelectorAll('.book-caption'));
    const button = card.querySelector('.edition-button');
    const status = card.querySelector('[role="status"]');
    if (!track || !button || slides.length < 2) return;
    let index = 0;
    function update(announce) {
      track.style.transform = 'translateX(-' + (index * 100) + '%)';
      slides.forEach(function (slide, i) {
        const active = i === index;
        slide.tabIndex = active ? 0 : -1;
        slide.setAttribute('aria-hidden', String(!active));
        slide.inert = !active;
      });
      captions.forEach(function (caption, i) { caption.hidden = i !== index; });
      button.setAttribute('aria-pressed', String(index > 0));
      const next = (index + 1) % slides.length;
      button.setAttribute('aria-label', (isEnglish ? 'Show ' : 'Mostra ') + slides[next].dataset.title);
      if (announce && status) status.textContent = slides[index].dataset.title;
    }
    button.hidden = false;
    button.addEventListener('click', function () {
      index = (index + 1) % slides.length;
      update(true);
    });
    card.addEventListener('keydown', function (event) {
      if (event.target !== button) return;
      if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
        event.preventDefault();
        index = (index + (event.key === 'ArrowRight' ? 1 : -1) + slides.length) % slides.length;
        update(true);
      }
    });
    update(false);
  });
})();
