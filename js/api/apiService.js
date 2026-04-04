// js/storage/apiTester.js

export class APITester {
  static async testApiConnection(apiService) {
    const scenarios = [
      { name: 'Успешный запрос', params: {} },
      { name: 'Запрос с параметрами', params: { q: 'test' } },
      { name: 'Неверные параметры', params: { invalid: 'param' } },
    ];

    console.group('🧪 Тестирование API');
    for (const scenario of scenarios) {
      try {
        console.log(`Testing: ${scenario.name}`);
        // Предполагаем, что у apiService есть метод get
        // Если метод называется иначе, замените 'get' на нужное имя
        if (typeof apiService.get === 'function') {
          const result = await apiService.get('/top-headlines', {
            ...scenario.params,
            category: 'technology',
          });
          console.log('✅ Success:', result?.status || result);
        } else {
          console.warn('⚠️ Метод get не найден в apiService');
        }
      } catch (error) {
        console.log('❌ Error:', error.message);
      }
    }
    console.groupEnd();
  }

  static testOfflineFunctionality(storageService) {
    console.group('📦 Тестирование LocalStorage');
    const testData = { test: 'offline_data', timestamp: Date.now() };

    try {
      storageService.set('offline_test', testData);
      const retrieved = storageService.get('offline_test');

      const isPass = retrieved && retrieved.test === 'offline_data';
      console.log(`Offline test: ${isPass ? '✅ PASS' : '❌ FAIL'}`, retrieved);

      // Очистка после теста
      storageService.remove('offline_test');
    } catch (error) {
      console.log('❌ Storage Error:', error.message);
    }
    console.groupEnd();
  }
}

// Делаем функцию доступной глобально для консоли, даже внутри модуля
if (typeof window !== 'undefined') {
  window.runDiagnostics = async function (apiService, storageService) {
    console.clear();
    console.log('🚀 Запуск диагностики...');

    // Проверка сети
    if (!navigator.onLine) {
      console.warn(
        '⚠️ Вы сейчас оффлайн! Некоторые тесты API могут не пройти.'
      );
    } else {
      console.log('🌐 Сеть активна');
    }

    await APITester.testApiConnection(apiService);
    APITester.testOfflineFunctionality(storageService);

    console.log('🏁 Диагностика завершена');
  };
}
