// babel.config.cjs
// Babel преобразует JSX и современный JS в формат который понимает Jest
// Jest не использует Vite, поэтому нужен отдельный транспилер

module.exports = {
  presets: [
    ['@babel/preset-env', { targets: { node: 'current' } }],
    ['@babel/preset-react', { runtime: 'automatic' }],
  ],
}
