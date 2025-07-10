import { Platform } from 'react-native';

// Platform-specific utilities
export const isWeb = Platform.OS === 'web';
export const isIOS = Platform.OS === 'ios';
export const isAndroid = Platform.OS === 'android';
export const isMobile = isIOS || isAndroid;

// Feature availability checks
export const features = {
  camera: !isWeb,
  notifications: !isWeb,
  location: !isWeb,
  imagePicker: !isWeb,
  asyncStorage: true, // AsyncStorage works on web too
};

// Platform-specific messages
export const platformMessages = {
  camera: isWeb ? 'Camera features are only available on mobile devices' : '',
  notifications: isWeb ? 'Push notifications are only available on mobile devices' : '',
  location: isWeb ? 'Location detection is only available on mobile devices' : '',
};

// Web fallbacks
export const webFallbacks = {
  showCameraMessage: () => {
    if (isWeb) {
      alert('Camera features are only available in the mobile app. Download Go Garden from the App Store!');
      return true;
    }
    return false;
  },
  
  showNotificationMessage: () => {
    if (isWeb) {
      alert('Push notifications are only available in the mobile app. Download Go Garden from the App Store!');
      return true;
    }
    return false;
  },
  
  showLocationMessage: () => {
    if (isWeb) {
      alert('Location detection is only available in the mobile app. You can manually select your gardening zone.');
      return true;
    }
    return false;
  },
};