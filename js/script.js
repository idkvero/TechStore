console.log('Скрипт работает!');

document.body.addEventListener('click', function () {
  document.body.style.backgroundColor =
    document.body.style.backgroundColor === 'lightblue'
      ? '#f0f0f0'
      : 'lightblue';
});
