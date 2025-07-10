import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { CachedImage } from '../utils/imageCache';

const { width } = Dimensions.get('window');

const PlantCard = ({ plant, onPress }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [showFallback, setShowFallback] = useState(false);

  const getDifficultyInfo = (category) => {
    if (['leafy', 'herb', 'root', 'allium', 'legume'].includes(category)) {
      return { label: 'Easy', color: '#22c55e', backgroundColor: '#dcfce7' };
    } else if (['fruit', 'brassica'].includes(category)) {
      return { label: 'Medium', color: '#eab308', backgroundColor: '#fef3c7' };
    } else {
      return { label: 'Hard', color: '#f97316', backgroundColor: '#fed7aa' };
    }
  };

  const difficulty = getDifficultyInfo(plant.category);

  const handleImageError = () => {
    console.log(`Image failed for ${plant.name}, trying next image (${currentImageIndex + 1}/${plant.images.length})`);
    
    if (currentImageIndex < plant.images.length - 1) {
      // Try next image
      setCurrentImageIndex(currentImageIndex + 1);
      setImageError(false);
    } else {
      // All images failed, show fallback
      console.log(`All images failed for ${plant.name}, showing fallback`);
      setShowFallback(true);
    }
  };

  const handleImageLoad = () => {
    console.log(`Image loaded successfully for ${plant.name}`);
    setImageLoaded(true);
    setImageError(false);
  };

  const getCurrentImageSource = () => {
    if (showFallback || !plant.images || plant.images.length === 0) {
      return null;
    }
    return { uri: plant.images[currentImageIndex] };
  };

  return (
    <TouchableOpacity 
      style={styles.plantCard} 
      onPress={onPress}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={`${plant.name} plant card`}
      accessibilityHint={`Tap to add ${plant.name} to your garden. Takes ${plant.daysToHarvest} days to harvest.`}
    >
      <View style={styles.imageContainer}>
        {showFallback ? (
          // Fallback display with plant name and color
          <View style={styles.fallbackContainer}>
            <Text style={styles.fallbackText}>{plant.name}</Text>
            <Text style={styles.fallbackSubtext}>
              {plant.season === 'cool' ? '❄️' : '☀️'}
            </Text>
          </View>
        ) : (
          // Image display
          <CachedImage 
            source={getCurrentImageSource()}
            style={styles.plantImage}
            onError={handleImageError}
            onLoad={handleImageLoad}
            contentFit="cover"
            accessible={true}
            accessibilityLabel={`${plant.name} plant image`}
          />
        )}
        
        <View style={[styles.difficultyBadge, { backgroundColor: difficulty.backgroundColor }]}>
          <Text style={[styles.difficultyText, { color: difficulty.color }]}>
            {difficulty.label}
          </Text>
        </View>
      </View>
      <View style={styles.cardContent}>
        <Text style={styles.plantName}>{plant.name}</Text>
        <Text style={styles.harvestInfo}>{plant.daysToHarvest} days to harvest</Text>
        <Text style={styles.plantDetails}>
          {plant.season === 'cool' ? 'Cool season crop' : 'Warm season crop'}. 
          Space {plant.spacing}" apart.
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  plantCard: {
    width: (width - 48) / 2,
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  imageContainer: {
    position: 'relative',
    height: 120,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    overflow: 'hidden',
  },
  plantImage: {
    width: '100%',
    height: '100%',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  fallbackContainer: {
    width: '100%',
    height: '100%',
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
  difficultyBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  difficultyText: {
    fontSize: 12,
    fontWeight: '500',
  },
  cardContent: {
    padding: 16,
  },
  plantName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  harvestInfo: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
  },
  plantDetails: {
    fontSize: 12,
    color: '#9ca3af',
    lineHeight: 16,
  },
});

export default PlantCard; 