// js/utils/apiTester.js
// Часть 6. Тестирование и обработка ошибок
import { ApiService } from '../api/apiService.js';
import { StorageService } from '../storage/localStorage.js';

export class APITester {
  // ── Тест API-соединения ───────────────────────────────────
  static async testApiConnection() {
    console.group('🧪 [APITester] Тестирование API-соединения');

    const scenarios = [
      {
        name: 'Успешный запрос (все товары)',
        fn: () => ApiService.getProducts(),
      },
      {
        name: 'Запрос с параметрами (поиск "phone")',
        fn: () => ApiService.searchProducts('phone'),
      },
      {
        name: 'Поиск с пустым запросом',
        fn: () => ApiService.searchProducts(''),
      },
      {
        name: 'Поиск несуществующего товара',
        fn: () => ApiService.searchProducts('xyznonexistent999'),
      },
    ];

    for (const scenario of scenarios) {
      try {
        console.log(`  ▶ Testing: ${scenario.name}`);
        const result = await scenario.fn();
        console.log(
          `  ✅ Success: получено ${Array.isArray(result) ? result.length : 1} записей`
        );
      } catch (error) {
        console.log(`  ❌ Error: ${error.message}`);
      }
    }

    console.groupEnd();
  }

  // ── Тест офлайн-функциональности ─────────────────────────
  static testOfflineFunctionality() {
    console.group('🧪 [APITester] Тестирование офлайн-режима (LocalStorage)');

    // Тест 1: запись и чтение
    const testData = { test: 'offline_data', ts: Date.now() };
    StorageService.set('offline_test', testData);
    const retrieved = StorageService.get('offline_test');
    console.log(
      '  Тест 1 — запись/чтение:',
      retrieved?.test === 'offline_data' ? '✅ PASS' : '❌ FAIL'
    );

    // Тест 2: корзина
    const mockCart = [{ id: 1, name: 'Test Product', price: 99, qty: 2 }];
    StorageService.saveCart(mockCart);
    const loadedCart = StorageService.loadCart();
    console.log(
      '  Тест 2 — корзина:',
      loadedCart.length === 1 && loadedCart[0].name === 'Test Product'
        ? '✅ PASS'
        : '❌ FAIL'
    );

    // Тест 3: API-кеш
    const mockProducts = [{ id: 1, title: 'Cached Product', price: 50 }];
    StorageService.saveApiCache('test', mockProducts);
    const cache = StorageService.loadApiCache();
    console.log(
      '  Тест 3 — API-кеш:',
      cache?.products?.length === 1 ? '✅ PASS' : '❌ FAIL'
    );

    // Тест 4: доступность LocalStorage
    console.log(
      '  Тест 4 — LocalStorage доступен:',
      StorageService.isAvailable() ? '✅ PASS' : '❌ FAIL'
    );

    // Очистка тестовых данных
    localStorage.removeItem('offline_test');
    console.log('  Тестовые данные очищены');
    console.groupEnd();
  }

  // ── Тест обработки ошибок API ─────────────────────────────
  static async testErrorHandling() {
    console.group('🧪 [APITester] Тестирование обработки ошибок');

    // Симуляция недоступного API
    try {
      const response = await fetch(
        'https://dummyjson.com/nonexistent-endpoint-404'
      );
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
    } catch (e) {
      console.log('  ✅ Ошибка 404 поймана корректно:', e.message);
    }

    // Симуляция таймаута
    try {
      const controller = new AbortController();
      setTimeout(() => controller.abort(), 1); // таймаут 1мс
      await fetch('https://dummyjson.com/products', {
        signal: controller.signal,
      });
    } catch (e) {
      console.log('  ✅ Таймаут/прерывание обработан корректно:', e.name);
    }

    console.groupEnd();
  }

  // ── Запустить все тесты ───────────────────────────────────
  static async runAll() {
    console.group('🚀 [APITester] Запуск всех тестов');
    console.log('Время:', new Date().toLocaleTimeString());

    this.testOfflineFunctionality();
    await this.testApiConnection();
    await this.testErrorHandling();

    console.log('✅ Все тесты завершены');
    console.groupEnd();
  }
}
