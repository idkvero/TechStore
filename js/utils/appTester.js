// ============================================================
// МОДУЛЬ ТЕСТИРОВАНИЯ (appTester.js)
// ============================================================

export const AppTester = {
  // Тестирование API
  async testAPI() {
    console.group('🧪 Тестирование API (NewsAPI)');

    // Сценарий 1: Успешный запрос (топ новости)
    console.log('1. Тест: Успешный запрос (Топ новости)...');
    try {
      // Используем глобальную переменную NEWS_CONFIG из script.js
      if (typeof NEWS_CONFIG === 'undefined') {
        throw new Error(
          'Конфигурация NEWS_CONFIG не найдена. Загрузите script.js первым.'
        );
      }

      const url = `${NEWS_CONFIG.baseUrl}/top-headlines?category=technology&country=us&apiKey=${NEWS_CONFIG.apiKey}`;
      const start = performance.now();
      const response = await fetch(url);
      const data = await response.json();
      const duration = (performance.now() - start).toFixed(2);

      if (data.status === 'ok') {
        console.log(
          `✅ УСПЕХ: Получено ${data.totalResults} статей за ${duration}мс`
        );
      } else {
        console.error(`❌ ОШИБКА API: ${data.message}`);
      }
    } catch (error) {
      console.error(`❌ ОШИБКА СОЕДИНЕНИЯ: ${error.message}`);
    }

    // Сценарий 2: Поиск с параметрами
    console.log('2. Тест: Поиск по запросу "AI"...');
    try {
      const url = `${NEWS_CONFIG.baseUrl}/everything?q=AI&apiKey=${NEWS_CONFIG.apiKey}`;
      const response = await fetch(url);
      const data = await response.json();
      if (data.status === 'ok') {
        console.log(`✅ УСПЕХ: Найдено ${data.totalResults} статей про AI`);
      }
    } catch (error) {
      console.error(`❌ ОШИБКА: ${error.message}`);
    }

    // Сценарий 3: Неверный ключ (эмуляция ошибки)
    console.log('3. Тест: Неверный API ключ (ожидаем ошибку 401)...');
    try {
      const url = `${NEWS_CONFIG.baseUrl}/top-headlines?apiKey=INVALID_KEY_123`;
      const response = await fetch(url);
      const data = await response.json();
      if (response.status === 401) {
        console.log(
          '✅ УСПЕХ: Ошибка корректно обработана сервером (401 Unauthorized)'
        );
      } else {
        console.warn('⚠️ Предупреждение: Ошибка не возвращена как ожидалось');
      }
    } catch (error) {
      console.error(`❌ ОШИБКА СЕТИ: ${error.message}`);
    }

    console.groupEnd();
  },

  // Тестирование Хранилища (LocalStorage)
  testStorage() {
    console.group('💾 Тестирование LocalStorage');

    const testData = {
      id: 999,
      title: 'Тестовая новость',
      timestamp: new Date().toISOString(),
      isOffline: true,
    };
    const key = 'app_test_data';

    try {
      // Запись
      localStorage.setItem(key, JSON.stringify(testData));
      console.log('✅ Запись в хранилище успешна');

      // Чтение
      const raw = localStorage.getItem(key);
      const parsed = JSON.parse(raw);

      if (parsed.title === 'Тестовая новость' && parsed.isOffline === true) {
        console.log('✅ Чтение и парсинг данных успешны');
        console.log('Полученные данные:', parsed);
      } else {
        console.error('❌ Данные не совпадают с исходными');
      }

      // Очистка
      localStorage.removeItem(key);
      console.log('✅ Тестовые данные удалены');
    } catch (error) {
      console.error('❌ Ошибка работы с хранилищем:', error.message);
    }

    console.groupEnd();
  },

  // Проверка состояния сети
  checkNetworkStatus() {
    console.group('🌐 Статус сети');
    if (navigator.onLine) {
      console.log('✅ Статус: ONLINE (Интернет подключен)');
      console.log(
        `Тип соединения: ${navigator.connection ? navigator.connection.effectiveType : 'Неизвестно'}`
      );
    } else {
      console.warn('⚠️ Статус: OFFLINE (Интернет отключен)');
      console.log('Приложение должно работать в режиме кэша.');
    }
    console.groupEnd();
  },

  // Запуск всех тестов
  runAll() {
    console.clear();
    console.log(
      '%c🚀 ЗАПУСК ПОЛНОЙ ДИАГНОСТИКИ ПРИЛОЖЕНИЯ',
      'color: #00cc99; font-size: 16px; font-weight: bold;'
    );
    this.checkNetworkStatus();
    this.testStorage();
    this.testAPI().then(() => {
      console.log(
        '%c✅ Все тесты завершены.',
        'color: green; font-weight: bold;'
      );
    });
  },
};

// Слушатели событий сети для демонстрации
window.addEventListener('offline', () => {
  console.warn('📡 Событие: Интернет отключен! Активирован оффлайн-режим.');
});

window.addEventListener('online', () => {
  console.log('📡 Событие: Интернет подключен! Синхронизация...');
  // Авто-обновление новостей при появлении сети
  if (typeof fetchTechNews === 'function') {
    setTimeout(fetchTechNews, 1000);
  }
});

// Вывод инструкции в консоль при загрузке модуля
console.log(
  '%c💡 Для запуска тестов введите: AppTester.runAll()',
  'background: #222; color: #fff; padding: 5px; border-radius: 3px;'
);
