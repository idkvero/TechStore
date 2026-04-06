import React from 'react';
import ProductCard from './ProductCard.jsx';

function ProductGrid({
  products = [],
  activeCategory = 'all',
  maxPrice = 9999,
  onAddToCart,
}) {
  const filteredProducts = products.filter(product => {
    const matchCategory =
      activeCategory === 'all' || product.category === activeCategory;
    const matchPrice = product.price <= maxPrice;
    return matchCategory && matchPrice;
  });

  return (
    <section className="product-grid" id="products">
      <div className="product-grid__container">
        <h2 className="product-grid__title">FEATURED PRODUCTS</h2>

        <p className="product-grid__count">
          Найдено товаров: {filteredProducts.length}
        </p>

        {filteredProducts.length > 0 ? (
          <div className="product-grid__grid">
            {filteredProducts.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={onAddToCart}
              />
            ))}
          </div>
        ) : (
          <div className="product-grid__empty">
            <p>По выбранным фильтрам товары не найдены</p>
            <p>Попробуйте изменить категорию или увеличить максимальную цену</p>
          </div>
        )}
      </div>
    </section>
  );
}

export default ProductGrid;
