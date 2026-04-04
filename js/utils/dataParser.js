// js/utils/dataParser.js
// Утилиты для обработки данных от FakeStore API

// Преобразовать товар из FakeStore API в формат нашего приложения
export function parseProduct(apiProduct) {
  return {
    id: apiProduct.id,
    name: apiProduct.title,
    price: Math.round(apiProduct.price),
    category: parseCategoryName(apiProduct.category),
    image: apiProduct.image,
    description: apiProduct.description,
    rating: apiProduct.rating?.rate || 0,
  };
}

// Преобразовать категорию API в нашу
function parseCategoryName(apiCategory) {
  const map = {
    electronics: 'electronics',
    jewelery: 'wearables',
    "men's clothing": 'clothing',
    "women's clothing": 'clothing',
  };
  return map[apiCategory] || 'other';
}

// Преобразовать массив товаров
export function parseProducts(apiProducts) {
  return apiProducts.map(parseProduct);
}

// Сформировать список уникальных категорий
export function getCategories(products) {
  const cats = [...new Set(products.map(p => p.category))];
  return ['all', ...cats];
}

// Фильтрация товаров
export function filterProducts(
  products,
  { category = 'all', maxPrice = Infinity } = {}
) {
  return products.filter(p => {
    const matchCategory = category === 'all' || p.category === category;
    const matchPrice = p.price <= maxPrice;
    return matchCategory && matchPrice;
  });
}
