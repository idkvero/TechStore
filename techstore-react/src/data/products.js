export const products = [
  {
    id: 1,
    name: 'Cyber Headphones',
    description:
      'Беспроводные наушники с активным шумоподавлением и 30 часами автономной работы',
    price: 299,
    rating: 4.8,
    reviews: 124,
    category: 'audio',
    image: 'https://fakestoreapi.com/img/61IBBVJvSDL._AC_SY879_.jpg',
    inStock: true,
    badge: 'Хит продаж',
  },
  {
    id: 2,
    name: 'Gaming Laptop Pro',
    description:
      'Мощный игровой ноутбук с процессором Intel Core i9 и видеокартой NVIDIA RTX 4080',
    price: 1499,
    rating: 4.9,
    reviews: 87,
    category: 'computers',
    image: 'https://fakestoreapi.com/img/61mtL65D4cL._AC_SX679_.jpg',
    inStock: true,
    badge: 'Новинка',
  },
  {
    id: 3,
    name: 'Smart Watch Pro',
    description:
      'Умные часы с сенсорным AMOLED-дисплеем и мониторингом сердечного ритма 24/7',
    price: 399,
    rating: 4.6,
    reviews: 203,
    category: 'wearables',
    image:
      'https://fakestoreapi.com/img/71pWzhdJNwL._AC_UL640_FMwebp_QL65_.jpg',
    inStock: true,
    badge: null,
  },
  {
    id: 4,
    name: 'Wireless Earbuds',
    description:
      'Компактные наушники-вкладыши с шумоподавлением и зарядным кейсом на 24 часа',
    price: 199,
    rating: 4.5,
    reviews: 312,
    category: 'audio',
    image:
      'https://fakestoreapi.com/img/71YAIFU48IL._AC_UL640_FMwebp_QL65_.jpg',
    inStock: false,
    badge: 'Скидка 10%',
  },
  {
    id: 5,
    name: '4K Monitor Ultra',
    description:
      '27-дюймовый 4K IPS-монитор с частотой обновления 144 Гц и временем отклика 1 мс',
    price: 649,
    rating: 4.7,
    reviews: 56,
    category: 'computers',
    image:
      'https://fakestoreapi.com/img/81fAn4fa8TL._AC_UL640_FMwebp_QL65_.jpg',
    inStock: true,
    badge: null,
  },
  {
    id: 6,
    name: 'Fitness Tracker X',
    description:
      'Спортивный браслет с GPS, датчиком кислорода в крови и водозащитой IP68',
    price: 149,
    rating: 4.3,
    reviews: 445,
    category: 'wearables',
    image:
      'https://fakestoreapi.com/img/51UDEzMJVpL._AC_UL640_FMwebp_QL65_.jpg',
    inStock: true,
    badge: null,
  },
];

export const categories = [
  { id: 'all', label: 'Все товары' },
  { id: 'audio', label: 'Аудио' },
  { id: 'computers', label: 'Компьютеры' },
  { id: 'wearables', label: 'Носимые' },
];

export const cartItems = [
  { ...products[0], qty: 1 },
  { ...products[2], qty: 2 },
];
