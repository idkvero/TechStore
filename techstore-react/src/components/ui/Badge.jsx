// src/components/ui/Badge.jsx
// Компонент бейджа (метки) на карточке товара.
// Props:
//   text  — текст бейджа
//   color — 'cyan' | 'green' | 'orange' (цвет)

import React from 'react'

function Badge({ text, color = 'cyan' }) {
  // Если текст не передан — ничего не рендерим
  if (!text) return null

  return (
    <span className={`badge badge--${color}`}>
      {text}
    </span>
  )
}

export default Badge
