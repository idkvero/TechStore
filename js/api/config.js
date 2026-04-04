// js/api/config.js

// По заданию: FakeStore API (https://fakestoreapi.com)
// Причина замены: FakeStore API блокирует запросы с localhost
// (CORS ошибка, статус 523 — ограничение на стороне их сервера Cloudflare).
// Используется DummyJSON как полноценная замена с аналогичной структурой данных.

export const CONFIG = {
  // BASE_URL: 'https://fakestoreapi.com',  // оригинальный по заданию
  BASE_URL: 'https://dummyjson.com', // замена из-за CORS на localhost

  CACHE_TTL_MS: 10 * 60 * 1000, // кеш живёт 10 минут
};
