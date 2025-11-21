import axios from 'axios';

import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

//отримуємо список категорій:

axios.defaults.baseURL = 'https://furniture-store-v2.b.goit.study/api';

const STORAGE_KEY = 'pickedCategoryId';
const PREVIOUS_PAGE_KEY = 'previous_page';

function showError(error) {
  iziToast.error({
    message: `${error.message ?? String(error)}`,
    position: 'topCenter',
    timeout: 3000,
    backgroundColor: '#EF4040',
    messageColor: 'white',
    close: false,
  });
}

function showInfo(info) {
  iziToast.info({
    message: `${info}`,
    position: 'topCenter',
    timeout: 3000,
    backgroundColor: '#009b18',
    messageColor: 'white',
    close: false,
  });
}

const loader = document.querySelector('.loading');

function showLoader() {
  loader.hidden = false;
}

function hideLoader() {
  loader.hidden = true;
}

localStorage.removeItem(STORAGE_KEY);
localStorage.removeItem(PREVIOUS_PAGE_KEY);

let itemsPage = 1;
let totalItems = 0;
let totalPages = 0;
const limit = 8;
let maxPage = 1;
const screenWidth = window.innerWidth;

const categoriesBoxes = document.querySelectorAll('.category-card');
const furnitureListContainer = document.querySelector('.furniture-list');
const categoryContainer = document.querySelector('.category-container');
const paginationContainer = document.querySelector('.pagination-container');
const loadMoreFurniBtn = document.querySelector('.load-more-button');
const swipeBackLi = paginationContainer.querySelector('.back');
const swipeNextLi = paginationContainer.querySelector('.next');
const backBtn = paginationContainer.querySelector('.pagination-back');
const nextBtn = paginationContainer.querySelector('.pagination-next');

function updateArrows() {
  backBtn.disabled = itemsPage <= 1;
  nextBtn.disabled = itemsPage >= maxPage;
}

async function fetchCategories() {
  try {
    const { data: categories } = await axios('/categories');
    return categories;
  } catch (error) {
    showError(error);
  }
}

fetchCategories();

//промальовуємо назви категорій:

async function renderCategories(categoriesBoxes) {
  const categories = await fetchCategories();

  [...categoriesBoxes].forEach((categoryBox, index) => {
    if (index === 0) {
      return;
    }

    categoryBox.dataset.id = categories[index - 1]._id;
    categoryBox.children[0].textContent = categories[index - 1].name;
  });
}

renderCategories(categoriesBoxes);

// підгружаємо першу партію товарів та пагінацію сторінок:

async function furnitureFirstLoading() {
  showLoader();

  try {
    const { data } = await axios(`/furnitures`, {
      params: {
        page: itemsPage,
        limit,
      },
    });

    totalItems = data.totalItems;
    totalPages = Math.ceil(totalItems / limit);
    maxPage = totalPages;

    furnitureListContainer.innerHTML = renderFurnitureList(data.furnitures);

    // пагінація, залежно від розмірів екрану
    if (screenWidth < 768) {
      paginationContainer.hidden = true;
      loadMoreFurniBtn.hidden = itemsPage >= totalPages;
    } else {
      paginationContainer.hidden = false;
      renderPaginationPagesList(totalPages);
    }

    updateArrows();
  } catch (error) {
    showError(error);
  } finally {
    hideLoader();
  }
}

furnitureFirstLoading();

updateArrows();

//ловимо клік по категорії, грузимо товари з обраної категорії:
categoryContainer.addEventListener('click', onCategoryClick);

