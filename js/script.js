// ============================================================
// КОНФИГУРАЦИЯ API (NEWSAPI)
// ============================================================
const NEWS_CONFIG = {
  apiKey: '1ba3bc98a07a4c4da35157c9abe3c440',
  baseUrl: 'https://newsapi.org/v2',
  category: 'technology',
  country: 'us', // Попробуйте 'ru', если новости на английском не нужны (требует проверки тарифа)
};

let newsCache = [];

// ============================================================
// ФУНКЦИИ РАБОТЫ С НОВОСТЯМИ
// ============================================================

/**
 * Загрузка топ-новостей при старте
 */
async function fetchTechNews() {
  const newsContainer = document.querySelector('.news__grid');
  if (!newsContainer) return;

  // Если интернета нет, но есть кэш — показываем кэш сразу
  if (!navigator.onLine && newsCache.length > 0) {
    console.log('⚠️ Нет сети. Показываем сохраненные новости из кэша.');
    renderNews(newsCache);
    newsContainer.innerHTML +=
      '<p style="text-align:center; color: #aaa; font-size: 0.9em;">(Показаны сохраненные данные, так как нет интернета)</p>';
    return;
  }

  // Индикатор загрузки
  if (newsCache.length === 0) {
    newsContainer.innerHTML =
      '<p class="loading" style="text-align:center; padding: 20px;">Загрузка технических новостей...</p>';
  }

  try {
    const url = `${NEWS_CONFIG.baseUrl}/top-headlines?category=${NEWS_CONFIG.category}&country=${NEWS_CONFIG.country}&apiKey=${NEWS_CONFIG.apiKey}`;

    const response = await fetch(url);

    if (!response.ok) throw new Error(response.statusText);

    const data = await response.json();

    if (data.status === 'ok') {
      newsCache = data.articles; // Сохраняем в глобальный кэш
      renderNews(newsCache);
      console.log('✅ Новости загружены и закэшированы.');
    } else {
      throw new Error(data.message || 'Ошибка API');
    }
  } catch (error) {
    console.error('Ошибка получения новостей:', error);

    // Если ошибка из-за сети И есть старый кэш — показываем его
    if (
      (error.message.includes('Load failed') || !navigator.onLine) &&
      newsCache.length > 0
    ) {
      console.log('⚠️ Ошибка сети. Переключаемся на кэш.');
      renderNews(newsCache);
      newsContainer.innerHTML +=
        '<p style="text-align:center; color: #ff9800; font-size: 0.9em;">(Нет соединения. Показаны сохраненные новости)</p>';
      return;
    }

    // Если кэша нет или ошибка другая — показываем сообщение об ошибке
    let errorMsg = 'Не удалось загрузить новости.';
    if (error.message.includes('too many requests'))
      errorMsg = 'Превышен лимит запросов API.';

    // Очищаем контейнер перед показом ошибки, если там был лоадер
    if (newsCache.length === 0) {
      newsContainer.innerHTML = `
        <div class="error-message" style="color: red; text-align: center; padding: 20px;">
            <p>${errorMsg}</p>
            <small>Детали: ${error.message}</small>
            ${!navigator.onLine ? '<p>Проверьте подключение к интернету.</p>' : ''}
        </div>`;
    }
  }
}

/**
 * Отрисовка карточек новостей
 */
