const createExpoWebpackConfigAsync = require('@expo/webpack-config');
const path = require('path');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(
    {
      ...env,
      babel: {
        dangerouslyAddModulePathsToTranspile: [
          '@expo/vector-icons',
          'expo-camera',
          'expo-notifications',
          'expo-location',
          'expo-image-picker',
          'expo-linear-gradient',
          'expo-device',
          'expo-image-manipulator',
        ],
      },
    },
    argv
  );

  // Customize webpack config
  config.resolve.alias = {
    ...config.resolve.alias,
    // Add platform-specific aliases for web
    'expo-notifications': path.resolve(__dirname, 'utils/notificationService.web.js'),
    'expo-camera': path.resolve(__dirname, 'utils/platform.js'),
    'expo-location': path.resolve(__dirname, 'utils/locationService.web.js'),
    './utils/locationService': path.resolve(__dirname, 'utils/locationService.web.js'),
    'expo-image-picker': path.resolve(__dirname, 'utils/platform.js'),
  };

  // Handle platform-specific extensions
  config.resolve.extensions = [
    '.web.js',
    '.web.ts',
    '.web.tsx',
    ...config.resolve.extensions,
  ];

  // Add fallbacks for Node.js modules not available in browser
  config.resolve.fallback = {
    ...config.resolve.fallback,
    "crypto": false,
    "stream": false,
  };

  return config;
};