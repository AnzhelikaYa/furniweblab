// ==== Mobile Navbar Script ====

const refs = {
  menuButton: document.querySelector('[data-mobile-navbar-toggle]'),
  mobileNavbar: document.querySelector('[data-mobile-navbar]'),
  overlay: document.querySelector('[data-mobile-navbar-overlay]'),
  body: document.body,
};

// Відкрити / закрити меню
refs.menuButton.addEventListener('click', toggleMenu);

// Закриття при кліку по overlay
refs.overlay.addEventListener('click', closeMenu);

// Закриття при натисканні Escape
window.addEventListener('keydown', e => {
  if (e.key === 'Escape' && !refs.mobileNavbar.classList.contains('is-hidden')) {
    closeMenu();
  }
});

// Закриття після кліку на пункт меню
refs.mobileNavbar.querySelectorAll('.navbar-nav-link').forEach(link => {
  link.addEventListener('click', closeMenu);
});

// === Функції ===
function toggleMenu() {
  const isOpen = !refs.mobileNavbar.classList.contains('is-hidden');

  if (isOpen) {
    closeMenu();
  } else {
    openMenu();
  }
}

function openMenu() {
  refs.mobileNavbar.classList.remove('is-hidden');
  refs.overlay.classList.remove('is-hidden');
  refs.menuButton.classList.add('is-active');
  refs.body.classList.add('no-scroll');
}

function closeMenu() {
  refs.mobileNavbar.classList.add('is-hidden');
  refs.overlay.classList.add('is-hidden');
  refs.menuButton.classList.remove('is-active');
  refs.body.classList.remove('no-scroll');
}
