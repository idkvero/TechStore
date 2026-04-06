import React from 'react';

function PriceFilter({
  categories = [],
  activeCategory = 'all',
  maxPrice = 1500,
  priceLimit = 1500,
  onCategoryChange,
  onPriceChange,
}) {
  const handleCategoryClick = categoryId => {
    console.log('Категория выбрана:', categoryId);
    if (onCategoryChange) onCategoryChange(categoryId);
  };

  const handlePriceChange = e => {
    const value = Number(e.target.value);
    console.log('Максимальная цена:', value);
    if (onPriceChange) onPriceChange(value);
  };

  return (
    <div className="price-filter">
      <div className="price-filter__container">
        {/* Фильтр по категории */}
        <div className="price-filter__categories">
          <span className="price-filter__label">Категория:</span>
          <div className="price-filter__btns">
            {categories.map(cat => (
              <button
                key={cat.id}
                className={`filter-btn ${activeCategory === cat.id ? 'filter-btn--active' : ''}`}
                onClick={() => handleCategoryClick(cat.id)}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Фильтр по цене */}
        <div className="price-filter__price">
          <span className="price-filter__label">
            Цена до:{' '}
            <strong className="price-filter__value">${maxPrice}</strong>
          </span>
          <input
            type="range"
            className="price-filter__range"
            min={0}
            max={priceLimit}
            value={maxPrice}
            step={50}
            onChange={handlePriceChange}
            aria-label="Максимальная цена"
          />
        </div>
      </div>
    </div>
  );
}

export default PriceFilter;
