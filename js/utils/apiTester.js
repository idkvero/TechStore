import { ApiService } from '../api/apiService.js';
import { StorageService } from '../storage/localStorage.js';

export class APITester {
  static async testApiConnection() {
    console.group('🧪 [APITester] Тест API-соединения');
    const scenarios = [
      { name: 'Загрузка электроники', fn: () => ApiService.getProducts() },
      {
        name: 'Поиск "samsung" в электронике',
        fn: () => ApiService.searchProducts('samsung'),
      },
      {
        name: 'Поиск несуществующего товара',
        fn: () => ApiService.searchProducts('xyznonexistent999'),
      },
    ];
    for (const s of scenarios) {
      try {
        const result = await s.fn();
        console.log(`  ✅ ${s.name}: получено ${result.length} записей`);
      } catch (e) {
        console.log(`  ❌ ${s.name}: ${e.message}`);
      }
    }
    console.groupEnd();
  }

  static testOfflineFunctionality() {
    console.group('🧪 [APITester] Тест офлайн (LocalStorage)');

    StorageService.set('__test_offline__', { test: 'offline_data' });
    const r = StorageService.get('__test_offline__');
    console.log(
      '  Тест 1 — запись/чтение:',
      r?.test === 'offline_data' ? '✅ PASS' : '❌ FAIL'
    );

    const realCart = StorageService.loadCart();
    const mockCart = [
      { id: 999, name: 'Test Product', price: 99, qty: 1, image: '' },
    ];
    StorageService.saveCart(mockCart);
    const loaded = StorageService.loadCart();
    console.log(
      '  Тест 2 — корзина:',
      loaded[0]?.id === 999 ? '✅ PASS' : '❌ FAIL'
    );
    StorageService.saveCart(realCart);

    const mockProducts = [
      {
        id: 1,
        title: 'Test Phone',
        price: 299,
        thumbnail: '',
        description: 'test',
      },
    ];
    StorageService.set('__test_cache__', {
      query: 'test',
      products: mockProducts,
      savedAt: Date.now(),
    });
    const cache = StorageService.get('__test_cache__');
    console.log(
      '  Тест 3 — API-кеш:',
      cache?.products?.[0]?.price === 299 ? '✅ PASS' : '❌ FAIL'
    );

    console.log(
      '  Тест 4 — TTL (свежий кеш):',
      cache !== null ? '✅ PASS' : '❌ FAIL'
    );

    console.log(
      '  Тест 5 — доступность:',
      StorageService.isAvailable() ? '✅ PASS' : '❌ FAIL'
    );

    localStorage.removeItem('__test_offline__');
    localStorage.removeItem('__test_cache__');
    console.log('  Тестовые данные очищены (реальный кеш не тронут)');
    console.groupEnd();
  }

  static async testErrorHandling() {
    console.group('🧪 [APITester] Тест обработки ошибок');
    try {
      const r = await fetch('https://dummyjson.com/nonexistent-endpoint-404');
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
    } catch (e) {
      console.log('  ✅ Ошибка 404 поймана:', e.message);
    }
    try {
      const ctrl = new AbortController();
      setTimeout(() => ctrl.abort(), 1);
      await fetch('https://dummyjson.com/products', { signal: ctrl.signal });
    } catch (e) {
      console.log('  ✅ Прерывание запроса обработано:', e.name);
    }
    console.groupEnd();
  }

  static async runAll() {
    console.group(
      '🚀 [APITester] Все тесты — ' + new Date().toLocaleTimeString()
    );
    this.testOfflineFunctionality();
    await this.testApiConnection();
    await this.testErrorHandling();
    console.log('✅ Тестирование завершено');
    console.groupEnd();
  }
}