async function onCategoryClick(event) {
  event.preventDefault();

  showLoader();

  const pickedCategoryCard = event.target.closest('.category-card');

  if (!categoryContainer.contains(pickedCategoryCard) || !pickedCategoryCard) {
    hideLoader();
    showInfo('Оберіть, будь-ласка, категорію');
    return;
  }

  const pickedCategoryId = pickedCategoryCard.dataset.id ?? null;

  const previousCategoryId = localStorage.getItem(STORAGE_KEY);

  if (pickedCategoryId !== null && pickedCategoryId === previousCategoryId) {
    showError(
      'Ви щойно переглядали цю категорію. Перегляньте, будь-ласка, інші наші товари'
    );
    hideLoader();
    return;
  }

  //плавний скрол з урахуванням висоти хедеру:
  const scrollTarget = document.getElementById('furniture');

  if (scrollTarget) {
    const header = document.querySelector('.header');
    const offset = header?.offsetHeight || 0 + 16; // +16px запас
    const top =
      scrollTarget.getBoundingClientRect().top + window.pageYOffset - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  }

  itemsPage = 1;

  furnitureListContainer.innerHTML = '';

  if (pickedCategoryId === undefined || pickedCategoryId === null) {
    localStorage.removeItem(STORAGE_KEY);
  } else {
    localStorage.setItem(STORAGE_KEY, pickedCategoryId);
  }

  try {
    const { data } = await axios(`/furnitures`, {
      params: {
        page: itemsPage,
        limit,
        category: pickedCategoryId,
      },
    });

    totalItems = data.totalItems;
    totalPages = Math.ceil(totalItems / limit);
    maxPage = totalPages;

    furnitureListContainer.innerHTML = renderFurnitureList(data.furnitures);

    // різна пагінація, залежно від розмірів екрану:
    if (screenWidth < 768) {
      paginationContainer.hidden = true;
      loadMoreFurniBtn.hidden = itemsPage >= totalPages;
    } else {
      paginationContainer.hidden = false;
      renderPaginationPagesList(totalPages);
      updateArrows();
    }
  } catch (error) {
    showError(error);
  } finally {
    hideLoader();
  }
}

function renderFurnitureList(furnitureList) {
  return furnitureList
    .sort((a, b) => a.price - b.price)
    .map(
      furniItem => `
        <li class="furniture-list-item">
            <img class="card-image" src="${furniItem.images[0]}" alt="${
        furniItem.name
      }"/>
            <h3 class="card-title">${furniItem.name}</h3>
            <ul class="card-color-container">
                ${(furniItem.color || [])
                  .map(
                    color => `
                    <li
                    class="card-color-item"
                    style="background-color: ${color};">1
                    </li>
                    `
                  )
                  .join('')}               
            </ul>
            <p class="card-price">${furniItem.price.toLocaleString()} грн</p>
            <button 
                class="details-button button" 
                data-id="${furniItem._id}">Детальніше</button>
        </li>
    `
    )
    .join('');
}

// пагінація гортанням стрілочок:

function renderPaginationPagesList(pagesCount, current = 1) {
  paginationContainer.hidden = true;

  paginationContainer.innerHTML = '';
  paginationContainer.append(swipeBackLi, swipeNextLi);

  const paginationItems = getPaginationItems(pagesCount, current);

  paginationItems.forEach(item => {
    const li = document.createElement('li');
    li.classList.add('page');

    if (item === '...') {
      const span = document.createElement('span');
      span.textContent = '...';
      span.classList.add('pagination-ellipsis');
      li.append(span);
    } else {
      const btn = document.createElement('button');

      btn.classList.add('pagination-item', 'pag-buttons');
      btn.type = 'button';
      btn.textContent = item;
      btn.dataset.page = item;
      if (item === current) btn.classList.add('isActive');

      li.classList.add('page');
      li.append(btn);
    }

    paginationContainer.lastElementChild.insertAdjacentElement(
      'beforebegin',
      li
    );
  });

  paginationContainer.hidden = pagesCount <= 1;
}

// функція, що робить масив сторінок для пагінації:

function getPaginationItems(totalPages, currentPage, delta = 1) {
  // delta - скільки сторінок зліва/справа від поточної показувати
  const pages = [];
  const left = currentPage - delta;
  const right = currentPage + delta;

  let dotsAdded = false;

  for (let i = 1; i <= totalPages; i++) {
    const isEdge = i === 1 || i === totalPages;
    const isNearCurrent = i >= left && i <= right;

    if (isEdge || isNearCurrent) {
      pages.push(i);
      dotsAdded = false; // після цифри знову вставити "..."
    } else if (!dotsAdded) {
      pages.push('...');
      dotsAdded = true; // вставили крапки один раз на цей проміжок
    }
  }

  return pages;
}

