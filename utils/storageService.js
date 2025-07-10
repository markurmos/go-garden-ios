import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  MY_GARDEN: '@GoGarden:myGarden',
  USER_PREFERENCES: '@GoGarden:preferences',
  LOCATION_DATA: '@GoGarden:location',
  NOTIFICATION_SETTINGS: '@GoGarden:notifications',
  WATERING_HISTORY: '@GoGarden:wateringHistory',
  PLANT_NOTES: '@GoGarden:plantNotes',
  APP_SETTINGS: '@GoGarden:settings',
};

class StorageService {
  // Save my garden data
  async saveMyGarden(gardenData) {
    try {
      const jsonValue = JSON.stringify(gardenData);
      await AsyncStorage.setItem(STORAGE_KEYS.MY_GARDEN, jsonValue);
      console.log('✅ Garden data saved successfully');
      return true;
    } catch (error) {
      console.error('Error saving garden data:', error);
      return false;
    }
  }

  // Load my garden data
  async loadMyGarden() {
    try {
      const jsonValue = await AsyncStorage.getItem(STORAGE_KEYS.MY_GARDEN);
      return jsonValue != null ? JSON.parse(jsonValue) : [];
    } catch (error) {
      console.error('Error loading garden data:', error);
      return [];
    }
  }

  // Save user preferences
  async savePreferences(preferences) {
    try {
      const jsonValue = JSON.stringify(preferences);
      await AsyncStorage.setItem(STORAGE_KEYS.USER_PREFERENCES, jsonValue);
      return true;
    } catch (error) {
      console.error('Error saving preferences:', error);
      return false;
    }
  }

  // Load user preferences
  async loadPreferences() {
    try {
      const jsonValue = await AsyncStorage.getItem(STORAGE_KEYS.USER_PREFERENCES);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (error) {
      console.error('Error loading preferences:', error);
      return null;
    }
  }

  // Save location data
  async saveLocation(locationData) {
    try {
      const jsonValue = JSON.stringify({
        ...locationData,
        lastUpdated: new Date().toISOString(),
      });
      await AsyncStorage.setItem(STORAGE_KEYS.LOCATION_DATA, jsonValue);
      return true;
    } catch (error) {
      console.error('Error saving location:', error);
      return false;
    }
  }

  // Load location data
  async loadLocation() {
    try {
      const jsonValue = await AsyncStorage.getItem(STORAGE_KEYS.LOCATION_DATA);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (error) {
      console.error('Error loading location:', error);
      return null;
    }
  }

  // Save notification settings
  async saveNotificationSettings(settings) {
    try {
      const jsonValue = JSON.stringify(settings);
      await AsyncStorage.setItem(STORAGE_KEYS.NOTIFICATION_SETTINGS, jsonValue);
      return true;
    } catch (error) {
      console.error('Error saving notification settings:', error);
      return false;
    }
  }

  // Load notification settings
  async loadNotificationSettings() {
    try {
      const jsonValue = await AsyncStorage.getItem(STORAGE_KEYS.NOTIFICATION_SETTINGS);
      return jsonValue != null ? JSON.parse(jsonValue) : {
        wateringReminders: true,
        harvestReminders: true,
        dailyCheck: true,
        careTips: true,
      };
    } catch (error) {
      console.error('Error loading notification settings:', error);
      return {
        wateringReminders: true,
        harvestReminders: true,
        dailyCheck: true,
        careTips: true,
      };
    }
  }

  // Save watering history
  async saveWateringHistory(plantId, wateringData) {
    try {
      const history = await this.loadWateringHistory();
      if (!history[plantId]) {
        history[plantId] = [];
      }
      history[plantId].push({
        date: new Date().toISOString(),
        ...wateringData,
      });
      
      // Keep only last 30 entries per plant
      if (history[plantId].length > 30) {
        history[plantId] = history[plantId].slice(-30);
      }
      
      const jsonValue = JSON.stringify(history);
      await AsyncStorage.setItem(STORAGE_KEYS.WATERING_HISTORY, jsonValue);
      return true;
    } catch (error) {
      console.error('Error saving watering history:', error);
      return false;
    }
  }

  // Load watering history
  async loadWateringHistory() {
    try {
      const jsonValue = await AsyncStorage.getItem(STORAGE_KEYS.WATERING_HISTORY);
      return jsonValue != null ? JSON.parse(jsonValue) : {};
    } catch (error) {
      console.error('Error loading watering history:', error);
      return {};
    }
  }

  // Save plant notes
  async savePlantNote(plantId, note) {
    try {
      const notes = await this.loadPlantNotes();
      if (!notes[plantId]) {
        notes[plantId] = [];
      }
      notes[plantId].push({
        id: Date.now().toString(),
        text: note,
        date: new Date().toISOString(),
      });
      
      const jsonValue = JSON.stringify(notes);
      await AsyncStorage.setItem(STORAGE_KEYS.PLANT_NOTES, jsonValue);
      return true;
    } catch (error) {
      console.error('Error saving plant note:', error);
      return false;
    }
  }

  // Load plant notes
  async loadPlantNotes() {
    try {
      const jsonValue = await AsyncStorage.getItem(STORAGE_KEYS.PLANT_NOTES);
      return jsonValue != null ? JSON.parse(jsonValue) : {};
    } catch (error) {
      console.error('Error loading plant notes:', error);
      return {};
    }
  }

  // Delete plant note
  async deletePlantNote(plantId, noteId) {
    try {
      const notes = await this.loadPlantNotes();
      if (notes[plantId]) {
        notes[plantId] = notes[plantId].filter(note => note.id !== noteId);
        const jsonValue = JSON.stringify(notes);
        await AsyncStorage.setItem(STORAGE_KEYS.PLANT_NOTES, jsonValue);
      }
      return true;
    } catch (error) {
      console.error('Error deleting plant note:', error);
      return false;
    }
  }

  // Save app settings
  async saveAppSettings(settings) {
    try {
      const jsonValue = JSON.stringify(settings);
      await AsyncStorage.setItem(STORAGE_KEYS.APP_SETTINGS, jsonValue);
      return true;
    } catch (error) {
      console.error('Error saving app settings:', error);
      return false;
    }
  }

  // Load app settings
  async loadAppSettings() {
    try {
      const jsonValue = await AsyncStorage.getItem(STORAGE_KEYS.APP_SETTINGS);
      return jsonValue != null ? JSON.parse(jsonValue) : {
        theme: 'light',
        units: 'imperial',
        language: 'en',
      };
    } catch (error) {
      console.error('Error loading app settings:', error);
      return {
        theme: 'light',
        units: 'imperial',
        language: 'en',
      };
    }
  }

  // Clear all data
  async clearAllData() {
    try {
      const keys = Object.values(STORAGE_KEYS);
      await AsyncStorage.multiRemove(keys);
      console.log('🗑️ All data cleared');
      return true;
    } catch (error) {
      console.error('Error clearing data:', error);
      return false;
    }
  }

  // Get storage info
  async getStorageInfo() {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const result = await AsyncStorage.multiGet(keys);
      
      let totalSize = 0;
      const info = result.map(([key, value]) => {
        const size = value ? value.length : 0;
        totalSize += size;
        return {
          key,
          size: `${(size / 1024).toFixed(2)} KB`,
        };
      });
      
      return {
        items: info,
        totalSize: `${(totalSize / 1024).toFixed(2)} KB`,
        itemCount: keys.length,
      };
    } catch (error) {
      console.error('Error getting storage info:', error);
      return null;
    }
  }
}

// Create singleton instance
export const storageService = new StorageService();

// Export storage keys for testing
export { STORAGE_KEYS };