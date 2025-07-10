import * as FileSystem from 'expo-file-system';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import config from '../config';
import { PLANT_DATABASE } from '../data/plantDatabase';

class PlantIdentificationService {
  constructor() {
    this.plantNetApiKey = config.plantNet?.apiKey || '2b10uGhJxsVQteqmUE9CrkOCu';
    this.plantNetBaseUrl = 'https://my-api.plantnet.org/v2';
    this.maxImageSize = 1024; // Max dimension in pixels
    this.confidence_threshold = 0.1; // Minimum confidence score
  }

  // Prepare image for API (resize and convert to base64)
  async prepareImage(imageUri) {
    try {
      // Resize image to reduce API payload
      const manipulatedImage = await manipulateAsync(
        imageUri,
        [{ resize: { width: this.maxImageSize } }],
        { compress: 0.8, format: SaveFormat.JPEG }
      );

      // Read as base64
      const base64 = await FileSystem.readAsStringAsync(manipulatedImage.uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      return {
        uri: manipulatedImage.uri,
        base64: `data:image/jpeg;base64,${base64}`,
      };
    } catch (error) {
      console.error('Error preparing image:', error);
      throw error;
    }
  }

  // Identify plant using PlantNet API
  async identifyWithPlantNet(imageUri, organs = ['leaf']) {
    try {
      console.log('🌿 Starting PlantNet identification...');
      
      // Prepare image
      const { base64 } = await this.prepareImage(imageUri);
      
      // Create form data
      const formData = new FormData();
      formData.append('images', base64);
      formData.append('organs', organs.join(','));
      formData.append('include-related-images', 'true');
      
      // API request
      const response = await fetch(
        `${this.plantNetBaseUrl}/identify/all?api-key=${this.plantNetApiKey}`,
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`PlantNet API error: ${error}`);
      }

      const data = await response.json();
      
      // Process results
      const results = this.processPlantNetResults(data);
      
      console.log(`✅ PlantNet identified ${results.length} possible plants`);
      return {
        success: true,
        results,
        raw: data,
      };
    } catch (error) {
      console.error('PlantNet identification error:', error);
      return {
        success: false,
        error: error.message,
        results: [],
      };
    }
  }

  // Process PlantNet API results
  processPlantNetResults(data) {
    if (!data.results || data.results.length === 0) {
      return [];
    }

    return data.results
      .filter(result => result.score >= this.confidence_threshold)
      .map(result => {
        const species = result.species;
        const commonNames = species.commonNames || [];
        const scientificName = species.scientificNameWithoutAuthor;
        
        // Try to match with our database
        const matchedPlant = this.matchWithDatabase(commonNames, scientificName);
        
        return {
          commonName: commonNames[0] || scientificName,
          scientificName: scientificName,
          family: species.family?.scientificNameWithoutAuthor || 'Unknown',
          genus: species.genus?.scientificNameWithoutAuthor || 'Unknown',
          confidence: Math.round(result.score * 100),
          images: result.images?.slice(0, 3).map(img => img.url.m) || [],
          gbifId: result.gbif?.id,
          matchedInDatabase: !!matchedPlant,
          databaseMatch: matchedPlant,
          allCommonNames: commonNames,
        };
      })
      .slice(0, 5); // Return top 5 results
  }

  // Match identified plant with our database
  matchWithDatabase(commonNames, scientificName) {
    const allNames = [...commonNames, scientificName].map(n => n.toLowerCase());
    
    for (const [plantName, plantData] of Object.entries(PLANT_DATABASE)) {
      const dbName = plantName.toLowerCase();
      
      // Check if any common name matches our database
      if (allNames.some(name => name.includes(dbName) || dbName.includes(name))) {
        return {
          name: plantName,
          data: plantData,
        };
      }
    }
    
    return null;
  }

  // Identify plant using multiple fallback methods
  async identifyPlant(imageUri, options = {}) {
    const results = {
      primary: null,
      alternatives: [],
      metadata: {
        timestamp: new Date().toISOString(),
        methods: [],
      },
    };

    try {
      // Try PlantNet first
      const plantNetResult = await this.identifyWithPlantNet(
        imageUri,
        options.organs || ['leaf']
      );
      
      if (plantNetResult.success && plantNetResult.results.length > 0) {
        results.primary = plantNetResult.results[0];
        results.alternatives = plantNetResult.results.slice(1);
        results.metadata.methods.push('PlantNet');
        results.metadata.plantNetConfidence = plantNetResult.results[0].confidence;
      }

      // If low confidence or no match in database, try additional methods
      if (!results.primary || results.primary.confidence < 70 || !results.primary.matchedInDatabase) {
        // Could add additional APIs here (Google Vision, PlantID, etc.)
        console.log('🔍 Low confidence or no database match, consider additional identification methods');
      }

      // Enhanced results with care information
      if (results.primary?.matchedInDatabase) {
        results.primary.careInfo = this.getPlantCareInfo(results.primary.databaseMatch.name);
      }

      return {
        success: true,
        ...results,
      };
    } catch (error) {
      console.error('Plant identification failed:', error);
      return {
        success: false,
        error: error.message,
        primary: null,
        alternatives: [],
        metadata: results.metadata,
      };
    }
  }

