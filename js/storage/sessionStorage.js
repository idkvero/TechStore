// Модуль для работы с sessionStorage
class SessionStorageService {
  /**
   * Сохраняет данные в sessionStorage
   * @param {string} key - Ключ
   * @param {*} value - Значение
   */
  set(key, value) {
    try {
      const serializedValue = JSON.stringify(value);
      sessionStorage.setItem(key, serializedValue);
    } catch (error) {
      console.error('Error saving to sessionStorage:', error);
    }
  }

  /**
   * Получает данные из sessionStorage
   * @param {string} key - Ключ
   * @returns {*} - Значение или null
   */
  get(key) {
    try {
      const serializedValue = sessionStorage.getItem(key);
      if (serializedValue === null) {
        return null;
      }
      return JSON.parse(serializedValue);
    } catch (error) {
      console.error('Error reading from sessionStorage:', error);
      return null;
    }
  }

  /**
   * Удаляет данные из sessionStorage
   * @param {string} key - Ключ
   */
  remove(key) {
    try {
      sessionStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing from sessionStorage:', error);
    }
  }

  /**
   * Очищает все данные из sessionStorage
   */
  clear() {
    try {
      sessionStorage.clear();
    } catch (error) {
      console.error('Error clearing sessionStorage:', error);
    }
  }

  /**
   * Проверяет существование ключа
   * @param {string} key - Ключ
   * @returns {boolean}
   */
  has(key) {
    return sessionStorage.getItem(key) !== null;
  }
}

export const sessionStorageService = new SessionStorageService();
