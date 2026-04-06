import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import PriceFilter from '../../components/features/PriceFilter';

const mockCategories = [
  { id: 'all', label: 'Все товары' },
  { id: 'audio', label: 'Аудио' },
  { id: 'computers', label: 'Компьютеры' },
];

describe('PriceFilter — фильтры товаров', () => {
  test('рендерит все кнопки категорий', () => {
    render(
      <PriceFilter
        categories={mockCategories}
        activeCategory="all"
        maxPrice={1500}
        priceLimit={1500}
      />
    );
    expect(screen.getByText('Все товары')).toBeInTheDocument();
    expect(screen.getByText('Аудио')).toBeInTheDocument();
    expect(screen.getByText('Компьютеры')).toBeInTheDocument();
  });

  test('активная категория получает класс --active', () => {
    render(
      <PriceFilter
        categories={mockCategories}
        activeCategory="audio"
        maxPrice={1500}
        priceLimit={1500}
      />
    );
    const audioBtn = screen.getByText('Аудио');
    expect(audioBtn).toHaveClass('filter-btn--active');
  });

  test('неактивные категории не имеют класса --active', () => {
    render(
      <PriceFilter
        categories={mockCategories}
        activeCategory="all"
        maxPrice={1500}
        priceLimit={1500}
      />
    );
    const audioBtn = screen.getByText('Аудио');
    expect(audioBtn).not.toHaveClass('filter-btn--active');
  });

  test('вызывает onCategoryChange при клике на категорию', () => {
    const handleCategoryChange = jest.fn();
    render(
      <PriceFilter
        categories={mockCategories}
        activeCategory="all"
        maxPrice={1500}
        priceLimit={1500}
        onCategoryChange={handleCategoryChange}
      />
    );
    fireEvent.click(screen.getByText('Аудио'));
    expect(handleCategoryChange).toHaveBeenCalledWith('audio');
  });

  test('отображает текущую максимальную цену', () => {
    render(
      <PriceFilter
        categories={mockCategories}
        activeCategory="all"
        maxPrice={800}
        priceLimit={1500}
      />
    );
    expect(screen.getByText('$800')).toBeInTheDocument();
  });

  test('вызывает onPriceChange при изменении ползунка', () => {
    const handlePriceChange = jest.fn();
    render(
      <PriceFilter
        categories={mockCategories}
        activeCategory="all"
        maxPrice={1500}
        priceLimit={1500}
        onPriceChange={handlePriceChange}
      />
    );
    const slider = screen.getByRole('slider');
    fireEvent.change(slider, { target: { value: '500' } });
    expect(handlePriceChange).toHaveBeenCalledWith(500);
  });

  test('рендерит ползунок с правильными атрибутами', () => {
    render(
      <PriceFilter
        categories={mockCategories}
        activeCategory="all"
        maxPrice={1000}
        priceLimit={1500}
      />
    );
    const slider = screen.getByRole('slider');
    expect(slider).toHaveAttribute('min', '0');
    expect(slider).toHaveAttribute('max', '1500');
    expect(slider).toHaveAttribute('value', '1000');
  });
});
