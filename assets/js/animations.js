/* Simple scroll reveal animations using IntersectionObserver */
(function(){
  if (typeof window === 'undefined') return;
  function ready(fn){
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }
  ready(function(){
    const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return; // respect user's motion preferences

    const targets = document.querySelectorAll([
      '.section h1',
      '.section h2',
      '.section h3',
      '.section p',
      '.section ul',
      '.card',
      '.media-cover',
      '.cert-grid .cert',
      '.projects .project',
      '.contact-grid > div'
    ].join(', '));

    targets.forEach(el => el.classList.add('will-reveal'));

    if (!('IntersectionObserver' in window)){
      // Fallback: reveal all immediately
      targets.forEach(el => el.classList.add('in-view'));
      return;
    }

    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting){
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      rootMargin: '0px 0px -10% 0px',
      threshold: 0.12
    });

    targets.forEach(el => io.observe(el));

    // Certificates carousel (one at a time)
    const slider = document.querySelector('.cert-slider');
    if (slider){
      const track = slider.querySelector('.cert-track');
      const slides = Array.from(slider.querySelectorAll('.cert-slide'));
      const prev = slider.querySelector('.cert-nav.prev');
      const next = slider.querySelector('.cert-nav.next');
      let index = 0;

      function update(){
        const x = -index * 100;
        track.style.transform = `translateX(${x}%)`;
      }
      function go(delta){
        index = (index + delta + slides.length) % slides.length;
        update();
      }
      prev && prev.addEventListener('click', () => go(-1));
      next && next.addEventListener('click', () => go(1));

      // keyboard arrows
      slider.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') go(-1);
        if (e.key === 'ArrowRight') go(1);
      });
      slider.tabIndex = 0;

      // touch swipe
      let startX = 0; let dx = 0; let dragging = false;
      slider.addEventListener('touchstart', (e)=>{ dragging = true; startX = e.touches[0].clientX; });
      slider.addEventListener('touchmove', (e)=>{ if(!dragging) return; dx = e.touches[0].clientX - startX; });
      slider.addEventListener('touchend', ()=>{ if(!dragging) return; if (dx > 50) go(-1); else if (dx < -50) go(1); dragging = false; dx = 0; });

      update();
    }
  });
})();
