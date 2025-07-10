// Platform utilities for web compatibility

// Mock expo-camera for web
export const Camera = {
  Constants: {
    Type: {
      back: 'back',
      front: 'front',
    },
    FlashMode: {
      off: 'off',
      on: 'on',
      auto: 'auto',
    },
  },
  requestCameraPermissionsAsync: async () => ({
    status: 'denied',
    canAskAgain: false,
  }),
};

// Mock expo-image-picker for web
export const launchCameraAsync = async () => ({
  cancelled: true,
});

export const launchImageLibraryAsync = async () => ({
  cancelled: true,
});

export const requestCameraPermissionsAsync = async () => ({
  status: 'denied',
  canAskAgain: false,
});

export const MediaTypeOptions = {
  Images: 'Images',
  Videos: 'Videos',
  All: 'All',
};

// Platform check
export const isWeb = true;
export const isMobile = false;