import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { plantIdentificationService } from '../utils/plantIdentificationService';

const IdentificationHistory = ({ onSelectPlant }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const data = await plantIdentificationService.loadIdentificationHistory();
      setHistory(data);
    } catch (error) {
      console.error('Error loading history:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return `Today, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else if (date.toDateString() === yesterday.toDateString()) {
      return `Yesterday, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else {
      return date.toLocaleDateString([], { 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };

  const handleSelectFromHistory = (item) => {
    if (item.matchedInDatabase) {
      Alert.alert(
        'Add to Garden',
        `Add ${item.plantName} to your garden?`,
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Add', 
            onPress: () => onSelectPlant(item.plantName)
          }
        ]
      );
    } else {
      Alert.alert(
        'Plant Not Available',
        `${item.plantName} is not available in our database yet.`
      );
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading history...</Text>
      </View>
    );
  }

  if (history.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="time-outline" size={64} color="#e5e7eb" />
        <Text style={styles.emptyText}>No identification history yet</Text>
        <Text style={styles.emptySubtext}>
          Take photos of plants to build your history
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>Identification History</Text>
      
      {history.map((item) => (
        <TouchableOpacity
          key={item.id}
          style={styles.historyItem}
          onPress={() => handleSelectFromHistory(item)}
        >
          <Image 
            source={{ uri: item.imageUri }} 
            style={styles.thumbnail}
          />
          
          <View style={styles.itemContent}>
            <Text style={styles.plantName}>{item.plantName}</Text>
            <Text style={styles.scientificName}>{item.scientificName}</Text>
            <View style={styles.itemMeta}>
              <Text style={styles.date}>{formatDate(item.date)}</Text>
              <View style={styles.confidenceBadge}>
                <Text style={styles.confidenceText}>{item.confidence}%</Text>
              </View>
            </View>
          </View>
          
          {item.matchedInDatabase && (
            <View style={styles.availableBadge}>
              <Ionicons name="checkmark-circle" size={20} color="#22c55e" />
            </View>
          )}
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#6b7280',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginTop: 20,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 20,
  },
  historyItem: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  thumbnail: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginRight: 15,
  },
  itemContent: {
    flex: 1,
  },
  plantName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  scientificName: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#6b7280',
    marginTop: 2,
  },
  itemMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  date: {
    fontSize: 12,
    color: '#9ca3af',
    flex: 1,
  },
  confidenceBadge: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  confidenceText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6b7280',
  },
  availableBadge: {
    justifyContent: 'center',
    marginLeft: 10,
  },
});

export default IdentificationHistory;