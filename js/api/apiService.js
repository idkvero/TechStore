// js/api/apiService.js
// Сервис для HTTP-запросов к DummyJSON API

import { CONFIG } from './config.js';

// Универсальный fetch с обработкой ошибок
async function request(endpoint) {
  const response = await fetch(`${CONFIG.BASE_URL}${endpoint}`);
  if (!response.ok) {
    throw new Error(`Ошибка API: ${response.status} ${response.statusText}`);
  }
  return response.json();
}

export const ApiService = {
  // Загрузить все товары
  async getProducts() {
    const data = await request(`/products?limit=${CONFIG.PRODUCTS_LIMIT}`);
    return data.products;
  },

  // Поиск товаров по запросу
  async searchProducts(query) {
    const data = await request(
      `/products/search?q=${encodeURIComponent(query)}`
    );
    return data.products;
  },

  // Загрузить категории
  async getCategories() {
    return request('/products/categories');
  },
};
