export const PLANT_DATABASE = {
  'Lettuce': {
    id: 'lettuce',
    name: 'Lettuce',
    category: 'Leafy Greens',
    difficulty: 'Easy',
    wateringFrequency: 1, // days
    sunlight: 'Partial Sun',
    growthTime: '45-60 days',
    spacing: '6-12 inches',
    soilType: 'Well-draining, rich in organic matter',
    ph: '6.0-7.0',
    zones: ['3', '4', '5', '6', '7', '8', '9', '10'],
    season: ['Spring', 'Fall'],
    companions: ['Carrots', 'Radishes', 'Strawberries', 'Onions'],
    pests: ['Aphids', 'Slugs', 'Snails'],
    diseases: ['Downy mildew', 'Bottom rot'],
    harvest: 'When leaves reach desired size, harvest outer leaves first',
    tips: 'Grows best in cool weather. Provide shade in hot climates.',
    nutrients: {
      calories: 15,
      vitamin_a: '148%',
      vitamin_c: '15%',
      vitamin_k: '97%',
      folate: '10%'
    }
  },
  'Spinach': {
    id: 'spinach',
    name: 'Spinach',
    category: 'Leafy Greens',
    difficulty: 'Easy',
    wateringFrequency: 1,
    sunlight: 'Full Sun to Partial Shade',
    growthTime: '40-50 days',
    spacing: '3-6 inches',
    soilType: 'Rich, moist, well-draining',
    ph: '6.5-7.0',
    zones: ['3', '4', '5', '6', '7', '8', '9'],
    season: ['Spring', 'Fall'],
    companions: ['Strawberries', 'Radishes', 'Cabbage', 'Peas'],
    pests: ['Aphids', 'Leaf miners', 'Flea beetles'],
    diseases: ['Downy mildew', 'White rust'],
    harvest: 'Harvest outer leaves when 3-6 inches long',
    tips: 'Bolts quickly in hot weather. Plant in early spring or fall.',
    nutrients: {
      calories: 23,
      vitamin_a: '188%',
      vitamin_c: '47%',
      vitamin_k: '483%',
      iron: '15%',
      folate: '49%'
    }
  },
  'Kale': {
    id: 'kale',
    name: 'Kale',
    category: 'Leafy Greens',
    difficulty: 'Easy',
    wateringFrequency: 2,
    sunlight: 'Full Sun to Partial Shade',
    growthTime: '55-75 days',
    spacing: '12-18 inches',
    soilType: 'Well-draining, fertile',
    ph: '6.0-7.5',
    zones: ['3', '4', '5', '6', '7', '8', '9', '10'],
    season: ['Spring', 'Fall', 'Winter'],
    companions: ['Beets', 'Celery', 'Onions', 'Potatoes'],
    pests: ['Cabbage worms', 'Aphids', 'Flea beetles'],
    diseases: ['Black rot', 'Clubroot'],
    harvest: 'Pick outer leaves when 8-10 inches long',
    tips: 'Frost improves flavor. Very cold-hardy.',
    nutrients: {
      calories: 33,
      vitamin_a: '206%',
      vitamin_c: '134%',
      vitamin_k: '684%',
      calcium: '10%',
      iron: '6%'
    }
  },
  'Tomatoes': {
    id: 'tomatoes',
    name: 'Tomatoes',
    category: 'Fruiting Vegetables',
    difficulty: 'Moderate',
    wateringFrequency: 1,
    sunlight: 'Full Sun',
    growthTime: '60-85 days',
    spacing: '24-36 inches',
    soilType: 'Well-draining, rich in organic matter',
    ph: '6.0-6.8',
    zones: ['3', '4', '5', '6', '7', '8', '9', '10', '11'],
    season: ['Summer'],
    companions: ['Basil', 'Carrots', 'Parsley', 'Marigolds'],
    pests: ['Hornworms', 'Aphids', 'Whiteflies'],
    diseases: ['Early blight', 'Late blight', 'Blossom end rot'],
    harvest: 'When fully colored but still firm',
    tips: 'Stake or cage plants. Water consistently to prevent cracking.',
    nutrients: {
      calories: 18,
      vitamin_a: '17%',
      vitamin_c: '23%',
      vitamin_k: '10%',
      potassium: '7%',
      lycopene: 'High'
    }
  },
  'Carrots': {
    id: 'carrots',
    name: 'Carrots',
    category: 'Root Vegetables',
    difficulty: 'Easy',
    wateringFrequency: 2,
    sunlight: 'Full Sun to Partial Shade',
    growthTime: '70-80 days',
    spacing: '2-3 inches',
    soilType: 'Deep, loose, sandy',
    ph: '6.0-6.8',
    zones: ['3', '4', '5', '6', '7', '8', '9', '10'],
    season: ['Spring', 'Fall'],
    companions: ['Onions', 'Leeks', 'Rosemary', 'Peas'],
    pests: ['Carrot rust fly', 'Wireworms'],
    diseases: ['Leaf blight', 'Root rot'],
    harvest: 'When shoulders are 1/2 to 3/4 inch diameter',
    tips: 'Keep soil consistently moist for best germination.',
    nutrients: {
      calories: 41,
      vitamin_a: '334%',
      vitamin_k: '16%',
      fiber: '11%',
      potassium: '9%',
      beta_carotene: 'Very High'
    }
  },
  'Peppers': {
    id: 'peppers',
    name: 'Peppers',
    category: 'Fruiting Vegetables',
    difficulty: 'Moderate',
    wateringFrequency: 2,
    sunlight: 'Full Sun',
    growthTime: '60-90 days',
    spacing: '18-24 inches',
    soilType: 'Well-draining, fertile',
    ph: '6.0-6.8',
    zones: ['4', '5', '6', '7', '8', '9', '10', '11'],
    season: ['Summer'],
    companions: ['Tomatoes', 'Parsley', 'Basil', 'Carrots'],
    pests: ['Aphids', 'Pepper weevils', 'Spider mites'],
    diseases: ['Bacterial spot', 'Mosaic virus'],
    harvest: 'Can harvest green or wait for full color',
    tips: 'Warm soil essential. Mulch to retain moisture.',
    nutrients: {
      calories: 31,
      vitamin_a: '19%',
      vitamin_c: '213%',
      vitamin_b6: '15%',
      folate: '11%'
    }
  },
  'Basil': {
    id: 'basil',
    name: 'Basil',
    category: 'Herbs',
    difficulty: 'Easy',
    wateringFrequency: 1,
    sunlight: 'Full Sun',
    growthTime: '60-90 days',
    spacing: '12-18 inches',
    soilType: 'Well-draining, moderately rich',
    ph: '6.0-7.5',
    zones: ['4', '5', '6', '7', '8', '9', '10', '11'],
    season: ['Summer'],
    companions: ['Tomatoes', 'Peppers', 'Oregano'],
    pests: ['Aphids', 'Japanese beetles', 'Slugs'],
    diseases: ['Fusarium wilt', 'Bacterial leaf spot'],
    harvest: 'Pinch leaves regularly to encourage bushy growth',
    tips: 'Very frost sensitive. Pinch flowers to maintain leaf production.',
    nutrients: {
      calories: 23,
      vitamin_k: '416%',
      vitamin_a: '56%',
      manganese: '57%',
      essential_oils: 'High'
    }
  },
  'Radishes': {
    id: 'radishes',
    name: 'Radishes',
    category: 'Root Vegetables',
    difficulty: 'Easy',
    wateringFrequency: 1,
    sunlight: 'Full Sun to Partial Shade',
    growthTime: '22-30 days',
    spacing: '1-2 inches',
    soilType: 'Loose, well-draining',
    ph: '6.0-7.0',
    zones: ['2', '3', '4', '5', '6', '7', '8', '9', '10'],
    season: ['Spring', 'Fall'],
    companions: ['Lettuce', 'Peas', 'Spinach', 'Carrots'],
    pests: ['Flea beetles', 'Root maggots'],
    diseases: ['Clubroot', 'Black rot'],
    harvest: 'When roots are 1 inch diameter',
    tips: 'Fast growing. Great for succession planting.',
    nutrients: {
      calories: 16,
      vitamin_c: '25%',
      fiber: '6%',
      potassium: '7%'
    }
  },
  'Cucumber': {
    id: 'cucumber',
    name: 'Cucumber',
    category: 'Vining Vegetables',
    difficulty: 'Easy',
    wateringFrequency: 1,
    sunlight: 'Full Sun',
    growthTime: '50-70 days',
    spacing: '36-60 inches',
    soilType: 'Rich, well-draining',
    ph: '6.0-7.0',
    zones: ['4', '5', '6', '7', '8', '9', '10', '11'],
    season: ['Summer'],
    companions: ['Beans', 'Peas', 'Radishes', 'Sunflowers'],
    pests: ['Cucumber beetles', 'Aphids', 'Spider mites'],
    diseases: ['Powdery mildew', 'Bacterial wilt'],
    harvest: 'When 6-8 inches long for slicing varieties',
    tips: 'Provide trellis for vining types. Keep well watered.',
    nutrients: {
      calories: 16,
      vitamin_k: '16%',
      vitamin_c: '4%',
      potassium: '4%',
      water_content: '96%'
    }
  },
  'Broccoli': {
    id: 'broccoli',
    name: 'Broccoli',
    category: 'Brassicas',
    difficulty: 'Moderate',
    wateringFrequency: 2,
    sunlight: 'Full Sun',
    growthTime: '70-100 days',
    spacing: '18-24 inches',
    soilType: 'Rich, well-draining',
    ph: '6.0-7.0',
    zones: ['3', '4', '5', '6', '7', '8', '9', '10'],
    season: ['Spring', 'Fall'],
    companions: ['Onions', 'Beets', 'Herbs'],
    pests: ['Cabbage worms', 'Aphids', 'Flea beetles'],
    diseases: ['Clubroot', 'Black rot'],
    harvest: 'When heads are tight and dark green',
    tips: 'Cool season crop. Side shoots continue after main harvest.',
    nutrients: {
      calories: 34,
      vitamin_c: '149%',
      vitamin_k: '116%',
      folate: '16%',
      fiber: '10%'
    }
  }
};

