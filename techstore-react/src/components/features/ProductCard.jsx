// src/components/features/ProductCard.jsx
// Компонент карточки товара — композитный (использует Button, Rating, Badge).
// Props:
//   product   — объект товара { id, name, description, price, rating, reviews,
//                               category, image, inStock, badge }
//   onAddToCart — обработчик добавления в корзину (заглушка)

import React from 'react'
import Button from '../ui/Button.jsx'
import Rating from '../ui/Rating.jsx'
import Badge from '../ui/Badge.jsx'

function ProductCard({ product, onAddToCart }) {
  // Деструктурируем props для удобства
  const { name, description, price, rating, reviews, image, inStock, badge } = product

  // Обработчик добавления в корзину — заглушка
  const handleAddToCart = () => {
    console.log('Добавлен в корзину:', name, '| Цена:', price)
    if (onAddToCart) onAddToCart(product)
  }

  // Обработчик клика на карточку
  const handleCardClick = () => {
    console.log('Открыта карточка товара:', name)
  }

  return (
    <article className="product-card" onClick={handleCardClick}>

      {/* Изображение с бейджем */}
      <div className="product-card__figure">
        {/* Компонент Badge — рендерит метку только если badge не null */}
        <Badge text={badge} color="cyan" />
        <img
          src={image}
          alt={name}
          className="product-card__image"
          loading="lazy"
        />
        {/* Метка "Нет в наличии" */}
        {!inStock && (
          <div className="product-card__out-of-stock">Нет в наличии</div>
        )}
      </div>

      {/* Информация о товаре */}
      <div className="product-card__body">
        <h3 className="product-card__title">{name}</h3>

        {/* Компонент Rating */}
        <Rating value={rating} reviews={reviews} size="sm" />

        <p className="product-card__desc">{description}</p>

        {/* Цена и кнопка */}
        <div className="product-card__footer">
          <p className="product-card__price">
            <span className="product-card__currency">$</span>
            {price}
          </p>

          {/* Компонент Button — disabled если нет в наличии */}
          <Button
            variant="primary"
            size="sm"
            disabled={!inStock}
            onClick={handleAddToCart}
          >
            {inStock ? 'В корзину' : 'Нет в наличии'}
          </Button>
        </div>
      </div>

    </article>
  )
}

export default ProductCard
