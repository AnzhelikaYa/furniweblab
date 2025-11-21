import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import { showPageSpinner, hidePageSpinner } from './page-spinner.js';

const modalLoader = document.querySelector('#order-modal .loading');

const modal = document.getElementById('order-modal');
const closeModalBtn = document.getElementById('closeModalBtn');
const form = document.getElementById('callback-form');
let productId = null;
let color = null;

function showModalLoader() {
  if (modalLoader) modalLoader.style.display = 'flex';
}

function hideModalLoader() {
  if (modalLoader) modalLoader.style.display = 'none';
}

document.body.addEventListener('open-order-modal', e => {
  const { productId: id, selectedColor } = e.detail;

  productId = id;
  color = selectedColor;

  showPageSpinner();

  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';

  setTimeout(() => {
    hidePageSpinner();
    document.body.style.overflow = 'hidden';
  }, 200);
});

function closeModal() {
  modal.style.display = 'none';
  document.body.style.overflow = '';
  form.reset();
  clearErrors();
}

closeModalBtn.addEventListener('click', closeModal);
modal.addEventListener('click', e => {
  if (e.target === modal) closeModal();
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && modal.style.display === 'flex') closeModal();
});

function showInputError(input, message) {
  input.style.border = '1px solid #6b0609';

  let errorEl = input.parentNode.querySelector('.input-error-text');
  if (!errorEl) {
    errorEl = document.createElement('p');
    errorEl.classList.add('input-error-text');
    input.parentNode.appendChild(errorEl);
  }
  errorEl.textContent = message;
}

function clearErrors() {
  document.querySelectorAll('.input-error-text').forEach(e => e.remove());
  form.querySelectorAll('input, textarea').forEach(el => {
    el.style.border = '1px solid rgba(8, 12, 9, 0.15)';
  });
}

form.addEventListener('submit', async e => {
  e.preventDefault();
  clearErrors();

  const name = form.name.value.trim();
  let phone = form.phone.value.trim();
  const comment = form.comment.value.trim();

  let hasError = false;

  if (!name) {
    showInputError(form.name, 'Error Text');
    hasError = true;
  }

  if (!phone || !/^(\d{10}|\d{12})$/.test(phone)) {
    showInputError(form.phone, 'Error Text');
    iziToast.error({
      title: 'Помилка',
      message: 'Номер має містити лише 10 або 12 цифр.',
      position: 'topRight',
      timeout: 4000,
      color: '#EF4040',
      messageColor: 'white',
    });
    hasError = true;
  }

  if (hasError) return;

  if (phone.length === 10 && phone.startsWith('0')) {
    phone = '38' + phone;
  }

  const orderData = {
    name,
    phone,
    modelId: productId,
    color,
    comment:
      comment || "Чекатиму на зворотний зв'язок для уточнення деталей. Дякую!",
  };

  try {
    showModalLoader();
    const response = await fetch(
      'https://furniture-store-v2.b.goit.study/api/orders',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      }
    );

    const result = await response.json();
    console.log('Відповідь від сервера:', result);

    if (!response.ok) {
      iziToast.error({
        title: 'Помилка!',
        message: result.message || 'Щось пішло не так. Перевірте дані.',
        position: 'topRight',
        color: '#EF4040',
        messageColor: 'white',
      });
      return;
    }

    iziToast.success({
      title: 'Успіх!',
      message: `Замовлення №${result.orderNum} успішно створено!`,
      position: 'topRight',
      color: '#009b18',
      messageColor: 'white',
    });

    closeModal();
  } catch (err) {
    console.error('Помилка при запиті:', err);
    iziToast.error({
      title: 'Помилка!',
      message: 'Не вдалося відправити замовлення. Спробуйте пізніше.',
      position: 'topRight',
      color: '#EF4040',
      messageColor: 'white',
    });
  } finally {
    hideModalLoader();
  }
});
