// src/__tests__/utils/formatters.test.js
// Unit-тесты для утилит форматирования TechStore
// Запуск: npm test

import {
  formatCurrency,
  calculateTotal,
  truncateText,
  filterProducts,
  parseJSON,
  validateEmail,
  calculateItemCount,
} from '../../utils/formatters'

// ─────────────────────────────────────────
// describe() группирует тесты по теме
// test() / it() — один тест-кейс
// expect() — что проверяем
// .toBe()   — строгое равенство (===)
// .toEqual() — глубокое равенство объектов
// .toBeNull() — ожидаем null
// .toBeTruthy() / .toBeFalsy() — правдивое/ложное значение
// .toContain() — содержит подстроку или элемент
// .toHaveLength() — длина массива или строки
// ─────────────────────────────────────────

// ══════════════════════════════════════════
describe('formatCurrency — форматирование цены', () => {
// ══════════════════════════════════════════

  /**
   * @description Тестирует функцию форматирования цены
   * @case нормальная цена — целое число
   * @case нормальная цена — дробное число
   * @case нулевая цена
   * @case отрицательная цена
   * @case не число
   * @case другая валюта
   */

  test('корректно форматирует целое число', () => {
    // Arrange (подготовка) — задаём входные данные
    const price = 299
    // Act (действие) — вызываем функцию
    const result = formatCurrency(price)
    // Assert (проверка) — проверяем результат
    expect(result).toBe('$299')
  })

  test('корректно форматирует дробное число', () => {
    expect(formatCurrency(299.99)).toBe('$299.99')
  })

  test('форматирует нулевую цену', () => {
    expect(formatCurrency(0)).toBe('$0')
  })

  test('возвращает ошибку для отрицательной цены', () => {
    expect(formatCurrency(-10)).toBe('Неверная цена')
  })

  test('возвращает ошибку если передана строка', () => {
    expect(formatCurrency('abc')).toBe('Неверная цена')
  })

  test('возвращает ошибку для NaN', () => {
    expect(formatCurrency(NaN)).toBe('Неверная цена')
  })

  test('поддерживает другие валюты', () => {
    expect(formatCurrency(100, '€')).toBe('€100')
    expect(formatCurrency(100, '₽')).toBe('₽100')
  })
})

// ══════════════════════════════════════════
describe('calculateTotal — расчёт итоговой суммы корзины', () => {
// ══════════════════════════════════════════

  /**
   * @description Тестирует расчёт суммы товаров в корзине
   * @case нормальная корзина с несколькими товарами
   * @case пустая корзина
   * @case один товар с qty > 1
   * @case некорректные данные
   */

  test('корректно считает сумму нескольких товаров', () => {
    const items = [
      { price: 299, qty: 1 },
      { price: 199, qty: 2 },
    ]
    // 299*1 + 199*2 = 299 + 398 = 697
    expect(calculateTotal(items)).toBe(697)
  })

  test('возвращает 0 для пустой корзины', () => {
    expect(calculateTotal([])).toBe(0)
  })

  test('возвращает 0 если передан не массив', () => {
    expect(calculateTotal(null)).toBe(0)
    expect(calculateTotal(undefined)).toBe(0)
    expect(calculateTotal('строка')).toBe(0)
  })

  test('корректно считает с qty > 1', () => {
    const items = [{ price: 100, qty: 5 }]
    expect(calculateTotal(items)).toBe(500)
  })

  test('обрабатывает товары без цены', () => {
    const items = [
      { price: 100, qty: 1 },
      { qty: 2 },            // нет price — считается как 0
    ]
    expect(calculateTotal(items)).toBe(100)
  })

  test('обрабатывает дробные цены', () => {
    const items = [{ price: 9.99, qty: 3 }]
    // 9.99 * 3 = 29.97
    expect(calculateTotal(items)).toBeCloseTo(29.97, 2)
  })
})

// ══════════════════════════════════════════
describe('truncateText — обрезка длинного текста', () => {
// ══════════════════════════════════════════

  /**
   * @description Тестирует обрезку текста
   * @case длинный текст — должен обрезаться
   * @case короткий текст — не должен изменяться
   * @case текст равный лимиту — не должен обрезаться
   * @case некорректный ввод
   */

  test('обрезает длинный текст и добавляет многоточие', () => {
    const text = 'Беспроводные наушники с шумоподавлением'
    const result = truncateText(text, 15)
    expect(result).toBe('Беспроводные на...')
    expect(result).toContain('...')
  })

  test('не обрезает короткий текст', () => {
    const text = 'Короткий'
    expect(truncateText(text, 20)).toBe('Короткий')
  })

  test('не обрезает текст равный лимиту', () => {
    const text = 'Ровно'
    expect(truncateText(text, 5)).toBe('Ровно')
  })

  test('возвращает пустую строку для не-строки', () => {
    expect(truncateText(null, 10)).toBe('')
    expect(truncateText(123, 10)).toBe('')
  })

  test('возвращает текст без изменений при некорректном лимите', () => {
    expect(truncateText('Текст', -1)).toBe('Текст')
    expect(truncateText('Текст', 0)).toBe('Текст')
  })
})

