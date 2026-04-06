// src/utils/formatters.js
// Утилиты для форматирования данных в TechStore
// Именно эти функции будем тестировать в лабораторной работе №8

/**
 * Форматирует цену товара в строку с символом валюты
 * @param {number} price - цена товара
 * @param {string} currency - символ валюты (по умолчанию '$')
 * @returns {string} отформатированная цена, например '$299'
 */
export function formatCurrency(price, currency = '$') {
  // Проверяем что price — число и не отрицательное
  if (typeof price !== 'number' || isNaN(price)) {
    return 'Неверная цена'
  }
  if (price < 0) {
    return 'Неверная цена'
  }
  // toFixed(2) округляет до двух знаков после запятой
  // Убираем лишние нули: 299.00 → 299, 299.50 → 299.50
  const formatted = price % 1 === 0
    ? price.toString()
    : price.toFixed(2)

  return `${currency}${formatted}`
}

/**
 * Вычисляет итоговую сумму корзины
 * @param {Array} items - массив товаров [{price, qty}, ...]
 * @returns {number} итоговая сумма
 */
export function calculateTotal(items) {
  // Проверяем что передан массив
  if (!Array.isArray(items)) return 0
  // Пустая корзина — сумма 0
  if (items.length === 0) return 0

  // reduce() суммирует price * qty каждого товара
  return items.reduce((sum, item) => {
    const price = typeof item.price === 'number' ? item.price : 0
    const qty   = typeof item.qty   === 'number' ? item.qty   : 0
    return sum + price * qty
  }, 0)
}

/**
 * Обрезает длинный текст и добавляет '...'
 * @param {string} text - исходный текст
 * @param {number} maxLength - максимальная длина
 * @returns {string} обрезанный текст
 */
export function truncateText(text, maxLength) {
  if (typeof text !== 'string') return ''
  if (typeof maxLength !== 'number' || maxLength <= 0) return text
  // Если текст короче лимита — возвращаем как есть
  if (text.length <= maxLength) return text
  // Обрезаем и добавляем '...'
  return text.slice(0, maxLength) + '...'
}

/**
 * Фильтрует товары по категории и максимальной цене
 * @param {Array} products - массив всех товаров
 * @param {string} category - категория ('all' = все)
 * @param {number} maxPrice - максимальная цена
 * @returns {Array} отфильтрованный массив
 */
export function filterProducts(products, category = 'all', maxPrice = Infinity) {
  if (!Array.isArray(products)) return []

  return products.filter(product => {
    const matchCategory = category === 'all' || product.category === category
    const matchPrice    = product.price <= maxPrice
    return matchCategory && matchPrice
  })
}

/**
 * Безопасный парсинг JSON строки
 * @param {string} jsonString - строка в формате JSON
 * @returns {any|null} распарсенный объект или null при ошибке
 */
export function parseJSON(jsonString) {
  try {
    return JSON.parse(jsonString)
  } catch {
    // При невалидном JSON возвращаем null вместо ошибки
    return null
  }
}

/**
 * Валидация email адреса
 * @param {string} email
 * @returns {boolean}
 */
export function validateEmail(email) {
  if (typeof email !== 'string') return false
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return regex.test(email)
}

/**
 * Считает общее количество товаров в корзине
 * @param {Array} items - [{qty: number}, ...]
 * @returns {number}
 */
export function calculateItemCount(items) {
  if (!Array.isArray(items)) return 0
  return items.reduce((sum, item) => {
    return sum + (typeof item.qty === 'number' ? item.qty : 0)
  }, 0)
}
