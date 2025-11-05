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
  });
})();
