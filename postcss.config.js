import postcssImport from 'postcss-import';
import postcssNesting from 'postcss-nesting';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';
import postcssPresetEnv from 'postcss-preset-env';

export default {
  plugins: [
    postcssImport,
    postcssNesting,
    tailwindcss,
    autoprefixer,
    postcssPresetEnv({
      features: { 'nesting-rules': false },
      browsers: 'last 2 versions',
    }),
  ],
};