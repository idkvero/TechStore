// src/components/features/ShoppingCart.jsx
// Компонент корзины покупок.
// Props:
//   items         — массив товаров в корзине [{ ...product, qty }]
//   isOpen        — открыта ли боковая панель корзины
//   onClose       — обработчик закрытия
//   onRemove      — обработчик удаления товара
//   onQtyChange   — обработчик изменения количества

import React from 'react'
import Button from '../ui/Button.jsx'

// Вспомогательный компонент — строка товара в корзине
// Вынесен отдельно для переиспользуемости и читаемости
function CartItem({ item, onRemove, onQtyChange }) {
  return (
    <div className="cart-item">
      <img src={item.image} alt={item.name} className="cart-item__img" />

      <div className="cart-item__info">
        <p className="cart-item__name">{item.name}</p>

        {/* Управление количеством — заглушки */}
        <div className="cart-item__controls">
          <button
            className="cart-item__qty-btn"
            onClick={() => {
              console.log('Уменьшить количество:', item.name)
              if (onQtyChange) onQtyChange(item.id, item.qty - 1)
            }}
          >
            −
          </button>
          <span className="cart-item__qty">{item.qty}</span>
          <button
            className="cart-item__qty-btn"
            onClick={() => {
              console.log('Увеличить количество:', item.name)
              if (onQtyChange) onQtyChange(item.id, item.qty + 1)
            }}
          >
            +
          </button>
        </div>
      </div>

      <div className="cart-item__right">
        <p className="cart-item__price">${item.price * item.qty}</p>
        <button
          className="cart-item__remove"
          onClick={() => {
            console.log('Удалён из корзины:', item.name)
            if (onRemove) onRemove(item.id)
          }}
          aria-label={`Удалить ${item.name}`}
        >
          ✕
        </button>
      </div>
    </div>
  )
}

// Главный компонент корзины
function ShoppingCart({ items = [], isOpen = false, onClose, onRemove, onQtyChange }) {

  // Считаем итоговую сумму — reduce() суммирует price * qty каждого товара
  const total = items.reduce((sum, item) => sum + item.price * item.qty, 0)

  // Считаем общее количество товаров
  const totalQty = items.reduce((sum, item) => sum + item.qty, 0)

  const handleCheckout = () => {
    console.log('Оформление заказа — в следующем семестре подключим Stripe API')
    alert(`Заказ на сумму $${total} оформлен! (заглушка)`)
  }

  return (
    <>
      {/* Оверлей — затемнение фона */}
      {isOpen && (
        <div className="cart-overlay" onClick={onClose} />
      )}

      {/* Боковая панель */}
      <aside className={`cart-sidebar ${isOpen ? 'cart-sidebar--open' : ''}`}>

        <div className="cart-sidebar__header">
          <h2 className="cart-sidebar__title">
            🛒 Корзина ({totalQty})
          </h2>
          <button className="cart-sidebar__close" onClick={onClose}>✕</button>
        </div>

        <div className="cart-sidebar__items">
          {items.length === 0 ? (
            <p className="cart-sidebar__empty">Корзина пуста</p>
          ) : (
            items.map(item => (
              <CartItem
                key={item.id}
                item={item}
                onRemove={onRemove}
                onQtyChange={onQtyChange}
              />
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="cart-sidebar__footer">
            <div className="cart-sidebar__total">
              <span>Итого:</span>
              <span className="cart-sidebar__total-price">${total}</span>
            </div>
            <Button variant="primary" size="md" onClick={handleCheckout}>
              Оформить заказ
            </Button>
          </div>
        )}

      </aside>
    </>
  )
}

export default ShoppingCart
