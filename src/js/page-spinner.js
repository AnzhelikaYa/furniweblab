export function showPageSpinner() {
  if (document.querySelector('#page-spinner')) {
    return;
  }

  // Заблурений оверлей
  const overlay = document.createElement('div');
  overlay.id = 'page-spinner';
  overlay.setAttribute('role', 'status');
  overlay.setAttribute('aria-live', 'polite');
  overlay.innerHTML = `
      <div class="spinner" aria-label="Завантаження…">
        <button class="loadingBtn" type="button">
            <span class="loader" id="btnSpinner"></span>
        </button>
      </div>
    `;

  document.body.appendChild(overlay);

  document.body.classList.add('no-scroll');
}

export function hidePageSpinner() {
  const pageSpinnerOverlay = document.getElementById('page-spinner');
  if (pageSpinnerOverlay) {
    pageSpinnerOverlay.remove();

    document.body.classList.remove('no-scroll');
  }
}
