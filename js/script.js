document.addEventListener('DOMContentLoaded', function () {
  const burger = document.querySelector('.header__burger');
  const mobileMenu = document.querySelector('.header__mobile-menu');
  const body = document.body;

  if (burger && mobileMenu) {
    burger.addEventListener('click', function () {
      burger.classList.toggle('header__burger--active');
      mobileMenu.classList.toggle('header__mobile-menu--active');

      if (mobileMenu.classList.contains('header__mobile-menu--active')) {
        body.style.overflow = 'hidden';
      } else {
        body.style.overflow = '';
      }
    });

    const navLinks = mobileMenu.querySelectorAll('.nav__link');
    navLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        burger.classList.remove('header__burger--active');
        mobileMenu.classList.remove('header__mobile-menu--active');
        body.style.overflow = '';
      });
    });

    document.addEventListener('click', function (event) {
      if (
        !burger.contains(event.target) &&
        !mobileMenu.contains(event.target)
      ) {
        burger.classList.remove('header__burger--active');
        mobileMenu.classList.remove('header__mobile-menu--active');
        body.style.overflow = '';
      }
    });
  }
});

document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href !== '#') {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }
    }
  });
});
