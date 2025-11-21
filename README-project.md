Меблерія — фронтенд Огляд

Односторінковий сайт-магазин меблів із каталогом, карткою товару (модалка з
галереєю), формою замовлення, адаптивною навігацією та спіннером завантаження.

Функціонал

Категорії та список товарів (дані з API). Модалка деталей товару: велике фото +
мініатюри, рейтинг, кольори, ціна, кнопка “Перейти до замовлення”. Форма
замовлення з передачею вибраного кольору та ID товару. Глобальний спіннер зі
знефокусом (blur) під час завантажень. Адаптивний хедер із бургер-меню
(off-canvas). Повідомлення про помилки через iziToast.

Технології

Vite, Vanilla JS (ES Modules) Axios (HTTP), iziToast (нотіфікації), accordion-js
(приховування/показ елементів), css-star-rating (оформлення зірочок відгуків та
рейтингу товарів), HTML/CSS (Grid/Flex, media queries)

Структура проєкту (скорочено) src/ css/ # стилі компонентів/сторінок js/
page-spinner.js # показ/приховування повноекранного спінера furniture-list.js#
рендер каталогу, фільтри product-modal.js # відкриття/закриття модалки, галерея,
кольори order-modal.js # оформлення замовлення index.html

API

Базова адреса: https://furniture-store-v2.b.goit.study/api

Основні ендпоїнти, що використовуються:

GET /categories GET /furnitures?category=...&page=... GET /furnitures/:id POST
/orders

У Vite можна винести у .env:

VITE_API_BASE_URL=https://furniture-store-v2.b.goit.study/api

Запуск npm i npm run dev # локальний сервер Vite npm run build # продакшн-збірка
npm run preview # перегляд зібраної версії

Ключові події/контракти між модулями

open-details-modal — ініціація відкриття модалки з detail: { productId }
details-modal-opened — модалка з деталями повністю відрендерена (ховаємо спінер)
details-modal-closed — модалку закрито (резервне приховування спінера)
open-order-modal — перехід до модалки замовлення з detail: { productId,
selectedColor, markerValue }

Повноекранний спіннер (коротко)

Показ: showPageSpinner() Приховування: hidePageSpinner() Стилі: #page-spinner {
position: fixed; inset: 0; display: grid; place-items: center; backdrop-filter:
blur(6px); }

Доступність: aria-label для інтерактивних елементів і кнопок. Закриття модалок
клавішею Esc. Фокус-пастка у модалках (за наявності).

Контраст і стани :hover/:focus.

Обробка помилок: Помилки мережі/таймаутів — через iziToast.error. Захист рендера
від undefined/null даних (перевірки перед forEach, доступ до масивів/полів).

Респонс:

Точки: 320–375 (mobile), 768 (tablet), 900+ (tablet), 1440+ (desktop).

Галерея на flex-box та grid, без жорстких px-висот (використовується
aspect-ratio + object-fit)
