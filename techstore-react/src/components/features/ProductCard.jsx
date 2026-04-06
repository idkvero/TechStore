import React from 'react';
import Button from '../ui/Button.jsx';
import Rating from '../ui/Rating.jsx';
import Badge from '../ui/Badge.jsx';

function ProductCard({ product, onAddToCart }) {
  // Деструктурируем props для удобства
  const { name, description, price, rating, reviews, image, inStock, badge } =
    product;

  const handleAddToCart = () => {
    console.log('Добавлен в корзину:', name, '| Цена:', price);
    if (onAddToCart) onAddToCart(product);
  };

  const handleCardClick = () => {
    console.log('Открыта карточка товара:', name);
  };

  return (
    <article className="product-card" onClick={handleCardClick}>
      <div className="product-card__figure">
        <Badge text={badge} color="cyan" />
        <img
          src={image}
          alt={name}
          className="product-card__image"
          loading="lazy"
        />
        {!inStock && (
          <div className="product-card__out-of-stock">Нет в наличии</div>
        )}
      </div>

      <div className="product-card__body">
        <h3 className="product-card__title">{name}</h3>

        <Rating value={rating} reviews={reviews} size="sm" />

        <p className="product-card__desc">{description}</p>

        <div className="product-card__footer">
          <p className="product-card__price">
            <span className="product-card__currency">$</span>
            {price}
          </p>

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
  );
}

export default ProductCard;
