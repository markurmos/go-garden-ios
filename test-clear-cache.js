// Test script to clear image cache
import * as FileSystem from 'expo-file-system';

const clearImageCache = async () => {
  const cacheDir = `${FileSystem.cacheDirectory}plant-images/`;
  
  try {
    // Check if directory exists
    const dirInfo = await FileSystem.getInfoAsync(cacheDir);
    
    if (dirInfo.exists) {
      // Delete the directory
      await FileSystem.deleteAsync(cacheDir, { idempotent: true });
      console.log('✅ Image cache cleared successfully');
    } else {
      console.log('📁 Cache directory does not exist');
    }
    
    // Recreate empty directory
    await FileSystem.makeDirectoryAsync(cacheDir, { intermediates: true });
    console.log('📁 Created fresh cache directory');
    
  } catch (error) {
    console.error('❌ Error clearing cache:', error);
  }
};

// If running directly
if (require.main === module) {
  clearImageCache();
}

export default clearImageCache;