// js/utils/helpers.js

// Валидация email
export const validateEmail = email => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+/;
  return regex.test(email);
};

// Валидация: не пустое поле
export const validateRequired = value => {
  return value.trim().length > 0;
};

// Показать ошибку под полем
export const showError = (element, message) => {
  element.style.borderColor = 'red';
  // Не дублируем ошибку если уже есть
  if (element.parentNode.querySelector('.error-message')) return;
  const errorElement = document.createElement('div');
  errorElement.className = 'error-message';
  errorElement.textContent = message;
  element.parentNode.appendChild(errorElement);
};

// Убрать ошибку
export const clearErrors = element => {
  element.style.borderColor = '';
  const errorElement = element.parentNode.querySelector('.error-message');
  if (errorElement) {
    errorElement.remove();
  }
};

// Вспомогательные функции
export function formatPrice(price) {
  return '$' + price.toLocaleString();
}

export function debounce(fn, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}
