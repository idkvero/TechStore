// src/components/layout/Footer.jsx
// Компонент подвала сайта.
// Props: нет (статический компонент)

import React from 'react'

function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="footer__container">
        <p className="footer__logo">TECHSTORE</p>
        <p className="footer__copy">
          © {year} TechStore. Все права защищены.
        </p>
        <p className="footer__note">
          Учебный проект — Лабораторная работа №7, React + Vite
        </p>
      </div>
    </footer>
  )
}

export default Footer
