import React from 'react';

function Rating({ value = 0, reviews = 0, size = 'md' }) {
  const stars = Array.from({ length: 5 }, (_, index) => {
    if (index < Math.floor(value)) return 'full';
    if (index < value) return 'half';
    return 'empty';
  });

  return (
    <div className={`rating rating--${size}`}>
      <div className="rating__stars" aria-label={`Рейтинг ${value} из 5`}>
        {stars.map((type, index) => (
          <span key={index} className={`rating__star rating__star--${type}`}>
            {type === 'full' ? '★' : type === 'half' ? '⯨' : '☆'}
          </span>
        ))}
      </div>
      <span className="rating__value">{value}</span>
      {reviews > 0 && (
        <span className="rating__reviews">({reviews} отзывов)</span>
      )}
    </div>
  );
}

export default Rating;
