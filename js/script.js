// ============================================================
// Часть 2. Основы работы с DOM — демонстрация в консоли
// ============================================================

document.addEventListener('DOMContentLoaded', function () {
  // 1. Поиск элементов
  const header = document.querySelector('.header');
  const allCards = document.querySelectorAll('.product-card');
  const mainContainer = document.querySelector('.main');

  console.log('Найдено элементов:', {
    header: header,
    cards: allCards,
    container: mainContainer,
  });

  // 2. Манипуляция контентом (только в консоли)
  const projectTitle = document.querySelector('.header__logo');
  console.log('Логотип:', projectTitle?.textContent);

  const newButton = document.createElement('button');
  newButton.className = 'button button--primary';
  newButton.textContent = 'Новая кнопка';
  console.log('Создана кнопка (не добавлена на страницу):', newButton);

  // 3. Работа с классами и стилями (только в консоли)
  const card = document.querySelector('.product-card');
  if (card) {
    console.log('Классы карточки до:', card.className);
    card.classList.add('product-card--highlighted');
    card.classList.remove('product-card--highlighted');
    console.log('Классы карточки после демонстрации:', card.className);
  }

  // ============================================================
  // Часть 3. Обработка событий
  // ============================================================

  const firstButton = document.querySelector('.product-card__button');
  if (firstButton) {
    firstButton.addEventListener('click', function (event) {
      event.preventDefault();
      console.log('Кнопка нажата!');
    });
  }

  const searchInput = document.querySelector('.search-input');
  if (searchInput) {
    searchInput.addEventListener('input', function (event) {
      console.log('Введен текст:', event.target.value);
    });
  }

  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function (event) {
      event.preventDefault();
      const formData = new FormData(this);
      console.log('Данные формы:', Object.fromEntries(formData));
    });
  }

  // ============================================================
  // Часть 4. Вариант 2 — TechStore
  // ============================================================

  // ----------------------------------------------------------
  // ДАННЫЕ ТОВАРОВ
  // ----------------------------------------------------------
  const products = [
    {
      id: 1,
      name: 'Cyber Headphones',
      price: 299,
      category: 'audio',
      image: 'images/headphones.png',
    },
    {
      id: 2,
      name: 'Gaming Laptop',
      price: 1499,
      category: 'computers',
      image: 'images/laptop.png',
    },
    {
      id: 3,
      name: 'Smart Watch Pro',
      price: 399,
      category: 'wearables',
      image: 'images/watch.png',
    },
    {
      id: 4,
      name: 'Wireless Earbuds',
      price: 199,
      category: 'audio',
      image: 'images/earbuds.png',
    },
  ];

  // ----------------------------------------------------------
  // 1. КОРЗИНА
  // ----------------------------------------------------------
  let cart = [];

  function renderCart() {
    const cartItems = document.querySelector('.cart__items');
    const cartTotal = document.querySelector('.cart__total-price');
    const cartCount = document.querySelector('.cart__count');
    if (!cartItems) return;

    cartItems.innerHTML = '';

    if (cart.length === 0) {
      cartItems.innerHTML = '<p class="cart__empty">Корзина пуста</p>';
    } else {
      cart.forEach(function (item) {
        const div = document.createElement('div');
        div.className = 'cart__item';
        div.innerHTML = `
          <img src="${item.image}" alt="${item.name}" class="cart__item-img">
          <div class="cart__item-info">
            <span class="cart__item-name">${item.name}</span>
            <div class="cart__item-controls">
              <button class="cart__qty-btn" data-id="${item.id}" data-action="decrease">−</button>
              <span class="cart__item-qty">${item.qty}</span>
              <button class="cart__qty-btn" data-id="${item.id}" data-action="increase">+</button>
            </div>
          </div>
          <div class="cart__item-right">
            <span class="cart__item-price">$${item.price * item.qty}</span>
            <button class="cart__remove" data-id="${item.id}" aria-label="Удалить">✕</button>
          </div>
        `;
        cartItems.appendChild(div);
      });
    }

    const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
    if (cartTotal) cartTotal.textContent = '$' + total;

    const totalQty = cart.reduce((sum, i) => sum + i.qty, 0);
    if (cartCount) {
      cartCount.textContent = totalQty;
      cartCount.style.display = totalQty > 0 ? 'flex' : 'none';
    }

    console.log('Корзина обновлена:', cart);
  }

  function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    const existing = cart.find(i => i.id === productId);
    if (existing) {
      existing.qty += 1;
    } else {
      cart.push({ ...product, qty: 1 });
    }
    renderCart();
  }

  function removeFromCart(productId) {
    cart = cart.filter(i => i.id !== productId);
    renderCart();
  }

  function changeQty(productId, action) {
    const item = cart.find(i => i.id === productId);
    if (!item) return;
    if (action === 'increase') item.qty += 1;
    if (action === 'decrease') {
      item.qty -= 1;
      if (item.qty <= 0) return removeFromCart(productId);
    }
    renderCart();
  }

  // Открытие/закрытие корзины
  const cartToggle = document.querySelector('.cart-toggle');
  const cartSidebar = document.querySelector('.cart-sidebar');
  const cartOverlay = document.querySelector('.cart-overlay');
  const cartClose = document.querySelector('.cart__close');

  function openCart() {
    cartSidebar?.classList.add('cart-sidebar--open');
    cartOverlay?.classList.add('cart-overlay--visible');
    document.body.style.overflow = 'hidden';
  }

  function closeCart() {
    cartSidebar?.classList.remove('cart-sidebar--open');
    cartOverlay?.classList.remove('cart-overlay--visible');
    document.body.style.overflow = '';
  }

  cartToggle?.addEventListener('click', openCart);
  cartClose?.addEventListener('click', closeCart);
  cartOverlay?.addEventListener('click', closeCart);

  // Делегирование: кнопки в корзине
  document
    .querySelector('.cart__items')
    ?.addEventListener('click', function (e) {
      const id = parseInt(e.target.dataset.id);
      if (e.target.classList.contains('cart__remove')) removeFromCart(id);
      if (e.target.classList.contains('cart__qty-btn'))
        changeQty(id, e.target.dataset.action);
    });

  // Делегирование: ADD TO CART на карточках
  const productsGrid = document.querySelector('.products__grid');
  if (productsGrid) {
    productsGrid.addEventListener('click', function (event) {
      if (event.target.classList.contains('product-card__button')) {
        const card = event.target.closest('.product-card');
        const name = card
          ?.querySelector('.product-card__title')
          ?.textContent?.trim();
        const product = products.find(p => p.name === name);
        if (product) {
          addToCart(product.id);
          event.target.textContent = 'В КОРЗИНЕ ✓';
          event.target.style.backgroundColor = '#00cc99';
          setTimeout(() => {
            event.target.textContent = 'ADD TO CART';
            event.target.style.backgroundColor = '';
          }, 1200);
        }
      }
    });
  }

  renderCart();

  // ----------------------------------------------------------
  // 2. ФИЛЬТРЫ ТОВАРОВ
  // ----------------------------------------------------------
  function filterProducts() {
    const maxPrice = parseInt(
      document.querySelector('.filter__price-range')?.value || 9999
    );
    const activeCategory =
      document.querySelector('.filter__category--active')?.dataset.category ||
      'all';
    const priceLabel = document.querySelector('.filter__price-value');
    if (priceLabel) priceLabel.textContent = '$' + maxPrice;

    const cards = document.querySelectorAll('.product-card');
    cards.forEach(function (card) {
      const name = card
        .querySelector('.product-card__title')
        ?.textContent?.trim();
      const product = products.find(p => p.name === name);
      if (!product) return;

      const matchPrice = product.price <= maxPrice;
      const matchCategory =
        activeCategory === 'all' || product.category === activeCategory;

      card.style.display = matchPrice && matchCategory ? '' : 'none';
    });

    console.log(
      'Фильтр применён: цена до $' + maxPrice + ', категория: ' + activeCategory
    );
  }

  // Слайдер цены
  document
    .querySelector('.filter__price-range')
    ?.addEventListener('input', filterProducts);

  // Кнопки категорий
  document.querySelectorAll('.filter__category').forEach(function (btn) {
    btn.addEventListener('click', function () {
      document
        .querySelectorAll('.filter__category')
        .forEach(b => b.classList.remove('filter__category--active'));
      this.classList.add('filter__category--active');
      filterProducts();
    });
  });

  // ----------------------------------------------------------
  // 3. СЛАЙДЕР АКЦИОННЫХ ТОВАРОВ
  // ----------------------------------------------------------
  const slides = document.querySelectorAll('.slider__slide');
  const prevBtn = document.querySelector('.slider__prev');
  const nextBtn = document.querySelector('.slider__next');
  const dots = document.querySelectorAll('.slider__dot');
  let currentSlide = 0;
  let sliderInterval = null;

  function goToSlide(index) {
    slides.forEach(s => s.classList.remove('slider__slide--active'));
    dots.forEach(d => d.classList.remove('slider__dot--active'));
    currentSlide = (index + slides.length) % slides.length;
    slides[currentSlide]?.classList.add('slider__slide--active');
    dots[currentSlide]?.classList.add('slider__dot--active');
    console.log('Слайд:', currentSlide + 1);
  }

  function startAutoplay() {
    sliderInterval = setInterval(() => goToSlide(currentSlide + 1), 3500);
  }

  function stopAutoplay() {
    clearInterval(sliderInterval);
  }

  if (slides.length > 0) {
    goToSlide(0);
    startAutoplay();

    prevBtn?.addEventListener('click', () => {
      stopAutoplay();
      goToSlide(currentSlide - 1);
      startAutoplay();
    });
    nextBtn?.addEventListener('click', () => {
      stopAutoplay();
      goToSlide(currentSlide + 1);
      startAutoplay();
    });

    dots.forEach(function (dot, i) {
      dot.addEventListener('click', () => {
        stopAutoplay();
        goToSlide(i);
        startAutoplay();
      });
    });
  }

  // ----------------------------------------------------------
  // Бургер-меню
  // ----------------------------------------------------------
  const burger = document.querySelector('.header__burger');
  const mobileMenu = document.querySelector('.header__mobile-menu');
  const body = document.body;

  if (burger && mobileMenu) {
    burger.addEventListener('click', function () {
      burger.classList.toggle('header__burger--active');
      mobileMenu.classList.toggle('header__mobile-menu--active');
      body.style.overflow = mobileMenu.classList.contains(
        'header__mobile-menu--active'
      )
        ? 'hidden'
        : '';
    });

    mobileMenu.querySelectorAll('.nav__link').forEach(function (link) {
      link.addEventListener('click', function () {
        burger.classList.remove('header__burger--active');
        mobileMenu.classList.remove('header__mobile-menu--active');
        body.style.overflow = '';
      });
    });

    document.addEventListener('click', function (event) {
      if (
        !burger.contains(event.target) &&
        !mobileMenu.contains(event.target)
      ) {
        burger.classList.remove('header__burger--active');
        mobileMenu.classList.remove('header__mobile-menu--active');
        body.style.overflow = '';
      }
    });
  }
});

