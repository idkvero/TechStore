// src/components/ui/Button.jsx
// Базовый компонент кнопки.
// Props:
//   children  — текст или содержимое кнопки
//   variant   — 'primary' | 'secondary' | 'outline' (стиль кнопки)
//   size      — 'sm' | 'md' | 'lg' (размер)
//   disabled  — true/false (заблокирована ли)
//   onClick   — обработчик клика (функция-заглушка, useState в следующем семестре)

import React from 'react'

function Button({ children, variant = 'primary', size = 'md', disabled = false, onClick }) {
  // Формируем строку классов на основе props
  const baseClass = 'btn'
  const variantClass = `btn--${variant}`
  const sizeClass = `btn--${size}`
  const disabledClass = disabled ? 'btn--disabled' : ''

  const className = [baseClass, variantClass, sizeClass, disabledClass]
    .filter(Boolean)
    .join(' ')

  // Обработчик клика — заглушка, выводит в консоль
  const handleClick = () => {
    if (disabled) return
    console.log('Button clicked:', children)
    if (onClick) onClick()
  }

  return (
    <button
      className={className}
      onClick={handleClick}
      disabled={disabled}
      type="button"
    >
      {children}
    </button>
  )
}

export default Button
