// src/components/features/ProductGrid.jsx
// Компонент сетки товаров с фильтрацией.
// Props:
//   products       — полный массив товаров
//   activeCategory — активная категория для фильтра
//   maxPrice       — максимальная цена для фильтра
//   onAddToCart    — обработчик добавления в корзину

import React from 'react'
import ProductCard from './ProductCard.jsx'

function ProductGrid({ products = [], activeCategory = 'all', maxPrice = 9999, onAddToCart }) {

  // Фильтрация товаров по категории и цене
  // Это "вычисляемое значение" — просто результат filter() на массиве
  const filteredProducts = products.filter(product => {
    const matchCategory = activeCategory === 'all' || product.category === activeCategory
    const matchPrice    = product.price <= maxPrice
    return matchCategory && matchPrice
  })

  return (
    <section className="product-grid" id="products">
      <div className="product-grid__container">

        <h2 className="product-grid__title">FEATURED PRODUCTS</h2>

        {/* Показываем количество найденных товаров */}
        <p className="product-grid__count">
          Найдено товаров: {filteredProducts.length}
        </p>

        {filteredProducts.length > 0 ? (
          // Если товары найдены — рендерим сетку
          <div className="product-grid__grid">
            {filteredProducts.map(product => (
              // Ключ (key) обязателен при рендере списков в React
              // React использует key для эффективного обновления DOM
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={onAddToCart}
              />
            ))}
          </div>
        ) : (
          // Если товаров нет — показываем сообщение
          <div className="product-grid__empty">
            <p>По выбранным фильтрам товары не найдены</p>
            <p>Попробуйте изменить категорию или увеличить максимальную цену</p>
          </div>
        )}

      </div>
    </section>
  )
}

export default ProductGrid
