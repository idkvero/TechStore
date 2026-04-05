// src/App.jsx
// Корневой компонент приложения.
// Объединяет все компоненты и управляет данными через props.
//
// ВАЖНО: В этой лабораторной работе НЕ используем useState и useEffect —
// данные статические (моковые), состояние не меняется.
// В следующем семестре добавим управление состоянием.

import React from 'react'

// Импорт компонентов layout
import Header from './components/layout/Header.jsx'
import Footer from './components/layout/Footer.jsx'

// Импорт компонентов features
import ProductGrid from './components/features/ProductGrid.jsx'
import PriceFilter from './components/features/PriceFilter.jsx'
import ShoppingCart from './components/features/ShoppingCart.jsx'

// Импорт моковых данных
import { products, categories, cartItems } from './data/products.js'

// Вычисляем начальное значение максимальной цены из данных
const MAX_PRICE = Math.max(...products.map(p => p.price))

function App() {
  // ─── СТАТИЧЕСКИЕ ДАННЫЕ (без useState) ────────────────────
  // В следующем семестре эти переменные станут состоянием через useState
  const activeCategory = 'all'    // активная категория фильтра
  const maxPrice       = MAX_PRICE // максимальная цена фильтра
  const isCartOpen     = false     // открыта ли корзина
  const cart           = cartItems // начальное содержимое корзины

  // ─── ОБРАБОТЧИКИ-ЗАГЛУШКИ ─────────────────────────────────
  // Сейчас только логируют действие в консоль.
  // В следующем семестре будут обновлять состояние через setState.

  const handleCategoryChange = (categoryId) => {
    console.log('[App] Смена категории:', categoryId)
    console.log('→ В следующем семестре: setActiveCategory(categoryId)')
  }

  const handlePriceChange = (price) => {
    console.log('[App] Смена цены до:', price)
    console.log('→ В следующем семестре: setMaxPrice(price)')
  }

  const handleCartOpen = () => {
    console.log('[App] Открытие корзины')
    console.log('→ В следующем семестре: setIsCartOpen(true)')
  }

  const handleCartClose = () => {
    console.log('[App] Закрытие корзины')
    console.log('→ В следующем семестре: setIsCartOpen(false)')
  }

  const handleAddToCart = (product) => {
    console.log('[App] Добавление в корзину:', product.name)
    console.log('→ В следующем семестре: setCart([...cart, product])')
  }

  const handleRemoveFromCart = (productId) => {
    console.log('[App] Удаление из корзины, id:', productId)
    console.log('→ В следующем семестре: setCart(cart.filter(...))')
  }

  const handleQtyChange = (productId, newQty) => {
    console.log('[App] Изменение количества, id:', productId, 'qty:', newQty)
    console.log('→ В следующем семестре: обновим элемент в массиве корзины')
  }

  // ─── JSX — описание интерфейса ────────────────────────────
  return (
    <div className="app">

      {/* Header получает количество товаров в корзине и обработчик */}
      <Header
        cartCount={cart.length}
        onCartOpen={handleCartOpen}
      />

      <main className="main">

        {/* Hero-секция */}
        <section className="hero">
          <div className="hero__container">
            <h1 className="hero__title">NEXT-GEN TECH</h1>
            <p className="hero__subtitle">Premium gadgets for the digital age</p>
            <a href="#products" className="hero__btn">SHOP NOW</a>
          </div>
        </section>

        {/* Фильтр — передаём данные и обработчики через props */}
        <PriceFilter
          categories={categories}
          activeCategory={activeCategory}
          maxPrice={maxPrice}
          priceLimit={MAX_PRICE}
          onCategoryChange={handleCategoryChange}
          onPriceChange={handlePriceChange}
        />

        {/* Сетка товаров — фильтрует внутри себя на основе props */}
        <ProductGrid
          products={products}
          activeCategory={activeCategory}
          maxPrice={maxPrice}
          onAddToCart={handleAddToCart}
        />

        {/* Секция корзины */}
        <section className="cart-section" id="cart">
          <div className="cart-section__container">
            <h2 className="cart-section__title">ВАША КОРЗИНА</h2>
            <p className="cart-section__subtitle">
              Предварительный просмотр корзины (демо-данные)
            </p>
            {/* Inline-версия корзины для демонстрации на странице */}
            <div className="cart-preview">
              {cart.map(item => (
                <div key={item.id} className="cart-preview__item">
                  <img src={item.image} alt={item.name} className="cart-preview__img" />
                  <div className="cart-preview__info">
                    <strong>{item.name}</strong>
                    <span>Количество: {item.qty}</span>
                  </div>
                  <span className="cart-preview__price">${item.price * item.qty}</span>
                </div>
              ))}
              <div className="cart-preview__total">
                Итого: ${cart.reduce((s, i) => s + i.price * i.qty, 0)}
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* Боковая панель корзины */}
      <ShoppingCart
        items={cart}
        isOpen={isCartOpen}
        onClose={handleCartClose}
        onRemove={handleRemoveFromCart}
        onQtyChange={handleQtyChange}
      />

      <Footer />

    </div>
  )
}

export default App
