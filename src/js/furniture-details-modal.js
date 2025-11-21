import axios from 'axios';

import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

import { showPageSpinner, hidePageSpinner } from './page-spinner';

axios.defaults.baseURL = 'https://furniture-store-v2.b.goit.study/api';

// спіннер

// помилки
function showToastError(message) {
  iziToast.error({
    message: message,
    position: 'topCenter',
    timeout: 3000,
    backgroundColor: '#EF4040',
    messageColor: 'white',
    close: false,
  });
}

//  Запит зa ID
async function fetchProductDetails(productId) {
  try {
    const response = await axios.get(`/furnitures/${productId}`);
    return response.data;
  } catch (error) {
    console.error(
      `Помилка при отриманні деталей продукту з ID ${productId}:`,
      error
    );
    throw error;
  }
}

// отримую змінні з дому
const modalBackdrop = document.querySelector('.product-modal-backdrop');
const modalContentEl = document.querySelector(
  '.product-modal .modal-main-content'
);
const modalCloseBtn = document.querySelector('.modal-close-btn');
const body = document.body;

// функція рейтингу,на основі бібліотеки
function generateRatingStars(rating) {
  if (rating === undefined || rating === null) {
    return '';
  }

  const roundedRating = Math.round(rating * 2) / 2;

  const integerValue = Math.floor(roundedRating);

  const hasHalfStar = roundedRating - integerValue === 0.5;

  let classList = `rating value-${integerValue}`;
  if (hasHalfStar) {
    classList += ' half';
  }

  return `
        <div class="${classList}">
            <div class="star-container"></div>
        </div>
    `;
}

// маркери кольору(акцент на першому)
function generateColorOptions(colors) {
  const colorOptionsHTML = colors
    .map((hexColor, index) => {
      const colorId = `color-${hexColor.substring(1)}`;
      const isActive = index === 0 ? 'checked' : '';
      const activeClass = index === 0 ? 'is-active' : '';
      return `
            <label class="color-option">
                <input
                  type="radio"
                  name="product-color"
                  value="${hexColor}" 
                  id="${colorId}"                    
                  class="custom-radio-style ${activeClass}" 
                  style="
                    -webkit-appearance:none;
                    appearance:none;
                    width: 32px;
                    height: 32px;
                    background-color: ${hexColor}; 
                    cursor:pointer; 
                    display:inline-block;"
                  data-color-hex=${hexColor}; 
                  ${index === 0 ? 'checked' : ''}                      
                  />
                           
            </label>
        `;
    })
    .join('');

  return `<div class="color-options-container">
            <p class="color-label">Колір</p>
            <form class="color-options">${colorOptionsHTML}</form>
          </div>`;
}

// створення розмітки
function renderModalContent(details) {
  const priceFormatted = details.price.toLocaleString() + ' грн';
  return `
        <div class="product-gallery">
            <img
              src="${details.images[0]}" alt="${details.name} (Основне)" 
              class="main-product-image" 
            />
            <div class="gallery-thumbnails">
                 ${details.images
                   .slice(1)
                   .map(
                     imgUrl =>
                       `<img src="${imgUrl}" alt="${details.name} (Мініатюра)" class="gallery-thumbnail">`
                   )
                   .join('')}
            </div>
        </div>
        
        <div class="product-info">
            <h2 class="model-name">${details.name}</h2> 
            <p class="category-name">${details.category.name}</p> 
            <p class="product-price">
              <span class="price-value">${priceFormatted}</span>
              <span class="price-currency"></span>
            </p>
            <div class="stars-container">${generateRatingStars(details.rate)} 
                  ${generateColorOptions(details.color)} 
            </div>            
            <div class="product-details">
                <p class="description-text">${details.description}</p> 
                <p class="dimensions-text">Розміри: ${details.sizes} см</p> 
            </div>
            
            <button 
                class="button order-btn open-order-modal-btn" 
                type="button"
                data-product-id="${details._id}"      
                data-marker="details_page_order"
                >  
                Перейти до замовлення
            </button>
        </div>
    `;
}

