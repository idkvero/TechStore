// Модуль для работы с localStorage
class LocalStorageService {
  /**
   * Сохраняет данные в localStorage
   * @param {string} key - Ключ
   * @param {*} value - Значение
   */
  set(key, value) {
    try {
      const serializedValue = JSON.stringify(value);
      localStorage.setItem(key, serializedValue);
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }

  /**
   * Получает данные из localStorage
   * @param {string} key - Ключ
   * @returns {*} - Значение или null
   */
  get(key) {
    try {
      const serializedValue = localStorage.getItem(key);
      if (serializedValue === null) {
        return null;
      }
      return JSON.parse(serializedValue);
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return null;
    }
  }

  /**
   * Удаляет данные из localStorage
   * @param {string} key - Ключ
   */
  remove(key) {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing from localStorage:', error);
    }
  }

  /**
   * Очищает все данные из localStorage
   */
  clear() {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  }

  /**
   * Проверяет существование ключа
   * @param {string} key - Ключ
   * @returns {boolean}
   */
  has(key) {
    return localStorage.getItem(key) !== null;
  }
}

export const localStorageService = new LocalStorageService();