// Helper function to get plants by category
export const getPlantsByCategory = (category) => {
  if (category === 'All') {
    return Object.values(PLANT_DATABASE);
  }
  return Object.values(PLANT_DATABASE).filter(plant => plant.category === category);
};

// Helper function to get plant care schedule
export const getPlantCareSchedule = (plantId, plantedDate) => {
  const plant = PLANT_DATABASE[plantId];
  if (!plant) return null;

  const planted = new Date(plantedDate);
  const today = new Date();
  const daysSincePlanting = Math.floor((today - planted) / (1000 * 60 * 60 * 24));

  // Calculate next watering date
  const lastWatered = new Date(planted);
  lastWatered.setDate(lastWatered.getDate() + Math.floor(daysSincePlanting / plant.wateringFrequency) * plant.wateringFrequency);
  const nextWatering = new Date(lastWatered);
  nextWatering.setDate(nextWatering.getDate() + plant.wateringFrequency);

  // Estimate harvest date
  const growthDays = parseInt(plant.growthTime.split('-')[0]);
  const harvestDate = new Date(planted);
  harvestDate.setDate(harvestDate.getDate() + growthDays);

  return {
    daysSincePlanting,
    nextWatering,
    daysUntilHarvest: Math.max(0, Math.floor((harvestDate - today) / (1000 * 60 * 60 * 24))),
    harvestDate,
    progress: Math.min(100, Math.floor((daysSincePlanting / growthDays) * 100))
  };
};

// Plant categories
export const PLANT_CATEGORIES = [
  'All',
  'Leafy Greens',
  'Root Vegetables',
  'Fruiting Vegetables',
  'Herbs',
  'Brassicas',
  'Vining Vegetables'
];