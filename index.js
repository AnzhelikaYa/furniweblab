import{a as m,i as b,A as ee,S as te}from"./assets/vendor-DY_idrNt.js";(function(){const o=document.createElement("link").relList;if(o&&o.supports&&o.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))s(r);new MutationObserver(r=>{for(const n of r)if(n.type==="childList")for(const i of n.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&s(i)}).observe(document,{childList:!0,subtree:!0});function t(r){const n={};return r.integrity&&(n.integrity=r.integrity),r.referrerPolicy&&(n.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?n.credentials="include":r.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function s(r){if(r.ep)return;r.ep=!0;const n=t(r);fetch(r.href,n)}})();const u={menuButton:document.querySelector("[data-mobile-navbar-toggle]"),mobileNavbar:document.querySelector("[data-mobile-navbar]"),overlay:document.querySelector("[data-mobile-navbar-overlay]"),body:document.body};u.menuButton.addEventListener("click",oe);u.overlay.addEventListener("click",q);window.addEventListener("keydown",e=>{e.key==="Escape"&&!u.mobileNavbar.classList.contains("is-hidden")&&q()});u.mobileNavbar.querySelectorAll(".navbar-nav-link").forEach(e=>{e.addEventListener("click",q)});function oe(){!u.mobileNavbar.classList.contains("is-hidden")?q():ne()}function ne(){u.mobileNavbar.classList.remove("is-hidden"),u.overlay.classList.remove("is-hidden"),u.menuButton.classList.add("is-active"),u.body.classList.add("no-scroll")}function q(){u.mobileNavbar.classList.add("is-hidden"),u.overlay.classList.add("is-hidden"),u.menuButton.classList.remove("is-active"),u.body.classList.remove("no-scroll")}m.defaults.baseURL="https://furniture-store-v2.b.goit.study/api";const v="pickedCategoryId",re="previous_page";function L(e){b.error({message:`${e.message??String(e)}`,position:"topCenter",timeout:3e3,backgroundColor:"#EF4040",messageColor:"white",close:!1})}function T(e){b.info({message:`${e}`,position:"topCenter",timeout:3e3,backgroundColor:"#009b18",messageColor:"white",close:!1})}const O=document.querySelector(".loading");function I(){O.hidden=!1}function h(){O.hidden=!0}localStorage.removeItem(v);localStorage.removeItem(re);let a=1,g=0,l=0;const y=8;let E=1;const j=window.innerWidth,se=document.querySelectorAll(".category-card"),p=document.querySelector(".furniture-list"),D=document.querySelector(".category-container"),c=document.querySelector(".pagination-container"),w=document.querySelector(".load-more-button"),ae=c.querySelector(".back"),ie=c.querySelector(".next"),ce=c.querySelector(".pagination-back"),le=c.querySelector(".pagination-next");function k(){ce.disabled=a<=1,le.disabled=a>=E}async function V(){try{const{data:e}=await m("/categories");return e}catch(e){L(e)}}V();async function de(e){const o=await V();[...e].forEach((t,s)=>{s!==0&&(t.dataset.id=o[s-1]._id,t.children[0].textContent=o[s-1].name)})}de(se);async function ue(){I();try{const{data:e}=await m("/furnitures",{params:{page:a,limit:y}});g=e.totalItems,l=Math.ceil(g/y),E=l,p.innerHTML=M(e.furnitures),j<768?(c.hidden=!0,w.hidden=a>=l):(c.hidden=!1,N(l)),k()}catch(e){L(e)}finally{h()}}ue();k();D.addEventListener("click",pe);async function pe(e){e.preventDefault(),I();const o=e.target.closest(".category-card");if(!D.contains(o)||!o){h(),T("Оберіть, будь-ласка, категорію");return}const t=o.dataset.id??null,s=localStorage.getItem(v);if(t!==null&&t===s){L("Ви щойно переглядали цю категорію. Перегляньте, будь-ласка, інші наші товари"),h();return}const r=document.getElementById("furniture");if(r){const n=document.querySelector(".header"),i=(n==null?void 0:n.offsetHeight)||16,d=r.getBoundingClientRect().top+window.pageYOffset-i;window.scrollTo({top:d,behavior:"smooth"})}a=1,p.innerHTML="",t==null?localStorage.removeItem(v):localStorage.setItem(v,t);try{const{data:n}=await m("/furnitures",{params:{page:a,limit:y,category:t}});g=n.totalItems,l=Math.ceil(g/y),E=l,p.innerHTML=M(n.furnitures),j<768?(c.hidden=!0,w.hidden=a>=l):(c.hidden=!1,N(l),k())}catch(n){L(n)}finally{h()}}function M(e){return e.sort((o,t)=>o.price-t.price).map(o=>`
        <li class="furniture-list-item">
            <img class="card-image" src="${o.images[0]}" alt="${o.name}"/>
            <h3 class="card-title">${o.name}</h3>
            <ul class="card-color-container">
                ${(o.color||[]).map(t=>`
                    <li
                    class="card-color-item"
                    style="background-color: ${t};">1
                    </li>
                    `).join("")}               
            </ul>
            <p class="card-price">${o.price.toLocaleString()} грн</p>
            <button 
                class="details-button button" 
                data-id="${o._id}">Детальніше</button>
        </li>
    `).join("")}function N(e,o=1){c.hidden=!0,c.innerHTML="",c.append(ae,ie),me(e,o).forEach(s=>{const r=document.createElement("li");if(r.classList.add("page"),s==="..."){const n=document.createElement("span");n.textContent="...",n.classList.add("pagination-ellipsis"),r.append(n)}else{const n=document.createElement("button");n.classList.add("pagination-item","pag-buttons"),n.type="button",n.textContent=s,n.dataset.page=s,s===o&&n.classList.add("isActive"),r.classList.add("page"),r.append(n)}c.lastElementChild.insertAdjacentElement("beforebegin",r)}),c.hidden=e<=1}function me(e,o,t=1){const s=[],r=o-t,n=o+t;let i=!1;for(let d=1;d<=e;d++){const X=d===1||d===e,Z=d>=r&&d<=n;X||Z?(s.push(d),i=!1):i||(s.push("..."),i=!0)}return s}w.addEventListener("click",fe);async function fe(e){p.insertAdjacentElement("beforeend",O),I(),a++;const o=localStorage.getItem(v);try{const{data:t}=await m("/furnitures",{params:{page:a,limit:y,category:o}});g=t.totalItems,l=Math.ceil(g/y),E=l,a=Number(t.page),a<l?(p.insertAdjacentHTML("beforeend",M(t.furnitures)),w.hidden=!1):(T("В даній категорії закінчилися товари"),w.hidden=!0);const s=p.querySelector(".furniture-list-item");s&&window.scrollBy({left:0,top:s.getBoundingClientRect().height,behavior:"smooth"}),h()}catch(t){L(t)}}document.querySelector(".pagination-container").addEventListener("click",async e=>{const o=e.target.closest("[data-page]"),t=e.target.closest("[data-nav]");if(!o&&!t)return;const s=o||t;if(s.disabled)return;if(I(),ge(),o&&(a=Number(o.dataset.page)),t&&(t.dataset.nav==="minus"&&a>1&&a--,t.dataset.nav==="plus"&&a<E&&a++),s.blur(),!a||Number.isNaN(a)){T("Виберіть будь-ласка сторінку для заванатаження товарів"),P(),h();return}const r=localStorage.getItem(v);try{const{data:n}=await m("/furnitures",{params:{page:a,limit:y,category:r}});p.innerHTML=M(n.furnitures),g=n.totalItems,l=Math.ceil(g/y),E=l,N(l,a),k();const i=e.target;if(!i||i.disabled)return;p&&p.scrollIntoView({block:"start",behavior:"smooth"})}catch(n){L(n)}finally{P(),h()}});function ge(){c.querySelectorAll(".pag-buttons").forEach(e=>e.disabled=!0)}function P(){c.querySelectorAll(".pag-buttons").forEach(e=>e.disabled=!1),k()}new ee(".qa",{duration:300,showMultiple:!1,openOnInit:[]});const H=document.querySelectorAll(".faq-quest");H.forEach(e=>{e.addEventListener("click",()=>{const o=e.getAttribute("aria-expanded")==="true";H.forEach(t=>t.setAttribute("aria-expanded","false")),o||e.setAttribute("aria-expanded","true")})});const R=new URL("/furniweblab/assets/sprite-CA5GGzUd.svg",import.meta.url).href,_=document.querySelector(".feedbacks-list");_.innerHTML=`
  <div class="swiper">
    <div class="swiper-wrapper"></div>

    <div class="swiper-controls">
      <div class="swiper-pagination"></div>
  
      <div class="swiper-nav-btn">
        <button class="general-btn custom-prev"><svg class="" width="14" height="14">
        <use href="${R}#icon-arrow-left"></use>
        </svg></button>
        <button class="general-btn custom-next"><svg class="" width="14" height="14">
        <use href="${R}#icon-arrow-right"></use>
        </svg></button>
      </div>
    </div>

  </div>
`;const ye=document.querySelector(".swiper .swiper-wrapper");function be(e){if(e==null)return"";const o=Math.round(e*2)/2,t=Math.floor(o),s=o-t===.5;let r=`rating value-${t}`;return s&&(r+=" half"),`
        <div class="${r}">
            <div class="star-container"></div>
        </div>
    `}async function he(){try{return(await m("https://furniture-store-v2.b.goit.study/api/feedbacks?limit=10&page=1")).data}catch(e){return console.log(e),[]}}he().then(e=>{e.feedbacks.forEach(o=>{const t=`
      <div class="swiper-slide">
        <div class="feedback-card">
          ${be(o.rate)}
          <p class="swiper-text">“${o.descr}”</p>
          <p class="swiper-text-name">${o.name}</p>
        </div>
      </div>
    `;ye.insertAdjacentHTML("beforeend",t)}),new te(".swiper",{loop:!1,slidesPerView:1,spaceBetween:24,pagination:{el:".swiper-pagination",clickable:!0,type:"bullets"},navigation:{prevEl:".custom-prev",nextEl:".custom-next"},breakpoints:{768:{slidesPerView:2,spaceBetween:24},1440:{slidesPerView:3,spaceBetween:24}}})}).catch(e=>{console.error("Помилка при ініціалізації слайдера відгуків:",e),_.innerHTML=`<p style="color: red;">
      Неможливо завантажити відгуки. Будь ласка, спробуйте оновити сторінку.
    </p>`});function U(){if(document.querySelector("#page-spinner"))return;const e=document.createElement("div");e.id="page-spinner",e.setAttribute("role","status"),e.setAttribute("aria-live","polite"),e.innerHTML=`
      <div class="spinner" aria-label="Завантаження…">
        <button class="loadingBtn" type="button">
            <span class="loader" id="btnSpinner"></span>
        </button>
      </div>
    `,document.body.appendChild(e),document.body.classList.add("no-scroll")}function B(){const e=document.getElementById("page-spinner");e&&(e.remove(),document.body.classList.remove("no-scroll"))}m.defaults.baseURL="https://furniture-store-v2.b.goit.study/api";function G(e){b.error({message:e,position:"topCenter",timeout:3e3,backgroundColor:"#EF4040",messageColor:"white",close:!1})}async function ve(e){try{return(await m.get(`/furnitures/${e}`)).data}catch(o){throw console.error(`Помилка при отриманні деталей продукту з ID ${e}:`,o),o}}const C=document.querySelector(".product-modal-backdrop"),K=document.querySelector(".product-modal .modal-main-content"),Le=document.querySelector(".modal-close-btn"),W=document.body;function Ee(e){if(e==null)return"";const o=Math.round(e*2)/2,t=Math.floor(o),s=o-t===.5;let r=`rating value-${t}`;return s&&(r+=" half"),`
        <div class="${r}">
            <div class="star-container"></div>
        </div>
    `}function we(e){return`<div class="color-options-container">
            <p class="color-label">Колір</p>
            <form class="color-options">${e.map((t,s)=>{const r=`color-${t.substring(1)}`;return`
            <label class="color-option">
                <input
                  type="radio"
                  name="product-color"
                  value="${t}" 
                  id="${r}"                    
                  class="custom-radio-style ${s===0?"is-active":""}" 
                  style="
                    -webkit-appearance:none;
                    appearance:none;
                    width: 32px;
                    height: 32px;
                    background-color: ${t}; 
                    cursor:pointer; 
                    display:inline-block;"
                  data-color-hex=${t}; 
                  ${s===0?"checked":""}                      
                  />
                           
            </label>
        `}).join("")}</form>
          </div>`}function Se(e){const o=e.price.toLocaleString()+" грн";return`
        <div class="product-gallery">
            <img
              src="${e.images[0]}" alt="${e.name} (Основне)" 
              class="main-product-image" 
            />
            <div class="gallery-thumbnails">
                 ${e.images.slice(1).map(t=>`<img src="${t}" alt="${e.name} (Мініатюра)" class="gallery-thumbnail">`).join("")}
            </div>
        </div>
        
        <div class="product-info">
            <h2 class="model-name">${e.name}</h2> 
            <p class="category-name">${e.category.name}</p> 
            <p class="product-price">
              <span class="price-value">${o}</span>
              <span class="price-currency"></span>
            </p>
            <div class="stars-container">${Ee(e.rate)} 
                  ${we(e.color)} 
            </div>            
            <div class="product-details">
                <p class="description-text">${e.description}</p> 
                <p class="dimensions-text">Розміри: ${e.sizes} см</p> 
            </div>
            
            <button 
                class="button order-btn open-order-modal-btn" 
                type="button"
                data-product-id="${e._id}"      
                data-marker="details_page_order"
                >  
                Перейти до замовлення
            </button>
        </div>
    `}function ke(e){if(!e.target.matches('input[name="product-color"]'))return;e.currentTarget.querySelectorAll('input[name="product-color"]').forEach(t=>t.classList.toggle("is-active",t===e.target))}async function Ce(e){const o=e.detail.productId;try{const t=await ve(o);K.innerHTML=Se(t);const s=document.querySelector(".product-modal .color-options");s&&s.addEventListener("change",ke),document.querySelector(".product-modal .open-order-modal-btn").addEventListener("click",$e),C.classList.remove("is-hidden"),W.classList.add("modal-open"),document.addEventListener("keydown",z),document.body.dispatchEvent(new CustomEvent("details-modal-opened",{bubbles:!0}))}catch{G("Не вдалося відобразити деталі товару.")}finally{B()}}function x(){C.classList.add("is-hidden"),W.classList.remove("modal-open"),document.removeEventListener("keydown",z),K.innerHTML="",document.body.dispatchEvent(new CustomEvent("details-modal-closed",{bubbles:!0}))}function $e(e){const o=e.currentTarget.dataset.productId,t=e.currentTarget.dataset.marker,s=document.querySelector(".color-options input:checked"),r=s?s.value:null;if(!o||!r){G("Необхідно обрати колір перед замовленням.");return}x();const n=new CustomEvent("open-order-modal",{bubbles:!0,detail:{productId:o,selectedColor:r,markerValue:t}});document.body.dispatchEvent(n)}function z(e){e.key==="Escape"&&x()}C.addEventListener("click",e=>{e.target===C&&x()});Le.addEventListener("click",x);document.body.addEventListener("open-details-modal",Ce);document.body.addEventListener("details-modal-opened",B);document.body.addEventListener("details-modal-closed",B);function qe(e){const o=e.target.closest(".details-button");if(!o||!o.dataset.id)return;e.preventDefault(),U();const t=o.dataset.id,s=new CustomEvent("open-details-modal",{bubbles:!0,detail:{productId:t}});document.body.dispatchEvent(s)}document.body.addEventListener("click",qe);const $=document.querySelector("#order-modal .loading"),S=document.getElementById("order-modal"),Ie=document.getElementById("closeModalBtn"),f=document.getElementById("callback-form");let Y=null,J=null;function Me(){$&&($.style.display="flex")}function Be(){$&&($.style.display="none")}document.body.addEventListener("open-order-modal",e=>{const{productId:o,selectedColor:t}=e.detail;Y=o,J=t,U(),S.style.display="flex",document.body.style.overflow="hidden",setTimeout(()=>{B(),document.body.style.overflow="hidden"},200)});function A(){S.style.display="none",document.body.style.overflow="",f.reset(),Q()}Ie.addEventListener("click",A);S.addEventListener("click",e=>{e.target===S&&A()});document.addEventListener("keydown",e=>{e.key==="Escape"&&S.style.display==="flex"&&A()});function F(e,o){e.style.border="1px solid #6b0609";let t=e.parentNode.querySelector(".input-error-text");t||(t=document.createElement("p"),t.classList.add("input-error-text"),e.parentNode.appendChild(t)),t.textContent=o}function Q(){document.querySelectorAll(".input-error-text").forEach(e=>e.remove()),f.querySelectorAll("input, textarea").forEach(e=>{e.style.border="1px solid rgba(8, 12, 9, 0.15)"})}f.addEventListener("submit",async e=>{e.preventDefault(),Q();const o=f.name.value.trim();let t=f.phone.value.trim();const s=f.comment.value.trim();let r=!1;if(o||(F(f.name,"Error Text"),r=!0),(!t||!/^(\d{10}|\d{12})$/.test(t))&&(F(f.phone,"Error Text"),b.error({title:"Помилка",message:"Номер має містити лише 10 або 12 цифр.",position:"topRight",timeout:4e3,color:"#EF4040",messageColor:"white"}),r=!0),r)return;t.length===10&&t.startsWith("0")&&(t="38"+t);const n={name:o,phone:t,modelId:Y,color:J,comment:s||"Чекатиму на зворотний зв'язок для уточнення деталей. Дякую!"};try{Me();const i=await fetch("https://furniture-store-v2.b.goit.study/api/orders",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(n)}),d=await i.json();if(console.log("Відповідь від сервера:",d),!i.ok){b.error({title:"Помилка!",message:d.message||"Щось пішло не так. Перевірте дані.",position:"topRight",color:"#EF4040",messageColor:"white"});return}b.success({title:"Успіх!",message:`Замовлення №${d.orderNum} успішно створено!`,position:"topRight",color:"#009b18",messageColor:"white"}),A()}catch(i){console.error("Помилка при запиті:",i),b.error({title:"Помилка!",message:"Не вдалося відправити замовлення. Спробуйте пізніше.",position:"topRight",color:"#EF4040",messageColor:"white"})}finally{Be()}});document.addEventListener("DOMContentLoaded",()=>{document.querySelectorAll(".js-scroll").forEach(o=>{const t=o.getAttribute("href");t&&t.startsWith("#")&&o.addEventListener("click",s=>{s.preventDefault();const r=t,n=document.querySelector(r);n&&n.scrollIntoView({behavior:"smooth",block:"start"}),o.blur()})})});
//# sourceMappingURL=index.js.map