function renderNews(articles) {
  const newsContainer = document.querySelector('.news__grid');
  if (!newsContainer) return;

  if (!articles || articles.length === 0) {
    newsContainer.innerHTML = '<p>Новости не найдены.</p>';
    return;
  }

  newsContainer.innerHTML = '';

  // Ограничиваем количество новостей (например, первые 6)
  const limitedArticles = articles.slice(0, 6);

  limitedArticles.forEach(article => {
    // Пропускаем статьи без изображений или удаленные
    if (article.urlToImage === null || article.title === '[Removed]') return;

    const card = document.createElement('article');
    card.className = 'news-card';

    // Форматирование даты
    const date = new Date(article.publishedAt).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

    // Обрезаем описание, если оно слишком длинное
    let description = article.description || 'Описание недоступно';
    if (description.length > 120) {
      description = description.substring(0, 120) + '...';
    }

    card.innerHTML = `
      <div class="news-card__image-wrapper">
        <img src="${article.urlToImage}" alt="${article.title}" class="news-card__image" onerror="this.style.display='none'">
        <span class="news-card__category">Технологии</span>
      </div>
      <div class="news-card__content">
        <div class="news-card__meta">
          <span class="news-card__source">${article.source.name}</span>
          <span class="news-card__date">${date}</span>
        </div>
        <h3 class="news-card__title">${article.title}</h3>
        <p class="news-card__description">${description}</p>
        <a href="${article.url}" target="_blank" rel="noopener noreferrer" class="news-card__link">
          Читать далее →
        </a>
      </div>
    `;

    newsContainer.appendChild(card);
  });
}
/**
 * Поиск новостей
 */