// пагінація по натисканню на кнопку:

loadMoreFurniBtn.addEventListener('click', onLoadMoreFfurniBtnClick);

async function onLoadMoreFfurniBtnClick(event) {
  furnitureListContainer.insertAdjacentElement('beforeend', loader);
  showLoader();

  itemsPage++;
  const categoryId = localStorage.getItem(STORAGE_KEY);

  try {
    const { data } = await axios(`/furnitures`, {
      params: {
        page: itemsPage,
        limit,
        category: categoryId,
      },
    });

    totalItems = data.totalItems;
    totalPages = Math.ceil(totalItems / limit);
    maxPage = totalPages;

    itemsPage = Number(data.page);

    if (itemsPage < totalPages) {
      furnitureListContainer.insertAdjacentHTML(
        'beforeend',
        renderFurnitureList(data.furnitures)
      );
      loadMoreFurniBtn.hidden = false;
    } else {
      showInfo('В даній категорії закінчилися товари');
      loadMoreFurniBtn.hidden = true;
    }

    // плавний скролл
    const furniListItem = furnitureListContainer.querySelector(
      '.furniture-list-item'
    );

    if (furniListItem) {
      window.scrollBy({
        left: 0,
        top: furniListItem.getBoundingClientRect().height,
        behavior: 'smooth',
      });
    }

    hideLoader();
  } catch (error) {
    showError(error);
  }
}

//лоадимо при натисканні на кнопки пагінації (вперед/назад)
document
  .querySelector('.pagination-container')
  .addEventListener('click', async event => {
    const pageBtn = event.target.closest('[data-page]');
    const navBtn = event.target.closest('[data-nav]');

    // клік не по пагінації
    if (!pageBtn && !navBtn) return;

    //клік по заблокованій кнопці
    const currentBtn = pageBtn || navBtn;
    if (currentBtn.disabled) return;

    showLoader();
    disablePaginationButtons();

    // клік по номеру сторінки
    if (pageBtn) {
      itemsPage = Number(pageBtn.dataset.page);
    }

    if (navBtn) {
      if (navBtn.dataset.nav === 'minus' && itemsPage > 1) {
        itemsPage--;
      }

      if (navBtn.dataset.nav === 'plus' && itemsPage < maxPage) {
        itemsPage++;
      }
    }

    currentBtn.blur();

    if (!itemsPage || Number.isNaN(itemsPage)) {
      showInfo('Виберіть будь-ласка сторінку для заванатаження товарів');
      enablePaginationButtons();
      hideLoader();
      return;
    }

    const categoryId = localStorage.getItem(STORAGE_KEY);

    try {
      const { data } = await axios('/furnitures', {
        params: {
          page: itemsPage,
          limit,
          category: categoryId,
        },
      });

      furnitureListContainer.innerHTML = renderFurnitureList(data.furnitures);

      // Тільки після успішного запиту оновлюємо пагінацію
      totalItems = data.totalItems;
      totalPages = Math.ceil(totalItems / limit);
      maxPage = totalPages;

      renderPaginationPagesList(totalPages, itemsPage);
      updateArrows();

      //показуємо/ховаємо кнопки гортання сторінок пагінації
      const currentBtn = event.target;
      if (!currentBtn || currentBtn.disabled) return;

      // плавний скролл до початку контейнера з меблями
      if (furnitureListContainer) {
        furnitureListContainer.scrollIntoView({
          block: 'start', // до початку блока піднімаємось
          behavior: 'smooth',
        });
      }
    } catch (error) {
      showError(error);
    } finally {
      enablePaginationButtons();
      hideLoader();
    }
  });

function disablePaginationButtons() {
  paginationContainer
    .querySelectorAll('.pag-buttons')
    .forEach(button => (button.disabled = true));
}

function enablePaginationButtons() {
  paginationContainer
    .querySelectorAll('.pag-buttons')
    .forEach(button => (button.disabled = false));
  updateArrows();
}
