import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Button from '../../components/ui/Button';

describe('Button — базовый компонент кнопки', () => {
  test('рендерит текст кнопки', () => {
    render(<Button>В корзину</Button>);
    expect(screen.getByText('В корзину')).toBeInTheDocument();
  });

  test('применяет класс primary по умолчанию', () => {
    render(<Button>Нажми</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('btn--primary');
  });

  test('применяет класс outline для variant="outline"', () => {
    render(<Button variant="outline">Войти</Button>);
    expect(screen.getByRole('button')).toHaveClass('btn--outline');
  });

  test('применяет класс размера', () => {
    render(<Button size="lg">Большая</Button>);
    expect(screen.getByRole('button')).toHaveClass('btn--lg');
  });

  test('кнопка заблокирована при disabled=true', () => {
    render(<Button disabled>Нажми</Button>);
    const button = screen.getByRole('button');
    // toBeDisabled — кнопка недоступна
    expect(button).toBeDisabled();
    expect(button).toHaveClass('btn--disabled');
  });

  test('вызывает onClick при клике', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Нажми</Button>);

    fireEvent.click(screen.getByRole('button'));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test('не вызывает onClick если кнопка заблокирована', () => {
    const handleClick = jest.fn();
    render(
      <Button disabled onClick={handleClick}>
        Нажми
      </Button>
    );
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).not.toHaveBeenCalled();
  });

  test('рендерит children как JSX', () => {
    render(
      <Button>
        <span>Иконка</span> Текст
      </Button>
    );
    expect(screen.getByText('Иконка')).toBeInTheDocument();
  });
});
