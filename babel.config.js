module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    '@babel/plugin-transform-export-namespace-from',
    [
      'module-resolver',
      {
        root: ['./src'],
        extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
        alias: {
          '@': './src',
          '@api': './src/api',
          '@components': './src/components',
          '@config': './src/config',
          '@navigation': './src/navigation',
          '@screens': './src/screens',
          '@store': './src/store',
          '@theme': './src/theme',
          '@validation': './src/validation',
        },
      },
    ],
    'react-native-reanimated/plugin',
  ],
};
