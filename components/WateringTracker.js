import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PLANT_DATABASE, getPlantCareSchedule } from '../data/plantDatabase';
import { notificationService } from '../utils/notificationService';

const WateringTracker = ({ plants, onUpdatePlant }) => {
  const [expandedPlant, setExpandedPlant] = useState(null);
  const [animatedValues, setAnimatedValues] = useState({});

  useEffect(() => {
    // Initialize animated values for each plant
    const values = {};
    plants.forEach(plant => {
      values[plant.id] = new Animated.Value(0);
    });
    setAnimatedValues(values);
  }, [plants]);

  const handleWaterPlant = async (plant) => {
    // Animate water drop
    if (animatedValues[plant.id]) {
      Animated.sequence([
        Animated.timing(animatedValues[plant.id], {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValues[plant.id], {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }

    // Update last watered date
    const updatedPlant = {
      ...plant,
      lastWatered: new Date().toISOString(),
    };

    onUpdatePlant(updatedPlant);

    // Reschedule watering reminder
    await notificationService.scheduleWateringReminder(
      plant,
      plant.plantedDate,
      plant.gardenName || 'My Garden'
    );

    Alert.alert(
      '💧 Watered!',
      `${plant.name} has been watered. Next watering reminder scheduled.`,
      [{ text: 'OK' }]
    );
  };

  const getDaysUntilWatering = (plant) => {
    const plantInfo = PLANT_DATABASE[plant.name];
    if (!plantInfo || !plant.lastWatered) return 0;

    const lastWatered = new Date(plant.lastWatered);
    const today = new Date();
    const daysSinceWatering = Math.floor((today - lastWatered) / (1000 * 60 * 60 * 24));
    const daysUntilNext = plantInfo.wateringFrequency - daysSinceWatering;

    return Math.max(0, daysUntilNext);
  };

  const getWateringStatus = (daysUntil) => {
    if (daysUntil === 0) return { text: 'Water Today!', color: '#F44336' };
    if (daysUntil === 1) return { text: 'Water Tomorrow', color: '#FF9800' };
    return { text: `Water in ${daysUntil} days`, color: '#4CAF50' };
  };

  const renderPlantItem = (plant) => {
    const plantInfo = PLANT_DATABASE[plant.name];
    if (!plantInfo) return null;

    const schedule = getPlantCareSchedule(plant.name, plant.plantedDate);
    const daysUntilWatering = getDaysUntilWatering(plant);
    const status = getWateringStatus(daysUntilWatering);
    const isExpanded = expandedPlant === plant.id;

    const dropScale = animatedValues[plant.id]?.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 1.5],
    }) || 1;

    return (
      <TouchableOpacity
        key={plant.id}
        style={styles.plantCard}
        onPress={() => setExpandedPlant(isExpanded ? null : plant.id)}
        activeOpacity={0.8}
      >
        <View style={styles.plantHeader}>
          <View style={styles.plantInfo}>
            <Text style={styles.plantName}>{plant.name}</Text>
            <Text style={[styles.wateringStatus, { color: status.color }]}>
              {status.text}
            </Text>
          </View>
          
          <TouchableOpacity
            style={[styles.waterButton, { backgroundColor: status.color }]}
            onPress={() => handleWaterPlant(plant)}
          >
            <Animated.View style={{ transform: [{ scale: dropScale }] }}>
              <Ionicons name="water" size={24} color="white" />
            </Animated.View>
          </TouchableOpacity>
        </View>

        {isExpanded && (
          <View style={styles.expandedContent}>
            <View style={styles.progressContainer}>
              <Text style={styles.progressLabel}>Growth Progress</Text>
              <View style={styles.progressBar}>
                <View 
                  style={[
                    styles.progressFill, 
                    { width: `${schedule?.progress || 0}%` }
                  ]} 
                />
              </View>
              <Text style={styles.progressText}>
                {schedule?.progress || 0}% ({schedule?.daysSincePlanting || 0} days)
              </Text>
            </View>

            <View style={styles.scheduleInfo}>
              <View style={styles.infoRow}>
                <Ionicons name="water-outline" size={20} color="#2196F3" />
                <Text style={styles.infoText}>
                  Water every {plantInfo.wateringFrequency} day{plantInfo.wateringFrequency > 1 ? 's' : ''}
                </Text>
              </View>
              
              <View style={styles.infoRow}>
                <Ionicons name="sunny-outline" size={20} color="#FFC107" />
                <Text style={styles.infoText}>{plantInfo.sunlight}</Text>
              </View>

              <View style={styles.infoRow}>
                <Ionicons name="calendar-outline" size={20} color="#4CAF50" />
                <Text style={styles.infoText}>
                  Harvest in ~{schedule?.daysUntilHarvest || 0} days
                </Text>
              </View>

              {plant.lastWatered && (
                <View style={styles.infoRow}>
                  <Ionicons name="checkmark-circle-outline" size={20} color="#4CAF50" />
                  <Text style={styles.infoText}>
                    Last watered: {new Date(plant.lastWatered).toLocaleDateString()}
                  </Text>
                </View>
              )}
            </View>

            <View style={styles.careActions}>
              <TouchableOpacity style={styles.actionButton}>
                <Ionicons name="create-outline" size={20} color="#666" />
                <Text style={styles.actionText}>Add Note</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.actionButton}>
                <Ionicons name="camera-outline" size={20} color="#666" />
                <Text style={styles.actionText}>Take Photo</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.actionButton}>
                <Ionicons name="nutrition-outline" size={20} color="#666" />
                <Text style={styles.actionText}>Fertilize</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  if (plants.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="water-outline" size={64} color="#E0E0E0" />
        <Text style={styles.emptyText}>No plants to water yet</Text>
        <Text style={styles.emptySubtext}>Add plants to your garden to track watering</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Watering Schedule</Text>
        <TouchableOpacity style={styles.settingsButton}>
          <Ionicons name="settings-outline" size={24} color="#666" />
        </TouchableOpacity>
      </View>

      <View style={styles.summary}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryNumber}>
            {plants.filter(p => getDaysUntilWatering(p) === 0).length}
          </Text>
          <Text style={styles.summaryLabel}>Need Water Today</Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryNumber}>{plants.length}</Text>
          <Text style={styles.summaryLabel}>Total Plants</Text>
        </View>
      </View>

      {plants.map(renderPlantItem)}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  settingsButton: {
    padding: 5,
  },
  summary: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  plantCard: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginBottom: 15,
    borderRadius: 15,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  plantHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  plantInfo: {
    flex: 1,
  },
  plantName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 5,
  },
  wateringStatus: {
    fontSize: 16,
    fontWeight: '500',
  },
  waterButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  expandedContent: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  progressContainer: {
    marginBottom: 20,
  },
  progressLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  scheduleInfo: {
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 10,
  },
  careActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  actionButton: {
    alignItems: 'center',
    padding: 10,
  },
  actionText: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    marginTop: 20,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 10,
  },
});

export default WateringTracker;