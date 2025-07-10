import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import PlantCard from './PlantCard';

const { width } = Dimensions.get('window');

const HomeView = ({ 
  searchQuery, 
  setSearchQuery, 
  selectedCategory, 
  setSelectedCategory, 
  categoryFilteredPlants, 
  currentMonth,
  setSelectedPlant,
  setShowAddModal 
}) => {
  const categories = ['All', 'Start indoors', 'Plant outside', 'Easy'];

  return (
    <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
      {/* Search Section */}
      <View style={styles.searchSection}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#9ca3af" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search vegetables"
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#9ca3af"
            accessible={true}
            accessibilityLabel="Search vegetables"
            accessibilityHint="Type to search for specific vegetables and herbs"
          />
        </View>
        <TouchableOpacity style={styles.addButton}>
          <Text style={styles.addButtonText}>Add plant</Text>
        </TouchableOpacity>
      </View>

      {/* What to grow section */}
      <View style={styles.growSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            What to grow in{' '}
            <Text style={styles.monthText}>{currentMonth}</Text>
          </Text>
          <TouchableOpacity>
            <Ionicons name="ellipsis-vertical" size={20} color="#9ca3af" />
          </TouchableOpacity>
        </View>

        {/* Category tabs */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.categoryContainer}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              onPress={() => setSelectedCategory(category)}
              style={[
                styles.categoryTab,
                selectedCategory === category && styles.activeCategoryTab
              ]}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel={`Filter by ${category}`}
              accessibilityState={{ selected: selectedCategory === category }}
            >
              <Text style={[
                styles.categoryText,
                selectedCategory === category && styles.activeCategoryText
              ]}>
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Plants grid */}
        <View style={styles.plantsGrid}>
          {categoryFilteredPlants.map((plant, index) => (
            <PlantCard 
              key={index} 
              plant={plant} 
              onPress={() => {
                setSelectedPlant(plant);
                setShowAddModal(true);
              }}
            />
          ))}
        </View>

        {categoryFilteredPlants.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="search" size={64} color="#d1d5db" />
            <Text style={styles.emptyTitle}>No plants found</Text>
            <Text style={styles.emptyDescription}>
              Try adjusting your search or category filter.
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  searchSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    gap: 12,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#bbf7d0',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#374151',
  },
  addButton: {
    backgroundColor: '#22c55e',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  growSection: {
    marginTop: 24,
    marginBottom: 100,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  monthText: {
    color: '#22c55e',
  },
  categoryContainer: {
    marginBottom: 16,
  },
  categoryTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    marginRight: 8,
  },
  activeCategoryTab: {
    backgroundColor: '#22c55e',
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
  },
  activeCategoryText: {
    color: 'white',
  },
  plantsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
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
});

export default HomeView; 