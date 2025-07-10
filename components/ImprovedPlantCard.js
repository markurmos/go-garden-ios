import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Animated,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { PLANT_DATABASE } from '../data/plantDatabase';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2;

const ImprovedPlantCard = ({ plant, onPress, onAddToGarden, isInGarden }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [scaleAnim] = useState(new Animated.Value(1));
  const plantData = PLANT_DATABASE[plant.name] || {};

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const getDifficultyColor = () => {
    switch (plantData.difficulty) {
      case 'Easy': return '#22c55e';
      case 'Moderate': return '#f59e0b';
      case 'Hard': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getSeasonIcon = () => {
    const season = plantData.season?.[0];
    switch (season) {
      case 'Spring': return 'flower-outline';
      case 'Summer': return 'sunny-outline';
      case 'Fall': return 'leaf-outline';
      case 'Winter': return 'snow-outline';
      default: return 'calendar-outline';
    }
  };

  return (
    <Animated.View style={[styles.container, { transform: [{ scale: scaleAnim }] }]}>
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: plant.images?.[0] }}
            style={styles.image}
            onLoad={() => setImageLoaded(true)}
          />
          
          {!imageLoaded && (
            <View style={styles.imagePlaceholder}>
              <Ionicons name="leaf-outline" size={40} color="#e5e7eb" />
            </View>
          )}

          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.7)']}
            style={styles.gradient}
          >
            <View style={styles.imageOverlay}>
              <View style={styles.difficultyBadge}>
                <View style={[styles.difficultyDot, { backgroundColor: getDifficultyColor() }]} />
                <Text style={styles.difficultyText}>{plantData.difficulty || 'Easy'}</Text>
              </View>
              
              {isInGarden && (
                <View style={styles.inGardenBadge}>
                  <Ionicons name="checkmark-circle" size={20} color="#22c55e" />
                </View>
              )}
            </View>
          </LinearGradient>
        </View>

        <View style={styles.content}>
          <Text style={styles.plantName} numberOfLines={1}>{plant.name}</Text>
          
          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Ionicons name="time-outline" size={14} color="#6b7280" />
              <Text style={styles.infoText}>{plantData.growthTime || `${plant.daysToHarvest} days`}</Text>
            </View>
            
            <View style={styles.infoItem}>
              <Ionicons name={getSeasonIcon()} size={14} color="#6b7280" />
              <Text style={styles.infoText}>{plantData.season?.[0] || 'All seasons'}</Text>
            </View>
          </View>

          <View style={styles.tagRow}>
            <View style={[styles.tag, { backgroundColor: '#e0f2fe' }]}>
              <Ionicons name="water-outline" size={12} color="#0369a1" />
              <Text style={[styles.tagText, { color: '#0369a1' }]}>
                {plantData.wateringFrequency ? `${plantData.wateringFrequency}d` : plant.waterNeeds}
              </Text>
            </View>
            
            <View style={[styles.tag, { backgroundColor: '#fef3c7' }]}>
              <Ionicons name="sunny-outline" size={12} color="#d97706" />
              <Text style={[styles.tagText, { color: '#d97706' }]}>
                {plantData.sunlight?.split(' ')[0] || 'Full'}
              </Text>
            </View>
          </View>

          {!isInGarden && (
            <TouchableOpacity
              style={styles.addButton}
              onPress={(e) => {
                e.stopPropagation();
                onAddToGarden(plant);
              }}
            >
              <Ionicons name="add-circle" size={20} color="#22c55e" />
              <Text style={styles.addButtonText}>Add to Garden</Text>
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    backgroundColor: 'white',
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  imageContainer: {
    height: 140,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 80,
    justifyContent: 'flex-end',
  },
  imageOverlay: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    padding: 12,
  },
  difficultyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  difficultyDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 4,
  },
  difficultyText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
  },
  inGardenBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 16,
  },
  plantName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoText: {
    fontSize: 12,
    color: '#6b7280',
    marginLeft: 4,
  },
  tagRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 12,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  tagText: {
    fontSize: 11,
    fontWeight: '600',
    marginLeft: 4,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0fdf4',
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#bbf7d0',
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#22c55e',
    marginLeft: 4,
  },
});

export default ImprovedPlantCard;