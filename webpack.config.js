const createExpoWebpackConfigAsync = require('@expo/webpack-config');

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
        ],
      },
    },
    argv
  );

  // Customize webpack config
  config.resolve.alias = {
    ...config.resolve.alias,
    // Add platform-specific aliases
    './notificationService': './notificationService.web',
  };

  // Handle platform-specific extensions
  config.resolve.extensions = [
    '.web.js',
    '.web.ts',
    '.web.tsx',
    ...config.resolve.extensions,
  ];

  return config;
};