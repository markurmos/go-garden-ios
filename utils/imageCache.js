import React from 'react';
import * as FileSystem from 'expo-file-system';
import { Image } from 'expo-image';

class ImageCacheService {
  constructor() {
    this.cache = new Map();
    this.preloadQueue = [];
    this.isPreloading = false;
    this.cacheDir = `${FileSystem.cacheDirectory}plant-images/`;
    this.maxCacheSize = 50 * 1024 * 1024; // 50MB cache limit
    this.maxCacheAge = 7 * 24 * 60 * 60 * 1000; // 7 days
    
    this.initializeCache();
  }

  async initializeCache() {
    try {
      // Create cache directory if it doesn't exist
      const dirInfo = await FileSystem.getInfoAsync(this.cacheDir);
      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(this.cacheDir, { intermediates: true });
        console.log('📁 Created image cache directory');
      }
      
      // Clean up old cached files
      await this.cleanupOldFiles();
      
      console.log('🖼️ Image cache service initialized');
    } catch (error) {
      console.error('Error initializing image cache:', error);
    }
  }

  // Generate cache key from URL
  getCacheKey(url) {
    // Create a more robust cache key that handles URL properly
    const urlParts = new URL(url);
    const pathKey = urlParts.pathname.replace(/[^a-zA-Z0-9]/g, '_');
    const hostKey = urlParts.hostname.replace(/[^a-zA-Z0-9]/g, '_');
    // Use a combination of host and path for uniqueness
    return `${hostKey}_${pathKey}`.substring(0, 100); // Limit length for filesystem
  }

  // Get cached file path
  getCacheFilePath(url) {
    try {
      const key = this.getCacheKey(url);
      // Extract extension more reliably
      const urlPath = new URL(url).pathname;
      const extension = urlPath.match(/\.([a-zA-Z0-9]+)(?:\?|$)/)?.[1] || 'jpg';
      return `${this.cacheDir}${key}.${extension}`;
    } catch (error) {
      // Fallback for invalid URLs
      const simpleKey = url.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 50);
      return `${this.cacheDir}${simpleKey}.jpg`;
    }
  }

  // Check if image is cached locally
  async isCached(url) {
    try {
      const filePath = this.getCacheFilePath(url);
      const fileInfo = await FileSystem.getInfoAsync(filePath);
      
      if (fileInfo.exists) {
        // Check if file is not too old
        const now = Date.now();
        const fileAge = now - fileInfo.modificationTime * 1000;
        
        if (fileAge < this.maxCacheAge) {
          return filePath;
        } else {
          // File is too old, delete it
          await FileSystem.deleteAsync(filePath);
          return false;
        }
      }
      
      return false;
    } catch (error) {
      console.error('Error checking cache:', error);
      return false;
    }
  }

  // Download and cache image
  async cacheImage(url) {
    try {
      const filePath = this.getCacheFilePath(url);
      
      // Check if already cached
      const cached = await this.isCached(url);
      if (cached) {
        return cached;
      }

      console.log(`📥 Caching image: ${url}`);
      
      // Ensure cache directory exists before downloading
      const dirInfo = await FileSystem.getInfoAsync(this.cacheDir);
      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(this.cacheDir, { intermediates: true });
      }
      
      // Download image
      const downloadResult = await FileSystem.downloadAsync(url, filePath);
      
      if (downloadResult.status === 200) {
        this.cache.set(url, filePath);
        console.log(`✅ Image cached successfully`);
        return filePath;
      } else {
        console.warn(`❌ Failed to download image (status: ${downloadResult.status})`);
        return null;
      }
    } catch (error) {
      console.error('Error caching image:', error.message);
      return null;
    }
  }

  // Get image URI (cached or original)
  async getImageUri(url) {
    if (!url) return null;

    try {
      // Check memory cache first
      if (this.cache.has(url)) {
        const cachedPath = this.cache.get(url);
        const exists = await FileSystem.getInfoAsync(cachedPath);
        if (exists.exists) {
          return cachedPath;
        } else {
          // File was deleted, remove from memory cache
          this.cache.delete(url);
        }
      }

      // Check file system cache
      const cached = await this.isCached(url);
      if (cached) {
        this.cache.set(url, cached);
        return cached;
      }

      // Not cached, return original URL and queue for caching
      this.queueForPreload(url);
      return url;
    } catch (error) {
      console.error('Error getting image URI:', error);
      return url; // Fallback to original URL
    }
  }

  // Queue image for background preloading
  queueForPreload(url) {
    if (!this.preloadQueue.includes(url)) {
      this.preloadQueue.push(url);
      this.startPreloading();
    }
  }

  // Start background preloading
  async startPreloading() {
    if (this.isPreloading || this.preloadQueue.length === 0) {
      return;
    }

    this.isPreloading = true;
    console.log(`🔄 Starting image preload queue (${this.preloadQueue.length} images)`);

    while (this.preloadQueue.length > 0) {
      const url = this.preloadQueue.shift();
      await this.cacheImage(url);
      
      // Small delay to prevent overwhelming the device
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    this.isPreloading = false;
    console.log('✅ Image preload queue completed');
  }

  // Preload multiple images
  async preloadImages(urls) {
    const validUrls = urls.filter(url => url && typeof url === 'string');
    console.log(`📋 Queuing ${validUrls.length} images for preload`);
    
    for (const url of validUrls) {
      this.queueForPreload(url);
    }
  }

  // Clean up old cached files
  async cleanupOldFiles() {
    try {
      const files = await FileSystem.readDirectoryAsync(this.cacheDir);
      const now = Date.now();
      let deletedCount = 0;
      let totalSize = 0;

      // Get file info for all cached files
      const fileInfos = await Promise.all(
        files.map(async (filename) => {
          const filePath = `${this.cacheDir}${filename}`;
          const info = await FileSystem.getInfoAsync(filePath);
          return { filename, filePath, info };
        })
      );

      // Sort by modification time (oldest first)
      fileInfos.sort((a, b) => a.info.modificationTime - b.info.modificationTime);

      for (const { filename, filePath, info } of fileInfos) {
        const fileAge = now - (info.modificationTime * 1000);
        
        // Delete if too old or if cache is getting too large
        if (fileAge > this.maxCacheAge || totalSize > this.maxCacheSize) {
          await FileSystem.deleteAsync(filePath);
          deletedCount++;
          console.log(`🗑️ Deleted old cached image: ${filename}`);
        } else {
          totalSize += info.size;
        }
      }

      if (deletedCount > 0) {
        console.log(`🧹 Cleaned up ${deletedCount} old cached images`);
      }
    } catch (error) {
      console.error('Error cleaning up cache:', error);
    }
  }

  // Clear all cached images
  async clearCache() {
    try {
      await FileSystem.deleteAsync(this.cacheDir);
      await FileSystem.makeDirectoryAsync(this.cacheDir, { intermediates: true });
      this.cache.clear();
      console.log('🧹 Image cache cleared');
    } catch (error) {
      console.error('Error clearing cache:', error);
    }
  }

  // Get cache statistics
  async getCacheStats() {
    try {
      const files = await FileSystem.readDirectoryAsync(this.cacheDir);
      let totalSize = 0;

      for (const filename of files) {
        const filePath = `${this.cacheDir}${filename}`;
        const info = await FileSystem.getInfoAsync(filePath);
        totalSize += info.size;
      }

      return {
        fileCount: files.length,
        totalSize: totalSize,
        totalSizeMB: (totalSize / (1024 * 1024)).toFixed(2),
        memoryCache: this.cache.size,
        queueLength: this.preloadQueue.length
      };
    } catch (error) {
      console.error('Error getting cache stats:', error);
      return null;
    }
  }
}

// Singleton instance
export const imageCache = new ImageCacheService();

// Optimized Image component with caching
export const CachedImage = ({ source, style, ...props }) => {
  const [imageUri, setImageUri] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [hasError, setHasError] = React.useState(false);

  React.useEffect(() => {
    if (source?.uri) {
      loadImage(source.uri);
    }
  }, [source?.uri]);

  const loadImage = async (url) => {
    try {
      setIsLoading(true);
      setHasError(false);
      
      const uri = await imageCache.getImageUri(url);
      setImageUri(uri);
    } catch (error) {
      console.error('Error loading cached image:', error);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };

  if (hasError) {
    return null; // Let parent component handle fallback
  }

  return (
    <Image
      source={imageUri ? { uri: imageUri } : source}
      style={style}
      contentFit="cover"
      transition={200}
      {...props}
    />
  );
};

export default imageCache; 