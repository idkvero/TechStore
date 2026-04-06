import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ProductCard from '../../components/features/ProductCard';

const mockProduct = {
  id: 1,
  name: 'Cyber Headphones',
  description: 'Беспроводные наушники с активным шумоподавлением',
  price: 299,
  rating: 4.8,
  reviews: 124,
  category: 'audio',
  image: 'https://example.com/headphones.jpg',
  inStock: true,
  badge: 'Хит продаж',
};

const outOfStockProduct = {
  ...mockProduct,
  id: 2,
  inStock: false,
  badge: null,
};

describe('ProductCard — карточка товара', () => {
  test('отображает название товара', () => {
    render(<ProductCard product={mockProduct} />);
    expect(screen.getByText('Cyber Headphones')).toBeInTheDocument();
  });

  test('отображает цену товара', () => {
    render(<ProductCard product={mockProduct} />);
    // Цена разбита на символ и число, ищем по числу
    expect(screen.getByText('299')).toBeInTheDocument();
  });

  test('отображает описание товара', () => {
    render(<ProductCard product={mockProduct} />);
    expect(screen.getByText(/шумоподавлением/i)).toBeInTheDocument();
  });

  test('отображает бейдж если он задан', () => {
    render(<ProductCard product={mockProduct} />);
    expect(screen.getByText('Хит продаж')).toBeInTheDocument();
  });

  test('не отображает бейдж если badge=null', () => {
    render(<ProductCard product={outOfStockProduct} />);
    expect(screen.queryByText('Хит продаж')).not.toBeInTheDocument();
  });

  test('показывает кнопку "В корзину" для товара в наличии', () => {
    render(<ProductCard product={mockProduct} />);
    expect(screen.getByText('В корзину')).toBeInTheDocument();
  });

  test('показывает "Нет в наличии" и блокирует кнопку', () => {
    render(<ProductCard product={outOfStockProduct} />);
    const button = screen.getByRole('button', { name: /нет в наличии/i });
    expect(button).toBeInTheDocument();
    expect(button).toBeDisabled();
  });

  test('отображает изображение с правильным alt', () => {
    render(<ProductCard product={mockProduct} />);
    const img = screen.getByAltText('Cyber Headphones');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', mockProduct.image);
  });

  test('вызывает onAddToCart при клике на кнопку', () => {
    const handleAddToCart = jest.fn();
    render(<ProductCard product={mockProduct} onAddToCart={handleAddToCart} />);

    fireEvent.click(screen.getByText('В корзину'));
    expect(handleAddToCart).toHaveBeenCalledTimes(1);
    expect(handleAddToCart).toHaveBeenCalledWith(mockProduct);
  });

  test('не вызывает onAddToCart если товара нет в наличии', () => {
    const handleAddToCart = jest.fn();
    render(
      <ProductCard product={outOfStockProduct} onAddToCart={handleAddToCart} />
    );

    fireEvent.click(screen.getByRole('button'));
    expect(handleAddToCart).not.toHaveBeenCalled();
  });
});