  // Get plant care information
  getPlantCareInfo(plantName) {
    const plant = PLANT_DATABASE[plantName];
    if (!plant) return null;

    return {
      difficulty: plant.difficulty,
      wateringFrequency: plant.wateringFrequency,
      sunlight: plant.sunlight,
      growthTime: plant.growthTime,
      quickTips: [
        `Water every ${plant.wateringFrequency} day${plant.wateringFrequency > 1 ? 's' : ''}`,
        `Needs ${plant.sunlight.toLowerCase()}`,
        `Ready to harvest in ${plant.growthTime}`,
      ],
    };
  }

  // Analyze plant health from image
  async analyzePlantHealth(imageUri) {
    // This could be enhanced with a disease detection API
    // For now, return basic analysis
    return {
      healthy: true,
      issues: [],
      recommendations: [
        'Ensure proper watering schedule',
        'Check for adequate sunlight',
        'Monitor for pests regularly',
      ],
    };
  }

  // Get identification tips for better results
  getIdentificationTips(organ = 'general') {
    const tips = {
      general: [
        'Take photos in good lighting',
        'Include multiple angles',
        'Focus on distinctive features',
        'Avoid blurry images',
      ],
      leaf: [
        'Capture the entire leaf',
        'Include both sides if possible',
        'Show the leaf arrangement on stem',
        'Include a ruler for scale',
      ],
      flower: [
        'Photograph when fully open',
        'Capture from above and side',
        'Include flower buds if present',
        'Show the center clearly',
      ],
      fruit: [
        'Show whole and cut fruit',
        'Include seeds if visible',
        'Capture at different ripeness stages',
        'Show attachment to plant',
      ],
      bark: [
        'Capture texture clearly',
        'Include a wide area',
        'Show any unique patterns',
        'Photograph in even lighting',
      ],
    };

    return tips[organ] || tips.general;
  }

  // Save identification history
  async saveIdentificationHistory(result) {
    try {
      const history = await this.loadIdentificationHistory();
      
      const newEntry = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        plantName: result.primary?.commonName || 'Unknown',
        scientificName: result.primary?.scientificName || '',
        confidence: result.primary?.confidence || 0,
        imageUri: result.imageUri,
        matchedInDatabase: result.primary?.matchedInDatabase || false,
      };

      history.unshift(newEntry);
      
      // Keep only last 50 identifications
      if (history.length > 50) {
        history = history.slice(0, 50);
      }

      await FileSystem.writeAsStringAsync(
        `${FileSystem.documentDirectory}plant-identification-history.json`,
        JSON.stringify(history)
      );

      return newEntry;
    } catch (error) {
      console.error('Error saving identification history:', error);
      return null;
    }
  }

  // Load identification history
  async loadIdentificationHistory() {
    try {
      const fileUri = `${FileSystem.documentDirectory}plant-identification-history.json`;
      const fileInfo = await FileSystem.getInfoAsync(fileUri);
      
      if (fileInfo.exists) {
        const content = await FileSystem.readAsStringAsync(fileUri);
        return JSON.parse(content);
      }
      
      return [];
    } catch (error) {
      console.error('Error loading identification history:', error);
      return [];
    }
  }

  // Get plant suggestions based on image features
  async getPlantSuggestions(imageUri) {
    // This could analyze image colors, shapes, etc. to suggest likely plants
    // For now, return common plants
    return Object.keys(PLANT_DATABASE).slice(0, 5).map(name => ({
      name,
      reason: 'Commonly grown plant',
      confidence: 'N/A',
    }));
  }
}

// Create singleton instance
export const plantIdentificationService = new PlantIdentificationService();

// Export identification types
export const PLANT_ORGANS = {
  LEAF: 'leaf',
  FLOWER: 'flower',
  FRUIT: 'fruit',
  BARK: 'bark',
  HABIT: 'habit',
  OTHER: 'other',
};