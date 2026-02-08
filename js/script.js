console.log('Скрипт работает!');

document.body.addEventListener('click', function() {
    document.body.style.backgroundColor = 
        document.body.style.backgroundColor === 'lightblue' ? '#f0f0f0' : 'lightblue';
});

document.querySelector('h1').addEventListener('mouseenter', function() {
    console.log('Вы навели курсор на заголовок!');
});