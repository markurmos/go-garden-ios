import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CachedImage } from '../utils/imageCache';

const SmartPlantImage = ({ plant, style, children }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showFallback, setShowFallback] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Reset state when plant changes
    setCurrentImageIndex(0);
    setShowFallback(false);
    setIsLoading(true);
  }, [plant.name]);

  const handleImageError = () => {
    console.log(`Image failed for ${plant.name}, trying next image (${currentImageIndex + 1}/${plant.images?.length || 0})`);
    
    if (plant.images && currentImageIndex < plant.images.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
      setIsLoading(true);
    } else {
      console.log(`All images failed for ${plant.name}, showing fallback`);
      setShowFallback(true);
      setIsLoading(false);
    }
  };

  const handleImageLoad = () => {
    console.log(`Image loaded successfully for ${plant.name}`);
    setIsLoading(false);
  };

  if (showFallback || !plant.images || plant.images.length === 0) {
    return (
      <View style={[style, styles.fallbackContainer]}>
        <Text style={styles.fallbackText}>{plant.name}</Text>
        <Text style={styles.fallbackSubtext}>
          {plant.season === 'cool' ? '❄️' : '☀️'}
        </Text>
        {children}
      </View>
    );
  }

  return (
    <View style={style}>
      <CachedImage 
        source={{ uri: plant.images[currentImageIndex] }}
        style={styles.plantImage}
        onError={handleImageError}
        onLoad={handleImageLoad}
        contentFit="cover"
      />
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      )}
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  fallbackContainer: {
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  fallbackText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#475569',
    textAlign: 'center',
    marginBottom: 4,
  },
  fallbackSubtext: {
    fontSize: 24,
    textAlign: 'center',
  },
  plantImage: {
    width: '100%',
    height: '100%',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
  },
});

export default SmartPlantImage; 