// маркери
function onColorChange(event) {
  if (!event.target.matches('input[name="product-color"]')) return;

  const optionsContainer = event.currentTarget;

  // переключаємо клас 'is-active' з усіх елементів
  optionsContainer
    .querySelectorAll('input[name="product-color"]')
    .forEach(styleEl =>
      styleEl.classList.toggle('is-active', styleEl === event.target)
    );
}

// інформація на основі якої відкрила модалку
async function handleOpenDetailsModal(event) {
  const productId = event.detail.productId;

  try {
    const details = await fetchProductDetails(productId);

    modalContentEl.innerHTML = renderModalContent(details);

    //  слухаю динамічні елементи
    const colorForm = document.querySelector('.product-modal .color-options');
    if (colorForm) {
      colorForm.addEventListener('change', onColorChange);
    }
    document
      .querySelector('.product-modal .open-order-modal-btn')
      .addEventListener('click', onOrderBtnClick); // 123

    // Відкриття модалки
    modalBackdrop.classList.remove('is-hidden');
    body.classList.add('modal-open');
    document.addEventListener('keydown', onEscKeyPress); // Закриття по Esc

    //повідомили, що модалка готова
    document.body.dispatchEvent(
      new CustomEvent('details-modal-opened', { bubbles: true })
    );
  } catch (error) {
    showToastError('Не вдалося відобразити деталі товару.');
  } finally {
    hidePageSpinner();
  }
}

// ф-ція закриття модолки
function closeModal() {
  modalBackdrop.classList.add('is-hidden');
  body.classList.remove('modal-open');
  document.removeEventListener('keydown', onEscKeyPress);
  modalContentEl.innerHTML = '';

  // повідомити про закриття
  document.body.dispatchEvent(
    new CustomEvent('details-modal-closed', { bubbles: true })
  );
}

/** кнопка "Перейти до замовлення" */
function onOrderBtnClick(event) {
  // дані для наступної модалки
  const productId = event.currentTarget.dataset.productId;
  const markerValue = event.currentTarget.dataset.marker;

  const selectedColorInput = document.querySelector(
    '.color-options input:checked'
  );
  const selectedColor = selectedColorInput ? selectedColorInput.value : null;

  if (!productId || !selectedColor) {
    showToastError('Необхідно обрати колір перед замовленням.');
    return;
  }

  closeModal(); // Закриття моєї модалки

  //відкриття наступної модалки
  const orderEvent = new CustomEvent('open-order-modal', {
    bubbles: true,
    detail: {
      productId: productId,
      selectedColor: selectedColor,
      markerValue: markerValue,
    },
  });

  document.body.dispatchEvent(orderEvent);
}

/** Escape  */
function onEscKeyPress(event) {
  if (event.key === 'Escape') {
    closeModal();
  }
}

//  за межами вікна
modalBackdrop.addEventListener('click', event => {
  if (event.target === modalBackdrop) {
    closeModal();
  }
});
modalCloseBtn.addEventListener('click', closeModal); // кнопка "Закрити"

//  Чекаю подію 'open-details-modal'
document.body.addEventListener('open-details-modal', handleOpenDetailsModal);

// Слухачі для приховування спінера
document.body.addEventListener('details-modal-opened', hidePageSpinner);
document.body.addEventListener('details-modal-closed', hidePageSpinner);

function onGlobalDetailsClick(event) {
  const detailsButton = event.target.closest('.details-button');

  // моя кнопка з ID?
  if (!detailsButton || !detailsButton.dataset.id) {
    return;
  }

  event.preventDefault();
  showPageSpinner();

  const productId = detailsButton.dataset.id;

  // викликаю подію щоб відкрити модалку
  const detailsEvent = new CustomEvent('open-details-modal', {
    bubbles: true,
    detail: {
      productId: productId,
    },
  });

  // диспатчимо івент
  document.body.dispatchEvent(detailsEvent);
}

document.body.addEventListener('click', onGlobalDetailsClick);
