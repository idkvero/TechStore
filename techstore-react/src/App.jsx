import React from 'react';

// Импорт компонентов layout
import Header from './components/layout/Header.jsx';
import Footer from './components/layout/Footer.jsx';

import ProductGrid from './components/features/ProductGrid.jsx';
import PriceFilter from './components/features/PriceFilter.jsx';
import ShoppingCart from './components/features/ShoppingCart.jsx';

import { products, categories, cartItems } from './data/products.js';

const MAX_PRICE = Math.max(...products.map(p => p.price));

function App() {
  const activeCategory = 'all';
  const maxPrice = MAX_PRICE;
  const isCartOpen = false;
  const cart = cartItems;

  const handleCategoryChange = categoryId => {
    console.log('[App] Смена категории:', categoryId);
    console.log('→ В следующем семестре: setActiveCategory(categoryId)');
  };

  const handlePriceChange = price => {
    console.log('[App] Смена цены до:', price);
    console.log('→ В следующем семестре: setMaxPrice(price)');
  };

  const handleCartOpen = () => {
    console.log('[App] Открытие корзины');
    console.log('→ В следующем семестре: setIsCartOpen(true)');
  };

  const handleCartClose = () => {
    console.log('[App] Закрытие корзины');
    console.log('→ В следующем семестре: setIsCartOpen(false)');
  };

  const handleAddToCart = product => {
    console.log('[App] Добавление в корзину:', product.name);
    console.log('→ В следующем семестре: setCart([...cart, product])');
  };

  const handleRemoveFromCart = productId => {
    console.log('[App] Удаление из корзины, id:', productId);
    console.log('→ В следующем семестре: setCart(cart.filter(...))');
  };

  const handleQtyChange = (productId, newQty) => {
    console.log('[App] Изменение количества, id:', productId, 'qty:', newQty);
    console.log('→ В следующем семестре: обновим элемент в массиве корзины');
  };

  return (
    <div className="app">
      <Header cartCount={cart.length} onCartOpen={handleCartOpen} />

      <main className="main">
        {/* Hero-секция */}
        <section className="hero">
          <div className="hero__container">
            <h1 className="hero__title">NEXT-GEN TECH</h1>
            <p className="hero__subtitle">
              Premium gadgets for the digital age
            </p>
            <a href="#products" className="hero__btn">
              SHOP NOW
            </a>
          </div>
        </section>

        <PriceFilter
          categories={categories}
          activeCategory={activeCategory}
          maxPrice={maxPrice}
          priceLimit={MAX_PRICE}
          onCategoryChange={handleCategoryChange}
          onPriceChange={handlePriceChange}
        />

        <ProductGrid
          products={products}
          activeCategory={activeCategory}
          maxPrice={maxPrice}
          onAddToCart={handleAddToCart}
        />

        <section className="cart-section" id="cart">
          <div className="cart-section__container">
            <h2 className="cart-section__title">ВАША КОРЗИНА</h2>
            <p className="cart-section__subtitle">
              Предварительный просмотр корзины (демо-данные)
            </p>
            <div className="cart-preview">
              {cart.map(item => (
                <div key={item.id} className="cart-preview__item">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="cart-preview__img"
                  />
                  <div className="cart-preview__info">
                    <strong>{item.name}</strong>
                    <span>Количество: {item.qty}</span>
                  </div>
                  <span className="cart-preview__price">
                    ${item.price * item.qty}
                  </span>
                </div>
              ))}
              <div className="cart-preview__total">
                Итого: ${cart.reduce((s, i) => s + i.price * i.qty, 0)}
              </div>
            </div>
          </div>
        </section>
      </main>

      <ShoppingCart
        items={cart}
        isOpen={isCartOpen}
        onClose={handleCartClose}
        onRemove={handleRemoveFromCart}
        onQtyChange={handleQtyChange}
      />

      <Footer />
    </div>
  );
}

export default App;
