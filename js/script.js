// js/script.js
import { ApiService } from './api/apiService.js';
import { StorageService } from './storage/localStorage.js';
import { SessionStorageService } from './storage/sessionStorage.js';
import { APITester } from './utils/apiTester.js';

document.addEventListener('DOMContentLoaded', async function () {
  // ── Корзина ──────────────────────────────────────────────
  let cart = StorageService.loadCart();

  function renderCart() {
    const cartItems = document.querySelector('.cart__items');
    const cartTotal = document.querySelector('.cart__total-price');
    const cartCount = document.querySelector('.cart__count');
    if (!cartItems) return;
    cartItems.innerHTML = '';
    if (!cart.length) {
      cartItems.innerHTML = '<p class="cart__empty">Корзина пуста</p>';
    } else {
      cart.forEach(item => {
        const div = document.createElement('div');
        div.className = 'cart__item';
        div.innerHTML = `
          <img src="${item.image}" alt="${item.name}" class="cart__item-img">
          <div class="cart__item-info">
            <span class="cart__item-name">${item.name.slice(0, 28)}...</span>
            <div class="cart__item-controls">
              <button class="cart__qty-btn" data-id="${item.id}" data-action="decrease">−</button>
              <span class="cart__item-qty">${item.qty}</span>
              <button class="cart__qty-btn" data-id="${item.id}" data-action="increase">+</button>
            </div>
          </div>
          <div class="cart__item-right">
            <span class="cart__item-price">$${item.price * item.qty}</span>
            <button class="cart__remove" data-id="${item.id}">✕</button>
          </div>`;
        cartItems.appendChild(div);
      });
    }
    const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
    if (cartTotal) cartTotal.textContent = '$' + total;
    const qty = cart.reduce((s, i) => s + i.qty, 0);
    if (cartCount) {
      cartCount.textContent = qty;
      cartCount.style.display = qty > 0 ? 'flex' : 'none';
    }
  }

  function addToCart(product) {
    const ex = cart.find(i => i.id === product.id);
    ex ? ex.qty++ : cart.push({ ...product, qty: 1 });
    StorageService.saveCart(cart);
    renderCart();
  }

  function removeFromCart(id) {
    cart = cart.filter(i => i.id !== id);
    StorageService.saveCart(cart);
    renderCart();
  }

  function changeQty(id, action) {
    const item = cart.find(i => i.id === id);
    if (!item) return;
    action === 'increase' ? item.qty++ : item.qty--;
    if (item.qty <= 0) return removeFromCart(id);
    StorageService.saveCart(cart);
    renderCart();
  }

  const cartSidebar = document.querySelector('.cart-sidebar');
  const cartOverlay = document.querySelector('.cart-overlay');
  const openCart = () => {
    cartSidebar?.classList.add('cart-sidebar--open');
    cartOverlay?.classList.add('cart-overlay--visible');
    document.body.style.overflow = 'hidden';
  };
  const closeCart = () => {
    cartSidebar?.classList.remove('cart-sidebar--open');
    cartOverlay?.classList.remove('cart-overlay--visible');
    document.body.style.overflow = '';
  };

  document.querySelector('.cart-toggle')?.addEventListener('click', openCart);
  document.querySelector('.cart__close')?.addEventListener('click', closeCart);
  cartOverlay?.addEventListener('click', closeCart);
  document.querySelector('.cart__items')?.addEventListener('click', e => {
    const id = parseInt(e.target.dataset.id);
    if (e.target.classList.contains('cart__remove')) removeFromCart(id);
    if (e.target.classList.contains('cart__qty-btn'))
      changeQty(id, e.target.dataset.action);
  });

  const staticProducts = [
    {
      id: 101,
      name: 'Cyber Headphones',
      price: 299,
      image: 'images/headphones.png',
    },
    { id: 102, name: 'Gaming Laptop', price: 1499, image: 'images/laptop.png' },
    { id: 103, name: 'Smart Watch Pro', price: 399, image: 'images/watch.png' },
    {
      id: 104,
      name: 'Wireless Earbuds',
      price: 199,
      image: 'images/earbuds.png',
    },
  ];
  document.querySelector('.products__grid')?.addEventListener('click', e => {
    if (!e.target.classList.contains('product-card__button')) return;
    const name = e.target
      .closest('.product-card')
      ?.querySelector('.product-card__title')
      ?.textContent?.trim();
    const product = staticProducts.find(p => p.name === name);
    if (product) {
      addToCart(product);
      e.target.textContent = 'В КОРЗИНЕ ✓';
      e.target.style.backgroundColor = '#00cc99';
      setTimeout(() => {
        e.target.textContent = 'ADD TO CART';
        e.target.style.backgroundColor = '';
      }, 1200);
    }
  });
  renderCart();

  // ── Слайдер ──────────────────────────────────────────────
  const slides = document.querySelectorAll('.slider__slide');
  const dots = document.querySelectorAll('.slider__dot');
  let cur = 0,
    sliderTimer = null;
  function goToSlide(i) {
    slides.forEach(s => s.classList.remove('slider__slide--active'));
    dots.forEach(d => d.classList.remove('slider__dot--active'));
    cur = (i + slides.length) % slides.length;
    slides[cur]?.classList.add('slider__slide--active');
    dots[cur]?.classList.add('slider__dot--active');
  }
  if (slides.length) {
    goToSlide(0);
    sliderTimer = setInterval(() => goToSlide(cur + 1), 3500);
    const restart = fn => {
      clearInterval(sliderTimer);
      fn();
      sliderTimer = setInterval(() => goToSlide(cur + 1), 3500);
    };
    document
      .querySelector('.slider__prev')
      ?.addEventListener('click', () => restart(() => goToSlide(cur - 1)));
    document
      .querySelector('.slider__next')
      ?.addEventListener('click', () => restart(() => goToSlide(cur + 1)));
    dots.forEach((d, i) =>
      d.addEventListener('click', () => restart(() => goToSlide(i)))
    );
  }

  // ── API секция ────────────────────────────────────────────
  const apiGrid = document.getElementById('api-products-grid');
  const apiStatus = document.getElementById('api-status');
  const searchInput = document.getElementById('api-search-input');
  const searchBtn = document.getElementById('api-search-btn');

  function setStatus(msg, isError = false) {
    if (apiStatus) {
      apiStatus.textContent = msg;
      apiStatus.style.color = isError
        ? '#ff4444'
        : 'var(--color-text-secondary)';
    }
  }

  function renderApiSkeletons() {
    if (!apiGrid) return;
    apiGrid.innerHTML = Array(4)
      .fill(
        `
      <article class="product-card product-card--skeleton">
        <div class="skeleton skeleton--img"></div>
        <div class="skeleton skeleton--text"></div>
        <div class="skeleton skeleton--text skeleton--short"></div>
        <div class="skeleton skeleton--btn"></div>
      </article>`
      )
      .join('');
  }

  function renderApiProducts(products) {
    if (!apiGrid) return;
    if (!products?.length) {
      apiGrid.innerHTML = '<p class="api-empty">Ничего не найдено</p>';
      return;
    }
    apiGrid.innerHTML = products
      .map(
        p => `
      <article class="product-card">
        <figure class="product-card__figure">
          <img src="${p.thumbnail || p.image || ''}" alt="${p.title}" class="product-card__image" loading="lazy">
        </figure>
        <h3 class="product-card__title">${p.title}</h3>
        <p class="product-card__desc">${(p.description || '').slice(0, 70)}...</p>
        <p class="product-card__price">$${p.price ? Math.round(p.price) : '—'}</p>
        <button class="product-card__button button api-add-btn"
          data-id="${p.id}"
          data-name="${p.title}"
          data-price="${Math.round(p.price) || 0}"
          data-image="${p.thumbnail || p.image || ''}">
          ADD TO CART
        </button>
      </article>`
      )
      .join('');
  }

  async function loadApiProducts(query) {
    // query === null означает "пользователь ещё ничего не искал" — не загружаем
    if (query === null) {
      if (apiGrid) apiGrid.innerHTML = '';
      setStatus('Введите запрос для поиска товаров');
      return;
    }

    renderApiSkeletons();
    setStatus(query ? `Поиск: "${query}"...` : 'Загрузка товаров...');
    console.log('[API] Запрос:', query || '(все electronics)');

    try {
      const products = query
        ? await ApiService.searchProducts(query)
        : await ApiService.getProducts();

      StorageService.saveApiCache(query, products);

      renderApiProducts(products);
      setStatus(
        query
          ? `Найдено: ${products.length} товаров по запросу "${query}"`
          : `Загружено ${products.length} товаров`
      );
      console.log('[API] Успешно:', products.length, 'товаров');
    } catch (error) {
      console.error('[API] Ошибка:', error.message);
      const cache = StorageService.loadApiCache();
      if (cache) {
        renderApiProducts(cache.products);
        if (searchInput) searchInput.value = cache.query || '';
        setStatus(
          `⚠ Офлайн. Кеш: ${cache.products.length} товаров (запрос: "${cache.query || 'все'}")`
        );
        console.log('[Офлайн] Загружен кеш:', cache.products.length, 'товаров');
      } else {
        if (apiGrid)
          apiGrid.innerHTML = `<div class="api-error">⚠ Нет соединения и нет кешированных данных.
          <button class="button button--primary" id="retry-api" style="margin-top:12px">Повторить</button></div>`;
        setStatus('Ошибка загрузки', true);
        document
          .getElementById('retry-api')
          ?.addEventListener('click', () => loadApiProducts(query));
      }
    }
  }

  searchBtn?.addEventListener('click', () => {
    const q = searchInput?.value.trim() || '';
    loadApiProducts(q);
  });
  searchInput?.addEventListener('keydown', e => {
    if (e.key === 'Enter') loadApiProducts(searchInput.value.trim() || '');
  });

  apiGrid?.addEventListener('click', e => {
    const btn = e.target.closest('.api-add-btn');
    if (!btn) return;
    addToCart({
      id: parseInt(btn.dataset.id),
      name: btn.dataset.name,
      price: parseInt(btn.dataset.price),
      image: btn.dataset.image,
    });
    btn.textContent = 'В КОРЗИНЕ ✓';
    btn.style.backgroundColor = '#00cc99';
    setTimeout(() => {
      btn.textContent = 'ADD TO CART';
      btn.style.backgroundColor = '';
    }, 1200);
  });

  // Старт: восстанавливаем последний поиск (null если не было)
  const lastSearch = StorageService.loadLastSearch();
  if (lastSearch !== null && searchInput) searchInput.value = lastSearch;
  await loadApiProducts(lastSearch); // null = не показываем ничего

  // ── Синхронизация при восстановлении соединения ───────────
  window.addEventListener('online', async () => {
    console.log('[Network] Соединение восстановлено');
    showNetworkToast(
      '✓ Соединение восстановлено. Данные обновляются...',
      '#00cc99'
    );
    cart = StorageService.loadCart();
    renderCart();
    const q = StorageService.loadLastSearch();
    if (q !== null) await loadApiProducts(q);
  });
  window.addEventListener('offline', () => {
    console.warn('[Network] Офлайн. Данные сохранены в LocalStorage.');
    showNetworkToast('⚠ Нет соединения. Работаем с кешем.', '#ff9900');
  });

  function showNetworkToast(msg, color) {
    document.querySelector('.network-toast')?.remove();
    const el = document.createElement('div');
    el.className = 'network-toast';
    Object.assign(el.style, {
      position: 'fixed',
      bottom: '24px',
      left: '50%',
      transform: 'translateX(-50%)',
      background: color,
      color: '#000',
      padding: '12px 24px',
      borderRadius: '25px',
      fontWeight: '700',
      zIndex: '9999',
      boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
    });
    el.textContent = msg;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 3500);
  }

  // ── Часть 6: тесты ───────────────────────────────────────
  await APITester.runAll();

  // ── Валидация формы ───────────────────────────────────────
  const validateEmail = email => /^[^\s@]+@[^\s@]+\.[^\s@]+/.test(email);
  const validateRequired = v => v.trim().length > 0;
  function showError(el, msg) {
    el.style.borderColor = 'red';
    if (!el.parentNode.querySelector('.error-message')) {
      const err = document.createElement('div');
      err.className = 'error-message';
      err.textContent = msg;
      el.parentNode.appendChild(err);
    }
  }
  function clearErrors(el) {
    el.style.borderColor = '';
    el.parentNode.querySelector('.error-message')?.remove();
  }

  const contactForm = document.querySelector('.contact-form');
  const nameInput = contactForm?.querySelector('#contact-name');
  const emailInput = contactForm?.querySelector('#contact-email');
  const msgInput = contactForm?.querySelector('#contact-message');

  nameInput?.addEventListener('blur', function () {
    clearErrors(this);
    if (!validateRequired(this.value)) showError(this, 'Поле обязательно');
  });
  emailInput?.addEventListener('blur', function () {
    clearErrors(this);
    if (!validateEmail(this.value)) showError(this, 'Введите корректный email');
  });
  msgInput?.addEventListener('blur', function () {
    clearErrors(this);
    if (!validateRequired(this.value)) showError(this, 'Напишите сообщение');
  });
  contactForm?.addEventListener('submit', function (e) {
    e.preventDefault();
    let ok = true;
    if (!validateRequired(nameInput?.value || '')) {
      showError(nameInput, 'Поле обязательно');
      ok = false;
    }
    if (!validateEmail(emailInput?.value || '')) {
      showError(emailInput, 'Введите корректный email');
      ok = false;
    }
    if (!validateRequired(msgInput?.value || '')) {
      showError(msgInput, 'Напишите сообщение');
      ok = false;
    }
    if (ok) {
      console.log('[Form] Отправлено:', Object.fromEntries(new FormData(this)));
      contactForm.innerHTML = `<div class="form-success"><span class="form-success__icon">✓</span><h3>Сообщение отправлено!</h3><p>Мы свяжемся с вами в ближайшее время.</p></div>`;
    }
  });

  // ── Бургер ────────────────────────────────────────────────
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
    mobileMenu.querySelectorAll('.nav__link').forEach(l =>
      l.addEventListener('click', () => {
        burger.classList.remove('header__burger--active');
        mobileMenu.classList.remove('header__mobile-menu--active');
        document.body.style.overflow = '';
      })
    );
    document.addEventListener('click', e => {
      if (!burger.contains(e.target) && !mobileMenu.contains(e.target)) {
        burger.classList.remove('header__burger--active');
        mobileMenu.classList.remove('header__mobile-menu--active');
        document.body.style.overflow = '';
      }
    });
  }
});

document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href !== '#') {
      e.preventDefault();
      document
        .querySelector(href)
        ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
