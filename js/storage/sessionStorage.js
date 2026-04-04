// js/storage/sessionStorage.js
// Сервис для работы с SessionStorage
// SessionStorage хранит данные только в рамках одной вкладки/сессии.
// Используем для хранения последнего поискового запроса и результатов.

const SEARCH_KEY = 'techstore_last_search';
const RESULTS_KEY = 'techstore_search_results';

export const SessionStorageService = {
  // Сохранить последний поисковый запрос
  saveSearch(query) {
    try {
      sessionStorage.setItem(SEARCH_KEY, query);
      console.log('Поиск сохранён в SessionStorage:', query);
    } catch (error) {
      console.error('Ошибка SessionStorage:', error);
    }
  },

  // Загрузить последний поисковый запрос
  loadSearch() {
    try {
      return sessionStorage.getItem(SEARCH_KEY) || '';
    } catch {
      return '';
    }
  },

  // Сохранить результаты поиска
  saveResults(results) {
    try {
      sessionStorage.setItem(RESULTS_KEY, JSON.stringify(results));
    } catch (error) {
      console.error('Ошибка сохранения результатов:', error);
    }
  },

  // Загрузить результаты поиска
  loadResults() {
    try {
      const data = sessionStorage.getItem(RESULTS_KEY);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  // Очистить сессионные данные
  clear() {
    sessionStorage.removeItem(SEARCH_KEY);
    sessionStorage.removeItem(RESULTS_KEY);
  },
};
