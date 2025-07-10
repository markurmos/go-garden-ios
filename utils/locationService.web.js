// Web version of location service - returns mock data
export const getCurrentLocation = async () => {
  // Return a default location for web (San Francisco)
  return {
    coords: {
      latitude: 37.7749,
      longitude: -122.4194,
    }
  };
};

export const getHardinessZone = (latitude) => {
  // Simple hardiness zone calculation based on latitude
  if (latitude > 45) return '3-5';
  if (latitude > 40) return '5-7';
  if (latitude > 35) return '7-9';
  if (latitude > 30) return '8-10';
  return '9-11';
};

export const getPlantRecommendations = async () => {
  try {
    const location = await getCurrentLocation();
    const zone = getHardinessZone(location.coords.latitude);
    
    return {
      location: {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        city: 'San Francisco',
        region: 'California',
      },
      zone,
      recommendations: [
        {
          id: '1',
          name: 'Tomatoes',
          difficulty: 'Easy',
          daysToHarvest: 75,
          description: 'Perfect for beginners, grows well in most climates',
        },
        {
          id: '2', 
          name: 'Lettuce',
          difficulty: 'Easy',
          daysToHarvest: 45,
          description: 'Fast-growing and great for salads',
        },
        {
          id: '3',
          name: 'Herbs',
          difficulty: 'Easy', 
          daysToHarvest: 30,
          description: 'Start with basil, parsley, and cilantro',
        },
      ],
    };
  } catch (error) {
    console.error('Error getting plant recommendations:', error);
    throw error;
  }
};