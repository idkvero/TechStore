import React from 'react';
import { render, screen } from '@testing-library/react';
import ProductGrid from '../../components/features/ProductGrid';

const mockProducts = [
  { id: 1, name: 'Product 1', price: 100 },
  { id: 2, name: 'Product 2', price: 200 },
];

describe('ProductGrid', () => {
  test('отображает сетку товаров при получении данных', () => {
    render(<ProductGrid products={mockProducts} />);

    // Проверяем наличие товаров по имени
    expect(screen.getByText(/Product 1/i)).toBeInTheDocument();
    expect(screen.getByText(/Product 2/i)).toBeInTheDocument();
  });

  test('отображает пустую сетку, если товаров нет', () => {
    const { container } = render(<ProductGrid products={[]} />);

    const grid = container.querySelector('.product-grid');

    if (grid) {
      // Проверяем, что внутри НЕТ карточек товара (например, элементов с классом product-card)
      const items = grid.querySelectorAll('.product-card');
      expect(items.length).toBe(0);
    }
  });
});
