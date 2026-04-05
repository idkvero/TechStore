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

function parseCategoryName(apiCategory) {
  const map = {
    electronics: 'electronics',
    jewelery: 'wearables',
    "men's clothing": 'clothing',
    "women's clothing": 'clothing',
  };
  return map[apiCategory] || 'other';
}

export function parseProducts(apiProducts) {
  return apiProducts.map(parseProduct);
}

export function getCategories(products) {
  const cats = [...new Set(products.map(p => p.category))];
  return ['all', ...cats];
}

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
