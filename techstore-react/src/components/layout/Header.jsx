import React from 'react';
import Button from '../ui/Button.jsx';

function Header({ cartCount = 0, onCartOpen }) {
  const handleMenuClick = () => {
    console.log('Menu clicked — в следующем семестре откроем мобильное меню');
  };

  const handleCartClick = () => {
    console.log('Cart opened, items:', cartCount);
    if (onCartOpen) onCartOpen();
  };

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
              <a href="#products" className="nav__link">
                Товары
              </a>
            </li>
            <li className="nav__item">
              <a href="#cart" className="nav__link">
                Корзина
              </a>
            </li>
            <li className="nav__item">
              <a href="#about" className="nav__link">
                О нас
              </a>
            </li>
          </ul>
        </nav>

        <div className="header__actions">
          <button
            className="header__cart-btn"
            onClick={handleCartClick}
            aria-label={`Корзина, ${cartCount} товаров`}
          >
            🛒
            {cartCount > 0 && (
              <span className="header__cart-count">{cartCount}</span>
            )}
          </button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => console.log('Sign In')}
          >
            Войти
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => console.log('Sign Up')}
          >
            Регистрация
          </Button>
        </div>
      </div>
    </header>
  );
}

export default Header;
