// Конфигурация API для NewsAPI
export const API_CONFIG = {
  BASE_URL: 'https://newsapi.org/v2',
  API_KEY: '1ba3bc98a07a4c4da35157c9abe3c440',
  DEFAULT_CATEGORY: 'technology',
  DEFAULT_COUNTRY: 'us',
  DEFAULT_PAGE_SIZE: 10,
};

export const ENDPOINTS = {
  TOP_HEADLINES: '/top-headlines',
  EVERYTHING: '/everything',
  SOURCES: '/top-headlines/sources',
};
