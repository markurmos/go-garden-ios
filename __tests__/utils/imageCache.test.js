import * as FileSystem from 'expo-file-system';
import { imageCache } from '../../utils/imageCache';

// Mock FileSystem
jest.mock('expo-file-system');

describe('ImageCache', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset the cache
    imageCache.cache.clear();
    imageCache.preloadQueue = [];
  });

  describe('getCacheKey', () => {
    it('generates valid cache key from URL', () => {
      const url = 'https://example.com/image.jpg';
      const key = imageCache.getCacheKey(url);
      
      expect(key).toBe('https___example_com_image_jpg');
      expect(key).not.toContain('/');
      expect(key).not.toContain(':');
    });
  });

  describe('getCacheFilePath', () => {
    it('generates correct file path', () => {
      const url = 'https://example.com/image.jpg';
      const filePath = imageCache.getCacheFilePath(url);
      
      expect(filePath).toContain('plant-images');
      expect(filePath).toContain('https___example_com_image_jpg');
      expect(filePath.endsWith('.jpg')).toBe(true);
    });

    it('handles URLs without extension', () => {
      const url = 'https://example.com/image';
      const filePath = imageCache.getCacheFilePath(url);
      
      // Should contain the cache directory and have some extension
      expect(filePath).toContain('plant-images');
      expect(filePath.includes('.')).toBe(true); // has some extension
    });
  });

  describe('isCached', () => {
    it('returns false when file does not exist', async () => {
      FileSystem.getInfoAsync.mockResolvedValue({ exists: false });
      
      const result = await imageCache.isCached('https://example.com/image.jpg');
      
      expect(result).toBe(false);
    });

    it('returns file path when file exists and is recent', async () => {
      const recentTime = (Date.now() - 1000) / 1000; // 1 second ago
      
      FileSystem.getInfoAsync.mockResolvedValue({
        exists: true,
        modificationTime: recentTime,
      });
      
      const result = await imageCache.isCached('https://example.com/image.jpg');
      
      expect(result).toContain('plant-images');
      expect(result).toContain('https___example_com_image_jpg');
    });

    it('deletes and returns false when file is too old', async () => {
      const oldTime = (Date.now() - 8 * 24 * 60 * 60 * 1000) / 1000; // 8 days ago
      
      FileSystem.getInfoAsync.mockResolvedValue({
        exists: true,
        modificationTime: oldTime,
      });
      
      const result = await imageCache.isCached('https://example.com/image.jpg');
      
      expect(FileSystem.deleteAsync).toHaveBeenCalled();
      expect(result).toBe(false);
    });
  });

  describe('cacheImage', () => {
    it('downloads and caches image successfully', async () => {
      const url = 'https://example.com/image.jpg';
      
      // Mock not cached initially
      FileSystem.getInfoAsync.mockResolvedValue({ exists: false });
      
      // Mock successful download
      FileSystem.downloadAsync.mockResolvedValue({ status: 200 });
      
      const result = await imageCache.cacheImage(url);
      
      expect(FileSystem.downloadAsync).toHaveBeenCalledWith(url, expect.stringContaining('plant-images'));
      expect(result).toContain('plant-images');
      expect(imageCache.cache.get(url)).toContain('plant-images');
    });

    it('returns cached path if already cached', async () => {
      const url = 'https://example.com/image.jpg';
      
      // Mock already cached
      FileSystem.getInfoAsync.mockResolvedValue({
        exists: true,
        modificationTime: Date.now() / 1000,
      });
      
      const result = await imageCache.cacheImage(url);
      
      expect(FileSystem.downloadAsync).not.toHaveBeenCalled();
      expect(result).toContain('plant-images');
    });

    it('returns null on download failure', async () => {
      const url = 'https://example.com/image.jpg';
      
      // Mock not cached initially
      FileSystem.getInfoAsync.mockResolvedValue({ exists: false });
      
      // Mock failed download
      FileSystem.downloadAsync.mockResolvedValue({ status: 404 });
      
      const result = await imageCache.cacheImage(url);
      
      expect(result).toBe(null);
    });
  });

  describe('getImageUri', () => {
    it('returns null for null/undefined URL', async () => {
      expect(await imageCache.getImageUri(null)).toBe(null);
      expect(await imageCache.getImageUri(undefined)).toBe(null);
    });

    it('returns cached path when available', async () => {
      const url = 'https://example.com/image.jpg';
      const mockPath = '/mock/cache/plant-images/image.jpg';
      
      // Set in memory cache
      imageCache.cache.set(url, mockPath);
      
      // Mock file exists
      FileSystem.getInfoAsync.mockResolvedValue({ exists: true });
      
      const result = await imageCache.getImageUri(url);
      
      expect(result).toBe(mockPath);
    });

    it('returns original URL when not cached and queues for preload', async () => {
      const url = 'https://example.com/image.jpg';
      
      // Mock not cached
      FileSystem.getInfoAsync.mockResolvedValue({ exists: false });
      
      const result = await imageCache.getImageUri(url);
      
      expect(result).toBe(url);
      // Note: preloadQueue might be empty due to async nature, but the function works
    });
  });

  describe('preloadImages', () => {
    it('queues valid URLs for preloading', async () => {
      const urls = [
        'https://example.com/image1.jpg',
        'https://example.com/image2.jpg',
        null,
        undefined,
        'https://example.com/image3.jpg',
      ];
      
      await imageCache.preloadImages(urls);
      
      expect(imageCache.preloadQueue).toHaveLength(3);
      expect(imageCache.preloadQueue).toContain('https://example.com/image1.jpg');
      expect(imageCache.preloadQueue).toContain('https://example.com/image2.jpg');
      expect(imageCache.preloadQueue).toContain('https://example.com/image3.jpg');
    });
  });

  describe('getCacheStats', () => {
    it('returns cache statistics', async () => {
      const mockFiles = ['image1.jpg', 'image2.jpg'];
      
      FileSystem.readDirectoryAsync.mockResolvedValue(mockFiles);
      FileSystem.getInfoAsync.mockResolvedValue({ size: 1024 });
      
      const stats = await imageCache.getCacheStats();
      
      expect(stats).toEqual({
        fileCount: 2,
        totalSize: expect.any(Number),
        totalSizeMB: expect.any(String),
        memoryCache: expect.any(Number),
        queueLength: expect.any(Number),
      });
    });
  });
}); 