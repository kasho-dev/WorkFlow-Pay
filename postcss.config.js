module.exports = {
  plugins: [
    require('postcss-import'),
    require('tailwindcss/nesting')(require('postcss-nesting')),
    require('tailwindcss'),
    require('autoprefixer'),
    require('postcss-preset-env')({
      features: { 'nesting-rules': false },
      browsers: 'last 2 versions',
    }),
  ],
};