// ══════════════════════════════════════════
describe('filterProducts — фильтрация товаров', () => {
// ══════════════════════════════════════════

  /**
   * @description Тестирует фильтрацию массива товаров
   * @case фильтр по категории
   * @case фильтр по цене
   * @case фильтр по обоим параметрам
   * @case категория 'all' — показывать все
   * @case пустой массив
   */

  // Тестовые данные — используются во всех тестах этой группы
  const products = [
    { id: 1, name: 'Headphones', category: 'audio',     price: 299 },
    { id: 2, name: 'Laptop',     category: 'computers', price: 1499 },
    { id: 3, name: 'Earbuds',    category: 'audio',     price: 199 },
    { id: 4, name: 'Watch',      category: 'wearables', price: 399 },
  ]

  test('возвращает все товары при category="all"', () => {
    const result = filterProducts(products, 'all', Infinity)
    expect(result).toHaveLength(4)
  })

  test('фильтрует по категории', () => {
    const result = filterProducts(products, 'audio', Infinity)
    expect(result).toHaveLength(2)
    // Проверяем что в результате только аудио-товары
    result.forEach(p => expect(p.category).toBe('audio'))
  })

  test('фильтрует по максимальной цене', () => {
    const result = filterProducts(products, 'all', 400)
    expect(result).toHaveLength(3) // headphones 299, earbuds 199, watch 399
    // Ни один товар не должен быть дороже 400
    result.forEach(p => expect(p.price).toBeLessThanOrEqual(400))
  })

  test('комбинирует фильтры по категории и цене', () => {
    const result = filterProducts(products, 'audio', 200)
    expect(result).toHaveLength(1)
    expect(result[0].name).toBe('Earbuds')
  })

  test('возвращает пустой массив если ничего не найдено', () => {
    const result = filterProducts(products, 'tablets', Infinity)
    expect(result).toHaveLength(0)
  })

  test('возвращает пустой массив для не-массива', () => {
    expect(filterProducts(null)).toEqual([])
    expect(filterProducts(undefined)).toEqual([])
  })

  test('возвращает пустой массив для пустого входного массива', () => {
    expect(filterProducts([])).toEqual([])
  })
})

// ══════════════════════════════════════════
describe('parseJSON — безопасный парсинг JSON', () => {
// ══════════════════════════════════════════

  /**
   * @description Тестирует парсинг JSON строк
   * @case валидный JSON объект
   * @case валидный JSON массив
   * @case невалидный JSON — должен вернуть null
   * @case пустая строка
   */

  test('корректно парсит JSON-объект', () => {
    const json = '{"name": "iPhone", "price": 999}'
    const result = parseJSON(json)
    // toEqual проверяет глубокое равенство объектов
    expect(result).toEqual({ name: 'iPhone', price: 999 })
  })

  test('корректно парсит JSON-массив', () => {
    const json = '[1, 2, 3]'
    expect(parseJSON(json)).toEqual([1, 2, 3])
  })

  test('возвращает null для невалидного JSON', () => {
    expect(parseJSON('{invalid json}')).toBeNull()
    expect(parseJSON('undefined')).toBeNull()
  })

  test('возвращает null для пустой строки', () => {
    expect(parseJSON('')).toBeNull()
  })

  test('корректно парсит вложенные объекты', () => {
    const json = '{"product": {"id": 1, "name": "Laptop"}}'
    const result = parseJSON(json)
    expect(result.product.name).toBe('Laptop')
  })
})

// ══════════════════════════════════════════
describe('validateEmail — валидация email', () => {
// ══════════════════════════════════════════

  test('корректный email возвращает true', () => {
    expect(validateEmail('user@example.com')).toBe(true)
    expect(validateEmail('test.name@domain.ru')).toBe(true)
  })

  test('email без @ возвращает false', () => {
    expect(validateEmail('userexample.com')).toBe(false)
  })

  test('email без домена возвращает false', () => {
    expect(validateEmail('user@')).toBe(false)
  })

  test('пустая строка возвращает false', () => {
    expect(validateEmail('')).toBe(false)
  })

  test('не строка возвращает false', () => {
    expect(validateEmail(null)).toBe(false)
    expect(validateEmail(123)).toBe(false)
  })
})

// ══════════════════════════════════════════
describe('calculateItemCount — количество товаров в корзине', () => {
// ══════════════════════════════════════════

  test('считает общее количество с учётом qty', () => {
    const items = [
      { price: 299, qty: 1 },
      { price: 199, qty: 3 },
    ]
    expect(calculateItemCount(items)).toBe(4)
  })

  test('возвращает 0 для пустой корзины', () => {
    expect(calculateItemCount([])).toBe(0)
  })

  test('возвращает 0 для не-массива', () => {
    expect(calculateItemCount(null)).toBe(0)
  })
})