async function searchNews(query) {
  if (!query || query.trim() === '') {
    // Если запрос пустой, загружаем обычные топ-новости
    fetchTechNews();
    return;
  }

  const newsContainer = document.querySelector('.news__grid');
  if (!newsContainer) {
    alert('Раздел новостей не найден на странице!');
    return;
  }

  console.log('Начат поиск по запросу:', query);
  newsContainer.innerHTML =
    '<p class="loading" style="text-align:center; padding: 20px;">Поиск новостей...</p>';

  try {
    const url = `${NEWS_CONFIG.baseUrl}/everything?q=${encodeURIComponent(query)}&language=en&sortBy=publishedAt&apiKey=${NEWS_CONFIG.apiKey}`;
    console.log('Запрос поиска:', url);

    const response = await fetch(url);
    const data = await response.json();

    if (data.status === 'ok') {
      if (data.totalResults === 0) {
        newsContainer.innerHTML =
          '<p style="text-align:center">Ничего не найдено по вашему запросу.</p>';
      } else {
        renderNews(data.articles);
      }
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    console.error('Ошибка поиска:', error);
    newsContainer.innerHTML = `<p class="error-message" style="color:red; text-align:center">Ошибка поиска: ${error.message}</p>`;
  }
}

// ============================================================
// ИНИЦИАЛИЗАЦИЯ ПРИ ЗАГРУЗКЕ СТРАНИЦЫ
// ============================================================

document.addEventListener('DOMContentLoaded', function () {
  // 1. Запуск загрузки новостей
  fetchTechNews();

  // 2. Настройка поиска новостей
  // Вариант А: Если есть специальная форма поиска новостей
  const newsSearchForm = document.querySelector('.news-search-form');
  const newsSearchInput = document.querySelector('.news-search-input');

  if (newsSearchForm && newsSearchInput) {
    newsSearchForm.addEventListener('submit', function (e) {
      e.preventDefault();
      searchNews(newsSearchInput.value);
    });
  }

  // Вариант Б: Глобальный поиск (если вы используете общую строку поиска в шапке)
  // Привязываем поиск к любой форме с классом .search-form или инпуту .search-input при нажатии Enter
  const globalSearchInput = document.querySelector('.search-input');
  if (globalSearchInput && !newsSearchInput) {
    globalSearchInput.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        searchNews(this.value);
        // Опционально: скролл к секции новостей
        const newsSection = document.querySelector('.news');
        if (newsSection) newsSection.scrollIntoView({ behavior: 'smooth' });
      }
    });

    // Если есть кнопка поиска рядом
    const searchBtn = document.querySelector(
      '.search-button, .header__search-btn'
    );
    if (searchBtn) {
      searchBtn.addEventListener('click', () => {
        searchNews(globalSearchInput.value);
      });
    }
  }

  // ============================================================
  // ЧАСТЬ 2: ОСНОВЫ РАБОТЫ С DOM (ДЕМО)
  // ============================================================
  const header = document.querySelector('.header');
  const allCards = document.querySelectorAll('.product-card');
  console.log('Найдено товаров:', allCards.length);

  // ============================================================
  // ЧАСТЬ 3: ЛОГИКА МАГАЗИНА (TECHSTORE)
  // ============================================================

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
      cart.forEach(item => {
        const div = document.createElement('div');
        div.className = 'cart__item';
        div.innerHTML = `
          <img src="${item.image}" alt="${item.name}" class="cart__item-img" onerror="this.src='images/placeholder.png'">
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

    // Анимация кнопки
    const btn = event.target;
    const originalText = btn.textContent;
    btn.textContent = 'В КОРЗИНЕ ✓';
    btn.style.backgroundColor = '#00cc99';
    setTimeout(() => {
      btn.textContent = originalText;
      btn.style.backgroundColor = '';
    }, 1000);
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

  // Управление корзиной (UI)
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

  // Делегирование событий корзины
  document
    .querySelector('.cart__items')
    ?.addEventListener('click', function (e) {
      const id = parseInt(e.target.dataset.id);
      if (e.target.classList.contains('cart__remove')) removeFromCart(id);
      if (e.target.classList.contains('cart__qty-btn'))
        changeQty(id, e.target.dataset.action);
    });

  // Добавление товаров из сетки
  const productsGrid = document.querySelector('.products__grid');
  if (productsGrid) {
    productsGrid.addEventListener('click', function (event) {
      if (event.target.classList.contains('product-card__button')) {
        const card = event.target.closest('.product-card');
        // Ищем товар по имени или ID (здесь упрощенно по имени)
        const titleEl = card?.querySelector('.product-card__title');
        if (!titleEl) return;

        const name = titleEl.textContent.trim();
        const product = products.find(p => p.name === name);

        if (product) {
          addToCart(product.id);
        } else {
          console.warn('Товар не найден в базе:', name);
        }
      }
    });
  }

  renderCart();

  // Фильтры
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
    cards.forEach(card => {
      const titleEl = card.querySelector('.product-card__title');
      if (!titleEl) return;

      const name = titleEl.textContent.trim();
      const product = products.find(p => p.name === name);
      if (!product) return;

      const matchPrice = product.price <= maxPrice;
      const matchCategory =
        activeCategory === 'all' || product.category === activeCategory;

      card.style.display = matchPrice && matchCategory ? '' : 'none';
    });
  }

  document
    .querySelector('.filter__price-range')
    ?.addEventListener('input', filterProducts);
  document.querySelectorAll('.filter__category').forEach(btn => {
    btn.addEventListener('click', function () {
      document
        .querySelectorAll('.filter__category')
        .forEach(b => b.classList.remove('filter__category--active'));
      this.classList.add('filter__category--active');
      filterProducts();
    });
  });

  // Слайдер
  const slides = document.querySelectorAll('.slider__slide');
  const prevBtn = document.querySelector('.slider__prev');
  const nextBtn = document.querySelector('.slider__next');
  const dots = document.querySelectorAll('.slider__dot');
  let currentSlide = 0;
  let sliderInterval = null;

  function goToSlide(index) {
    if (slides.length === 0) return;
    slides.forEach(s => s.classList.remove('slider__slide--active'));
    dots.forEach(d => d.classList.remove('slider__dot--active'));

    currentSlide = (index + slides.length) % slides.length;
    slides[currentSlide]?.classList.add('slider__slide--active');
    dots[currentSlide]?.classList.add('slider__dot--active');
  }

  function startAutoplay() {
    if (sliderInterval) clearInterval(sliderInterval);
    sliderInterval = setInterval(() => goToSlide(currentSlide + 1), 3500);
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
    dots.forEach((dot, i) =>
      dot.addEventListener('click', () => {
        stopAutoplay();
        goToSlide(i);
        startAutoplay();
      })
    );
  }

  function stopAutoplay() {
    clearInterval(sliderInterval);
  }

  // Бургер меню
  const burger = document.querySelector('.header__burger');
  const mobileMenu = document.querySelector('.header__mobile-menu');
  if (burger && mobileMenu) {
    burger.addEventListener('click', () => {
      burger.classList.toggle('header__burger--active');
      mobileMenu.classList.toggle('header__mobile-menu--active');
      document.body.style.overflow = mobileMenu.classList.contains(
        'header__mobile-menu--active'
      )
        ? 'hidden'
        : '';
    });
  }
});

// Плавный скролл
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href !== '#' && href.length > 1) {
      e.preventDefault();
      document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// ============================================================
// ВАЛИДАЦИЯ ФОРМ
// ============================================================
function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+/.test(email);
}

const contactForm = document.querySelector('.contact-form');
if (contactForm) {
  const nameInput = contactForm.querySelector('#contact-name');
  const emailInput = contactForm.querySelector('#contact-email');
  const messageInput = contactForm.querySelector('#contact-message');

  const showError = (el, msg) => {
    el.style.borderColor = 'red';
    if (!el.parentNode.querySelector('.error-message')) {
      const err = document.createElement('div');
      err.className = 'error-message';
      err.style.color = 'red';
      err.style.fontSize = '12px';
      err.textContent = msg;
      el.parentNode.appendChild(err);
    }
  };

  const clearError = el => {
    el.style.borderColor = '';
    const err = el.parentNode.querySelector('.error-message');
    if (err) err.remove();
  };

  emailInput?.addEventListener('blur', function () {
    clearError(this);
    if (!validateEmail(this.value)) showError(this, 'Некорректный email');
  });

  contactForm.addEventListener('submit', function (e) {
    e.preventDefault();
    let valid = true;
    if (!nameInput?.value.trim()) {
      showError(nameInput, 'Введите имя');
      valid = false;
    }
    if (!validateEmail(emailInput?.value)) {
      showError(emailInput, 'Введите email');
      valid = false;
    }
    if (!messageInput?.value.trim()) {
      showError(messageInput, 'Введите сообщение');
      valid = false;
    }

    if (valid) {
      contactForm.innerHTML =
        '<div class="form-success"><h3>Отправлено!</h3><p>Мы свяжемся с вами.</p></div>';
    }
  });
}

// 1. Когда интернет ПРОПАЛ
window.addEventListener('offline', () => {
  console.warn('⚠️ Сеть отключена. Показываем уведомление.');
  const newsContainer = document.querySelector('.news__grid');
  if (newsContainer) {
    // Не стираем текущий контент сразу, но добавляем предупреждение сверху, если новостей нет
    if (!newsContainer.querySelector('.offline-banner')) {
      const banner = document.createElement('div');
      banner.className = 'offline-banner';
      banner.style.cssText =
        'background:#ffcc00; color:#000; padding:10px; text-align:center; font-weight:bold;';
      banner.textContent =
        '⚠️ Нет подключения к интернету. Новости могут быть устаревшими.';
      newsContainer.prepend(banner);

      // Удаляем баннер через 5 секунд, чтобы не мешал
      setTimeout(() => banner.remove(), 5000);
    }
  }
});

// 2. Когда интернет ПОЯВИЛСЯ
window.addEventListener('online', async () => {
  console.log('✅ Сеть восстановлена! Запускаем авто-обновление...');

  const newsContainer = document.querySelector('.news__grid');
  if (!newsContainer) return;

  // Удаляем старые ошибки и баннеры
  const banners = newsContainer.querySelectorAll(
    '.offline-banner, .error-message, .loading'
  );
  banners.forEach(el => el.remove());

  // Показываем индикатор загрузки
  newsContainer.innerHTML =
    '<p class="loading" style="text-align:center; padding:20px; color:#00cc99;">📡 Соединение восстановлено. Обновляем новости...</p>';

  // Ждем 1 секунду (чтобы сеть стабилизировалась) и грузим данные
  setTimeout(async () => {
    try {
      await fetchTechNews(); // Пытаемся загрузить заново
      console.log('✅ Новости успешно обновлены после восстановления сети.');
    } catch (error) {
      console.error('❌ Не удалось обновить новости автоматически:', error);
      // Если снова ошибка — возвращаем кнопку "Обновить"
      newsContainer.innerHTML = `
        <div class="error-message" style="text-align:center; padding:20px;">
          <p>Автоматическое обновление не удалось.</p>
          <button onclick="fetchTechNews()" style="padding:8px 16px; background:#00cc99; color:white; border:none; cursor:pointer; border-radius:4px;">Попробовать снова</button>
        </div>
      `;
    }
  }, 1000);
});