// Плавный скролл
document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href !== '#') {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ============================================================
// Часть 5. Работа с формами и валидация
// ============================================================

// Так как helpers.js использует export, импортируем через динамический import
// (или можно подключить helpers.js как module — см. index.html)

function validateEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+/;
  return regex.test(email);
}

function validateRequired(value) {
  return value.trim().length > 0;
}

function showError(element, message) {
  element.style.borderColor = 'red';
  if (element.parentNode.querySelector('.error-message')) return;
  const errorElement = document.createElement('div');
  errorElement.className = 'error-message';
  errorElement.textContent = message;
  element.parentNode.appendChild(errorElement);
}

function clearErrors(element) {
  element.style.borderColor = '';
  const errorElement = element.parentNode.querySelector('.error-message');
  if (errorElement) errorElement.remove();
}

// Валидация контактной формы
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
  const nameInput = contactForm.querySelector('#contact-name');
  const emailInput = contactForm.querySelector('#contact-email');
  const messageInput = contactForm.querySelector('#contact-message');

  // Валидация при потере фокуса (blur)
  emailInput?.addEventListener('blur', function () {
    clearErrors(this);
    if (!validateEmail(this.value)) {
      showError(this, 'Введите корректный email');
    }
  });

  nameInput?.addEventListener('blur', function () {
    clearErrors(this);
    if (!validateRequired(this.value)) {
      showError(this, 'Поле обязательно для заполнения');
    }
  });

  messageInput?.addEventListener('blur', function () {
    clearErrors(this);
    if (!validateRequired(this.value)) {
      showError(this, 'Напишите ваше сообщение');
    }
  });

  // Валидация при отправке формы
  contactForm.addEventListener('submit', function (event) {
    event.preventDefault();
    let isValid = true;

    if (!validateRequired(nameInput?.value || '')) {
      showError(nameInput, 'Поле обязательно для заполнения');
      isValid = false;
    }

    if (!validateEmail(emailInput?.value || '')) {
      showError(emailInput, 'Введите корректный email');
      isValid = false;
    }

    if (!validateRequired(messageInput?.value || '')) {
      showError(messageInput, 'Напишите ваше сообщение');
      isValid = false;
    }

    if (isValid) {
      const formData = new FormData(this);
      console.log('Форма отправлена:', Object.fromEntries(formData));

      // Показываем успех
      contactForm.innerHTML = `
        <div class="form-success">
          <span class="form-success__icon">✓</span>
          <h3>Сообщение отправлено!</h3>
          <p>Мы свяжемся с вами в ближайшее время.</p>
        </div>
      `;
    }
  });
}
