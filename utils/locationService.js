import * as Location from 'expo-location';

// USDA Hardiness Zone mapping based on latitude/longitude
// This is a simplified version - in production, use a proper hardiness zone API
const HARDINESS_ZONES = {
  // Zone 3 (Northern states)
  3: { minLat: 44, maxLat: 49, minLng: -120, maxLng: -70 },
  // Zone 4 (Upper Midwest)
  4: { minLat: 42, maxLat: 46, minLng: -110, maxLng: -75 },
  // Zone 5 (Mid-Atlantic, Lower Midwest)
  5: { minLat: 40, maxLat: 44, minLng: -105, maxLng: -70 },
  // Zone 6 (Mid-Atlantic, Ohio Valley)
  6: { minLat: 38, maxLat: 42, minLng: -100, maxLng: -75 },
  // Zone 7 (Southeast, Mid-Atlantic)
  7: { minLat: 36, maxLat: 40, minLng: -95, maxLng: -75 },
  // Zone 8 (Deep South, Texas)
  8: { minLat: 32, maxLat: 38, minLng: -105, maxLng: -80 },
  // Zone 9 (Florida, Southern Texas, Southern California)
  9: { minLat: 28, maxLat: 34, minLng: -120, maxLng: -80 },
  // Zone 10 (Southern Florida, Hawaii)
  10: { minLat: 24, maxLat: 30, minLng: -160, maxLng: -80 },
  // Zone 11 (Southern Florida, Hawaii)
  11: { minLat: 20, maxLat: 26, minLng: -160, maxLng: -80 }
};

/**
 * Determines hardiness zone based on latitude and longitude
 * @param {number} latitude 
 * @param {number} longitude 
 * @returns {string} Hardiness zone (e.g., "7a", "7b")
 */
export function getHardinessZone(latitude, longitude) {
  // Find the best matching zone
  for (const [zone, bounds] of Object.entries(HARDINESS_ZONES)) {
    if (latitude >= bounds.minLat && latitude <= bounds.maxLat &&
        longitude >= bounds.minLng && longitude <= bounds.maxLng) {
      // Add sub-zone (a/b) based on more precise location
      const subZone = (latitude > (bounds.minLat + bounds.maxLat) / 2) ? 'b' : 'a';
      return `${zone}${subZone}`;
    }
  }
  
  // Default fallback for areas not covered
  if (latitude > 40) return '5a'; // Northern areas
  if (latitude > 35) return '7a'; // Mid-latitude areas
  return '9a'; // Southern areas
}

/**
 * Gets current location with proper error handling
 * @returns {Promise<{latitude: number, longitude: number, address: string, zone: string}>}
 */
export async function getCurrentLocation() {
  try {
    // Request permissions
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      throw new Error('Location permission denied');
    }

    // Get current position
    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
      timeout: 10000,
      maximumAge: 300000, // 5 minutes
    });

    const { latitude, longitude } = location.coords;

    // Get address from coordinates
    const address = await Location.reverseGeocodeAsync({
      latitude,
      longitude,
    });

    // Format address
    let formattedAddress = 'Unknown Location';
    if (address && address.length > 0) {
      const addr = address[0];
      if (addr.city && addr.region) {
        formattedAddress = `${addr.city}, ${addr.region}`;
      } else if (addr.city) {
        formattedAddress = addr.city;
      } else if (addr.region) {
        formattedAddress = addr.region;
      }
    }

    // Get hardiness zone
    const zone = getHardinessZone(latitude, longitude);

    return {
      latitude,
      longitude,
      address: formattedAddress,
      zone,
      success: true
    };

  } catch (error) {
    console.error('Location detection error:', error);
    return {
      latitude: null,
      longitude: null,
      address: 'Location unavailable',
      zone: '7a', // Default zone
      success: false,
      error: error.message
    };
  }
}

/**
 * Gets location from address string (geocoding)
 * @param {string} address 
 * @returns {Promise<{latitude: number, longitude: number, zone: string}>}
 */
export async function getLocationFromAddress(address) {
  try {
    const geocoded = await Location.geocodeAsync(address);
    
    if (geocoded && geocoded.length > 0) {
      const { latitude, longitude } = geocoded[0];
      const zone = getHardinessZone(latitude, longitude);
      
      return {
        latitude,
        longitude,
        zone,
        success: true
      };
    } else {
      throw new Error('Address not found');
    }
  } catch (error) {
    console.error('Geocoding error:', error);
    return {
      latitude: null,
      longitude: null,
      zone: '7a',
      success: false,
      error: error.message
    };
  }
}

/**
 * Gets plant recommendations based on hardiness zone and season
 * @param {string} zone - Hardiness zone (e.g., "7a")
 * @param {string} season - Current season
 * @returns {Object} Recommendations object
 */
export function getPlantRecommendations(zone, season = 'spring') {
  const zoneNumber = parseInt(zone);
  const currentMonth = new Date().getMonth(); // 0-11
  
  const recommendations = {
    zone,
    season,
    currentMonth: currentMonth + 1,
    plantingAdvice: [],
    bestPlants: []
  };

  // Zone-specific recommendations
  if (zoneNumber <= 5) {
    recommendations.plantingAdvice.push('Short growing season - focus on quick-maturing varieties');
    recommendations.plantingAdvice.push('Start warm-season crops indoors');
    recommendations.bestPlants = ['lettuce', 'spinach', 'kale', 'carrots', 'radishes'];
  } else if (zoneNumber <= 7) {
    recommendations.plantingAdvice.push('Moderate growing season - good for most vegetables');
    recommendations.plantingAdvice.push('Plant cool-season crops in early spring and fall');
    recommendations.bestPlants = ['tomatoes', 'peppers', 'lettuce', 'broccoli', 'beans'];
  } else {
    recommendations.plantingAdvice.push('Long growing season - multiple plantings possible');
    recommendations.plantingAdvice.push('Watch for heat stress in summer');
    recommendations.bestPlants = ['tomatoes', 'peppers', 'eggplant', 'okra', 'sweet potatoes'];
  }

  // Seasonal recommendations
  if (currentMonth >= 3 && currentMonth <= 5) { // Spring
    recommendations.plantingAdvice.push('Perfect time for cool-season crops');
  } else if (currentMonth >= 6 && currentMonth <= 8) { // Summer
    recommendations.plantingAdvice.push('Focus on heat-tolerant varieties');
  } else if (currentMonth >= 9 && currentMonth <= 11) { // Fall
    recommendations.plantingAdvice.push('Great time for fall vegetables');
  } else { // Winter
    recommendations.plantingAdvice.push('Plan for next season and start seeds indoors');
  }

  return recommendations;
} 