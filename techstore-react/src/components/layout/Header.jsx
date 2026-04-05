// src/components/layout/Header.jsx
// Компонент шапки сайта.
// Props:
//   cartCount — количество товаров в корзине
//   onCartOpen — обработчик открытия корзины (заглушка)

import React from 'react'
import Button from '../ui/Button.jsx'

function Header({ cartCount = 0, onCartOpen }) {
  // Обработчик открытия меню — заглушка
  const handleMenuClick = () => {
    console.log('Menu clicked — в следующем семестре откроем мобильное меню')
  }

  const handleCartClick = () => {
    console.log('Cart opened, items:', cartCount)
    if (onCartOpen) onCartOpen()
  }

  return (
    <header className="header">
      <div className="header__container">

        {/* Логотип */}
        <a href="/" className="header__logo">
          TECHSTORE
        </a>

        {/* Навигация */}
        <nav className="header__nav" aria-label="Основная навигация">
          <ul className="nav__list">
            <li className="nav__item">
              <a href="#products" className="nav__link">Товары</a>
            </li>
            <li className="nav__item">
              <a href="#cart" className="nav__link">Корзина</a>
            </li>
            <li className="nav__item">
              <a href="#about" className="nav__link">О нас</a>
            </li>
          </ul>
        </nav>

        {/* Действия в шапке */}
        <div className="header__actions">
          {/* Кнопка корзины — используем компонент Button */}
          <button
            className="header__cart-btn"
            onClick={handleCartClick}
            aria-label={`Корзина, ${cartCount} товаров`}
          >
            🛒
            {/* Счётчик отображается только если cartCount > 0 */}
            {cartCount > 0 && (
              <span className="header__cart-count">{cartCount}</span>
            )}
          </button>

          <Button variant="outline" size="sm" onClick={() => console.log('Sign In')}>
            Войти
          </Button>
          <Button variant="primary" size="sm" onClick={() => console.log('Sign Up')}>
            Регистрация
          </Button>
        </div>

      </div>
    </header>
  )
}

export default Header
