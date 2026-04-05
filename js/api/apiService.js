import { CONFIG } from './config.js';

async function request(endpoint) {
  const response = await fetch(`${CONFIG.BASE_URL}${endpoint}`);
  if (!response.ok)
    throw new Error(`Ошибка API: ${response.status} ${response.statusText}`);
  return response.json();
}

export const ApiService = {
  async getProducts() {
    const [phones, laptops] = await Promise.all([
      request('/products/category/smartphones?limit=6'),
      request('/products/category/laptops?limit=6'),
    ]);
    return [...phones.products, ...laptops.products];
  },

  async searchProducts(query) {
    if (!query) return this.getProducts();
    const data = await request(
      `/products/search?q=${encodeURIComponent(query)}&limit=20`
    );
    return data.products.filter(p =>
      ['smartphones', 'laptops', 'tablets', 'mobile-accessories'].includes(
        p.category
      )
    );
  },
};
