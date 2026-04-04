// js/api/config.js
// Конфигурация API
// API-ключи хранятся в .env (для серверных проектов).
// DummyJSON — публичный API, ключ не требуется.
// Для Stripe/Shopify: ключ задаётся через переменную окружения,
// никогда не коммитится в git (.env добавлен в .gitignore).

export const CONFIG = {
  BASE_URL: 'https://dummyjson.com',
  PRODUCTS_LIMIT: 12,
  // API_KEY: process.env.API_KEY  // пример для серверного окружения
};
