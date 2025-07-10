import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import SmartPlantImage from './SmartPlantImage';

const MyGardenView = ({ myGarden, removeFromGarden }) => {
  return (
    <ScrollView style={styles.content}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>
          My Garden ({myGarden.length} plants)
        </Text>
      </View>

      {myGarden.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="flower-outline" size={64} color="#d1d5db" />
          <Text style={styles.emptyTitle}>Your garden is empty</Text>
          <Text style={styles.emptyDescription}>
            Tap on plants in the Home tab to add them to your garden.
          </Text>
        </View>
      ) : (
        <View style={styles.plantsGrid}>
          {myGarden.map((plant, index) => (
            <View key={index} style={styles.plantCard}>
              <SmartPlantImage 
                plant={plant} 
                style={styles.imageContainer}
              >
                <TouchableOpacity 
                  style={styles.removeButton}
                  onPress={() => removeFromGarden(plant.name)}
                  accessible={true}
                  accessibilityRole="button"
                  accessibilityLabel={`Remove ${plant.name} from garden`}
                  accessibilityHint="Tap to remove this plant from your garden"
                >
                  <Ionicons name="close" size={16} color="white" />
                </TouchableOpacity>
              </SmartPlantImage>
              <View style={styles.cardContent}>
                <Text style={styles.plantName}>{plant.name}</Text>
                <Text style={styles.harvestInfo}>{plant.daysToHarvest} days to harvest</Text>
                <Text style={styles.plantDetails}>
                  Added {new Date(plant.addedDate).toLocaleDateString()}
                </Text>
              </View>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
  plantsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  plantCard: {
    width: '48%',
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
  removeButton: {
    position: 'absolute',
    top: 8,
    left: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(239, 68, 68, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
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

export default MyGardenView; 