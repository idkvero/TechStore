// js/storage/localStorage.js

const CART_KEY = 'techstore_cart';
const CACHE_KEY = 'techstore_api_cache';
const SEARCH_KEY = 'techstore_last_search';

export const StorageService = {
  // ── Корзина ──────────────────────────────────────────────
  saveCart(cart) {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(cart));
      console.log('[LocalStorage] Корзина сохранена:', cart.length, 'товаров');
    } catch (e) {
      console.error('[LocalStorage] Ошибка сохранения корзины:', e);
    }
  },

  loadCart() {
    try {
      const data = localStorage.getItem(CART_KEY);
      const cart = data ? JSON.parse(data) : [];
      console.log('[LocalStorage] Корзина загружена:', cart.length, 'товаров');
      return cart;
    } catch (e) {
      console.error('[LocalStorage] Ошибка загрузки корзины:', e);
      return [];
    }
  },

  clearCart() {
    localStorage.removeItem(CART_KEY);
    console.log('[LocalStorage] Корзина очищена');
  },

  // ── Кеш API-товаров (для офлайн-режима) ──────────────────
  saveApiCache(query, products) {
    try {
      const cache = { query, products, savedAt: Date.now() };
      localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
      localStorage.setItem(SEARCH_KEY, query);
      console.log(
        '[LocalStorage] API-кеш сохранён:',
        products.length,
        'товаров, запрос:',
        query || '(все)'
      );
    } catch (e) {
      console.error('[LocalStorage] Ошибка сохранения кеша:', e);
    }
  },

  loadApiCache() {
    try {
      const data = localStorage.getItem(CACHE_KEY);
      if (!data) return null;
      const cache = JSON.parse(data);
      const ageMin = Math.round((Date.now() - cache.savedAt) / 60000);
      console.log(
        '[LocalStorage] Кеш загружен, возраст:',
        ageMin,
        'мин, товаров:',
        cache.products.length
      );
      return cache;
    } catch (e) {
      console.error('[LocalStorage] Ошибка загрузки кеша:', e);
      return null;
    }
  },

  loadLastSearch() {
    return localStorage.getItem(SEARCH_KEY) || '';
  },

  // ── Проверка доступности ──────────────────────────────────
  isAvailable() {
    try {
      localStorage.setItem('__test__', '1');
      localStorage.removeItem('__test__');
      return true;
    } catch {
      return false;
    }
  },

  // ── Универсальные методы (для APITester) ─────────────────
  set(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  },

  get(key) {
    try {
      const d = localStorage.getItem(key);
      return d ? JSON.parse(d) : null;
    } catch {
      return null;
    }
  },
};
