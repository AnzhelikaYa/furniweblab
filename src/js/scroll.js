document.addEventListener('DOMContentLoaded', () => {
  const scrollLinks = document.querySelectorAll('.js-scroll');

  scrollLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href && href.startsWith('#')) {
      link.addEventListener('click', e => {
        e.preventDefault();

        const targetId = href;
        const targetElement = document.querySelector(targetId);

        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          });
        }
        link.blur();
      });
    }
  });
});
