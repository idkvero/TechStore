const SEARCH_KEY = 'techstore_last_search';
const RESULTS_KEY = 'techstore_search_results';

export const SessionStorageService = {
  saveSearch(query) {
    try {
      sessionStorage.setItem(SEARCH_KEY, query);
      console.log('Поиск сохранён в SessionStorage:', query);
    } catch (error) {
      console.error('Ошибка SessionStorage:', error);
    }
  },

  loadSearch() {
    try {
      return sessionStorage.getItem(SEARCH_KEY) || '';
    } catch {
      return '';
    }
  },

  saveResults(results) {
    try {
      sessionStorage.setItem(RESULTS_KEY, JSON.stringify(results));
    } catch (error) {
      console.error('Ошибка сохранения результатов:', error);
    }
  },

  loadResults() {
    try {
      const data = sessionStorage.getItem(RESULTS_KEY);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  clear() {
    sessionStorage.removeItem(SEARCH_KEY);
    sessionStorage.removeItem(RESULTS_KEY);
  },
};
