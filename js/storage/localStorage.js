const CART_KEY = 'techstore_cart';
const CACHE_KEY = 'techstore_api_cache';
const CACHE_TTL = 10 * 60 * 1000;

export const StorageService = {
  saveCart(cart) {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(cart));
      console.log('[LocalStorage] Корзина сохранена:', cart.length, 'товаров');
    } catch (e) {
      console.error('[LocalStorage] Ошибка корзины:', e);
    }
  },

  loadCart() {
    try {
      const cart = JSON.parse(localStorage.getItem(CART_KEY) || '[]');
      console.log('[LocalStorage] Корзина загружена:', cart.length, 'товаров');
      return cart;
    } catch {
      return [];
    }
  },

  clearCart() {
    localStorage.removeItem(CART_KEY);
  },

  saveApiCache(query, products) {
    try {
      const cache = { query, products, savedAt: Date.now() };
      localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
      console.log(
        '[LocalStorage] Кеш сохранён:',
        products.length,
        'товаров, запрос:',
        `"${query || 'все'}"`
      );
    } catch (e) {
      console.error('[LocalStorage] Ошибка кеша:', e);
    }
  },

  loadApiCache() {
    try {
      const data = localStorage.getItem(CACHE_KEY);
      if (!data) return null;
      const cache = JSON.parse(data);
      const age = Date.now() - cache.savedAt;
      if (age > CACHE_TTL) {
        localStorage.removeItem(CACHE_KEY);
        console.log('[LocalStorage] Кеш устарел (> 10 мин), удалён');
        return null;
      }
      const ageMin = Math.round(age / 60000);
      console.log(
        '[LocalStorage] Кеш загружен:',
        cache.products.length,
        'товаров, возраст:',
        ageMin,
        'мин'
      );
      return cache;
    } catch {
      return null;
    }
  },

  loadLastSearch() {
    try {
      const cache = JSON.parse(localStorage.getItem(CACHE_KEY) || 'null');
      return cache?.query || null; // null если не было поиска
    } catch {
      return null;
    }
  },

  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {}
  },

  get(key) {
    try {
      const d = localStorage.getItem(key);
      return d ? JSON.parse(d) : null;
    } catch {
      return null;
    }
  },

  isAvailable() {
    try {
      localStorage.setItem('__test__', '1');
      localStorage.removeItem('__test__');
      return true;
    } catch {
      return false;
    }
  },
};
