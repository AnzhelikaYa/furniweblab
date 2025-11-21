import axios from 'axios';
import Swiper from 'swiper/bundle';
import 'swiper/swiper-bundle.css';

const spriteUrl = new URL('../img/sprite.svg', import.meta.url).href;
const feedbacksList = document.querySelector('.feedbacks-list');

feedbacksList.innerHTML = `
  <div class="swiper">
    <div class="swiper-wrapper"></div>

    <div class="swiper-controls">
      <div class="swiper-pagination"></div>
  
      <div class="swiper-nav-btn">
        <button class="general-btn custom-prev"><svg class="" width="14" height="14">
        <use href="${spriteUrl}#icon-arrow-left"></use>
        </svg></button>
        <button class="general-btn custom-next"><svg class="" width="14" height="14">
        <use href="${spriteUrl}#icon-arrow-right"></use>
        </svg></button>
      </div>
    </div>

  </div>
`;

const wrapper = document.querySelector('.swiper .swiper-wrapper');


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

export async function getFeedbacks() {
  try {
    const feedbacks = await axios(
      'https://furniture-store-v2.b.goit.study/api/feedbacks?limit=10&page=1'
    );

    return feedbacks.data;
  } catch (error) {
    console.log(error);
    return [];
  }
}

getFeedbacks().then(data => {
  data.feedbacks.forEach(feedback => {
    const slide = `
      <div class="swiper-slide">
        <div class="feedback-card">
          ${generateRatingStars(feedback.rate)}
          <p class="swiper-text">“${feedback.descr}”</p>
          <p class="swiper-text-name">${feedback.name}</p>
        </div>
      </div>
    `;
    wrapper.insertAdjacentHTML('beforeend', slide);
  });
 
  const swiper = new Swiper('.swiper', {
    loop: false,
    slidesPerView: 1,
    spaceBetween: 24,
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
      type: 'bullets',
    },
    navigation: {
      prevEl: '.custom-prev',
      nextEl: '.custom-next',
    },
    breakpoints: {
      768: {
      slidesPerView: 2, 
      spaceBetween: 24, 
    },
      1440: {
        slidesPerView: 3, 
      spaceBetween: 24
      }
  },
  });
})
.catch(error => {
  console.error('Помилка при ініціалізації слайдера відгуків:', error);
  feedbacksList.innerHTML = `<p style="color: red;">
      Неможливо завантажити відгуки. Будь ласка, спробуйте оновити сторінку.
    </p>`;
})
