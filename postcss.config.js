import postcssNesting from 'postcss-nesting';

module.exports = {
  parser: 'sugarss',
  map: false,
  plugins: {
    'postcss-plugin': {
      postcssNesting,
    },
  },
};
