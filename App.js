import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Alert,
  Dimensions,
  Modal,
  Pressable,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';
import { createClient } from '@supabase/supabase-js';

const { width } = Dimensions.get('window');

// Initialize Supabase client
const supabaseUrl = 'https://ajktssbhxnukxksjjdyr.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFqa3Rzc2JoeG51a3hrc2pqZHlyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkwNDEwNTMsImV4cCI6MjA2NDYxNzA1M30.jARR7T5uxhF1iRiv96cdTyLbTYINfLs_JqtmtFnS3E0';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Supabase Storage URLs for plant images
const SUPABASE_STORAGE_URL = `${supabaseUrl}/storage/v1/object/public/plant-images`;

// Function to get Supabase image URLs with multiple format support
const getSupabaseImageUrls = (plantName) => {
  const baseName = plantName.toLowerCase().replace(/\s+/g, '-');
  return [
    `${SUPABASE_STORAGE_URL}/${baseName}.jpg`,
    `${SUPABASE_STORAGE_URL}/${baseName}.png`,
    `${SUPABASE_STORAGE_URL}/${baseName}.jpeg`
  ];
};

// Plant Images - Using Supabase Storage with CDN fallbacks
const PLANT_IMAGES = {
  'Lettuce': [
    ...getSupabaseImageUrls('lettuce'),
    'https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?w=400&h=300&fit=crop&auto=format',
    'https://images.pexels.com/photos/1656666/pexels-photo-1656666.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop'
  ],
  'Spinach': [
    ...getSupabaseImageUrls('spinach'),
    'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400&h=300&fit=crop&auto=format',
    'https://images.pexels.com/photos/2255935/pexels-photo-2255935.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop'
  ],
  'Kale': [
    ...getSupabaseImageUrls('kale'),
    'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop&auto=format',
    'https://images.pexels.com/photos/1359326/pexels-photo-1359326.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop'
  ],
  'Arugula': [
    ...getSupabaseImageUrls('arugula'),
    'https://images.unsplash.com/photo-1609501676725-7186f0a57e1d?w=400&h=300&fit=crop&auto=format',
    'https://images.pexels.com/photos/1359329/pexels-photo-1359329.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop'
  ],
  'Swiss Chard': [
    ...getSupabaseImageUrls('swiss chard'),
    'https://images.unsplash.com/photo-1583664421503-eeca45d57c3e?w=400&h=300&fit=crop&auto=format',
    'https://images.pexels.com/photos/8518459/pexels-photo-8518459.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop'
  ],
  'Carrots': [
    ...getSupabaseImageUrls('carrots'),
    'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400&h=300&fit=crop&auto=format',
    'https://images.pexels.com/photos/143133/pexels-photo-143133.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop'
  ],
  'Radishes': [
    ...getSupabaseImageUrls('radishes'),
    'https://images.unsplash.com/photo-1597691946873-e3c0987e3b89?w=400&h=300&fit=crop&auto=format',
    'https://images.pexels.com/photos/3659862/pexels-photo-3659862.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop'
  ],
  'Beets': [
    ...getSupabaseImageUrls('beets'),
    'https://images.unsplash.com/photo-1579952363873-27d3bfad9c0d?w=400&h=300&fit=crop&auto=format',
    'https://images.pexels.com/photos/1359326/pexels-photo-1359326.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop'
  ],
  'Turnips': [
    ...getSupabaseImageUrls('turnips'),
    'https://images.unsplash.com/photo-1590736969955-71cc94901144?w=400&h=300&fit=crop&auto=format',
    'https://images.pexels.com/photos/8518461/pexels-photo-8518461.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop'
  ],
  'Tomatoes': [
    ...getSupabaseImageUrls('tomatoes'),
    'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400&h=300&fit=crop&auto=format',
    'https://images.pexels.com/photos/533280/pexels-photo-533280.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop'
  ],
  'Peppers': [
    ...getSupabaseImageUrls('peppers'),
    'https://images.unsplash.com/photo-1583398701364-05e4e5aba4d2?w=400&h=300&fit=crop&auto=format',
    'https://images.pexels.com/photos/594137/pexels-photo-594137.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop'
  ],
  'Zucchini': [
    ...getSupabaseImageUrls('zucchini'),
    'https://images.unsplash.com/photo-1566840803306-3b0dd8f77da4?w=400&h=300&fit=crop&auto=format',
    'https://images.pexels.com/photos/566566/pexels-photo-566566.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop'
  ],
  'Cucumber': [
    ...getSupabaseImageUrls('cucumber'),
    'https://images.unsplash.com/photo-1449300079323-02e209d9d3a6?w=400&h=300&fit=crop&auto=format',
    'https://images.pexels.com/photos/37528/cucumber-salad-food-healthy-37528.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop'
  ],
  'Eggplant': [
    ...getSupabaseImageUrls('eggplant'),
    'https://images.unsplash.com/photo-1618156640685-bfa4c6df5a49?w=400&h=300&fit=crop&auto=format',
    'https://images.pexels.com/photos/321551/pexels-photo-321551.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop'
  ],
  'Basil': [
    ...getSupabaseImageUrls('basil'),
    'https://images.unsplash.com/photo-1618164435735-413d3b066c9a?w=400&h=300&fit=crop&auto=format',
    'https://images.pexels.com/photos/4113778/pexels-photo-4113778.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop'
  ],
  'Cilantro': [
    ...getSupabaseImageUrls('cilantro'),
    'https://images.unsplash.com/photo-1625944230945-1b7dd3b949ab?w=400&h=300&fit=crop&auto=format',
    'https://images.pexels.com/photos/4113763/pexels-photo-4113763.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop'
  ],
  'Parsley': [
    ...getSupabaseImageUrls('parsley'),
    'https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=400&h=300&fit=crop&auto=format',
    'https://images.pexels.com/photos/4113765/pexels-photo-4113765.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop'
  ],
  'Rosemary': [
    ...getSupabaseImageUrls('rosemary'),
    'https://images.unsplash.com/photo-1535914254981-b5012eebbd15?w=400&h=300&fit=crop&auto=format',
    'https://images.pexels.com/photos/357886/pexels-photo-357886.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop'
  ],
  'Broccoli': [
    ...getSupabaseImageUrls('broccoli'),
    'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=400&h=300&fit=crop&auto=format',
    'https://images.pexels.com/photos/47347/broccoli-vegetable-food-healthy-47347.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop'
  ],
  'Cauliflower': [
    ...getSupabaseImageUrls('cauliflower'),
    'https://images.unsplash.com/photo-1568584711271-6d9a52b22f78?w=400&h=300&fit=crop&auto=format',
    'https://images.pexels.com/photos/461198/pexels-photo-461198.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop'
  ],
  'Cabbage': [
    ...getSupabaseImageUrls('cabbage'),
    'https://images.unsplash.com/photo-1594282486552-05b4d80fbb9f?w=400&h=300&fit=crop&auto=format',
    'https://images.pexels.com/photos/209482/pexels-photo-209482.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop'
  ],
  'Brussels Sprouts': [
    'https://images.pexels.com/photos/566566/pexels-photo-566566.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
    'https://cdn.pixabay.com/photo/2017/10/25/19/45/brussels-sprouts-2886661_640.jpg',
    'https://images.unsplash.com/photo-1582284540020-8acbb4de4d32?w=400&h=300&fit=crop&auto=format'
  ],
  'Green Beans': [
    ...getSupabaseImageUrls('green beans'),
    'https://images.unsplash.com/photo-1564590220821-c23e3c04a1e5?w=400&h=300&fit=crop&auto=format',
    'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop'
  ],
  'Peas': [
    ...getSupabaseImageUrls('peas'),
    'https://images.unsplash.com/photo-1561136594-7f68413baa99?w=400&h=300&fit=crop&auto=format',
    'https://images.pexels.com/photos/1435735/pexels-photo-1435735.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop'
  ],
  'Onions': [
    ...getSupabaseImageUrls('onions'),
    'https://images.unsplash.com/photo-1582284540020-8acbb4de4d32?w=400&h=300&fit=crop&auto=format',
    'https://images.pexels.com/photos/533342/pexels-photo-533342.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop'
  ],
  'Garlic': [
    'https://images.pexels.com/photos/533342/pexels-photo-533342.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
    'https://cdn.pixabay.com/photo/2016/07/30/12/24/garlic-1556905_640.jpg',
    'https://images.unsplash.com/photo-1471196804263-9de07add89d2?w=400&h=300&fit=crop&auto=format'
  ],
  'Green Onions': [
    ...getSupabaseImageUrls('green onions'),
    'https://images.unsplash.com/photo-1553907144-5f1742a6f32e?w=400&h=300&fit=crop&auto=format',
    'https://images.pexels.com/photos/533342/pexels-photo-533342.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop'
  ],
};

export default function SmartGardenPlanner() {
  // State management
  const [location, setLocation] = useState('');
  const [zone, setZone] = useState('');
  const [loading, setLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('checking');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeTab, setActiveTab] = useState('Home');
  const [myGarden, setMyGarden] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [showCameraModal, setShowCameraModal] = useState(false);
  const [identificationResult, setIdentificationResult] = useState(null);
  const [isIdentifying, setIsIdentifying] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [showArticleModal, setShowArticleModal] = useState(false);

  // Get current month
  const currentMonth = new Date().toLocaleString('default', { month: 'long' });

  // Curated Gardening Articles
  const gardeningArticles = [
    {
      id: 1,
      title: "10 Beginner Gardening Tips for 2024",
      summary: "Essential tips for starting your first vegetable garden this year",
      source: "Epic Gardening",
      category: "Beginner",
      readTime: "5 min read",
      image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=250&fit=crop&auto=format",
      url: "https://www.epicgardening.com/",
      content: "Start small with a 4x4 raised bed, choose high-quality seeds, plant according to your growing zone, and focus on vegetables you actually like to eat. Water consistently but adjust for rainfall and temperature."
    },
    {
      id: 2,
      title: "Small Space Gardening Mastery",
      summary: "Grow a shocking diversity of vegetables in tiny spaces",
      source: "Epic Gardening",
      category: "Small Space",
      readTime: "7 min read",
      image: "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=400&h=250&fit=crop&auto=format",
      url: "https://www.epicgardening.com/gardening-limited-space/",
      content: "Maximize your harvest with companion planting, continuous seeding, and choosing compact varieties. Vertical growing and container gardening can produce amazing yields in minimal space."
    },
    {
      id: 3,
      title: "Fall Gardening: Extend Your Season",
      summary: "Keep growing delicious crops through cooler weather",
      source: "Better Homes & Gardens",
      category: "Seasonal",
      readTime: "6 min read",
      image: "https://images.unsplash.com/photo-1574263867128-0945bdbe3ada?w=400&h=250&fit=crop&auto=format",
      url: "https://www.bhg.com/gardening/vegetable/",
      content: "Plant carrots, kale, turnip greens, Brussels sprouts, and cabbage for a productive fall harvest. These cool-season crops often taste better after a light frost."
    },
    {
      id: 4,
      title: "High-Yield Vegetable Varieties",
      summary: "Get the most food from your garden space",
      source: "Gilmour",
      category: "Advanced",
      readTime: "8 min read",
      image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400&h=250&fit=crop&auto=format",
      url: "https://gilmour.com/vegetable-garden-tips",
      content: "Tomatoes, onions, and lettuce top the list for high-yield vegetables. Choose determinate tomato varieties for consistent harvests and practice succession planting for continuous lettuce production."
    },
    {
      id: 5,
      title: "Sustainable Garden Trends 2024",
      summary: "Eco-friendly practices for the modern gardener",
      source: "Modern Farmer",
      category: "Sustainability",
      readTime: "6 min read",
      image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=250&fit=crop&auto=format",
      url: "https://modernfarmer.com/",
      content: "Focus on durable, long-lasting garden products and survivalist gardening with storage crops like potatoes, roots, onions, squash, and nutrient-rich greens."
    },
    {
      id: 6,
      title: "Perfect Vegetable Garden Layout",
      summary: "Design your garden for maximum efficiency",
      source: "Epic Gardening",
      category: "Planning",
      readTime: "10 min read",
      image: "https://images.unsplash.com/photo-1591857177580-dc82b9ac4e1e?w=400&h=250&fit=crop&auto=format",
      url: "https://www.epicgardening.com/vegetable-garden-layout/",
      content: "Plan your layout considering plant spacing, sun requirements, and companion planting. Remember, your garden layout isn't permanent - adjust each season based on what works best."
    },
    {
      id: 7,
      title: "Watering Wisdom: Best Practices",
      summary: "Master the art of proper garden irrigation",
      source: "Old Farmer's Almanac",
      category: "Care",
      readTime: "5 min read",
      image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=250&fit=crop&auto=format",
      url: "https://www.almanac.com/",
      content: "Not every plant needs the same watering schedule. Consider rainfall, humidity, temperature, and individual plant needs. Deep, less frequent watering promotes stronger root systems."
    },
    {
      id: 8,
      title: "Soil Health: Your Garden's Foundation",
      summary: "Build fertile, well-draining soil for thriving plants",
      source: "USDA Extension",
      category: "Soil",
      readTime: "9 min read",
      image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=250&fit=crop&auto=format",
      url: "https://www.nal.usda.gov/",
      content: "Test your soil pH, add organic matter regularly, and ensure proper drainage. Healthy soil is the foundation of a productive garden and reduces the need for fertilizers."
    }
  ];

  // Check Supabase connection on mount
  useEffect(() => {
    checkSupabaseConnection();
    setDefaultLocation();
  }, []);

  const checkSupabaseConnection = async () => {
    try {
      const { data, error } = await supabase
        .from('zip_codes')
        .select('zip_code')
        .limit(1);
      
      if (error) throw error;
      setConnectionStatus('connected');
      console.log('✅ Supabase connected successfully');
    } catch (error) {
      setConnectionStatus('disconnected');
      console.log('⚠️ Using mock data (Supabase unavailable)');
    }
  };

  const setDefaultLocation = () => {
    if (!location) {
      setLocation('Winston-Salem');
      setZone('7b');
    }
  };

  // Location detection using Expo Location
  const detectLocation = async () => {
    try {
      setLoading(true);
      
      // Request permissions
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Location permission is required to detect your location.');
        setLoading(false);
        return;
      }

      // Get current location
      let location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      
      // For demo purposes, hardcoded to Winston-Salem area
      if (Math.abs(latitude - 36.09) < 0.5 && Math.abs(longitude - (-80.24)) < 0.5) {
        setLocation('Winston-Salem, NC');
        setZone('7b');
      } else {
        setLocation('Winston-Salem');
        setZone('7b');
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error detecting location:', error);
      Alert.alert('Error', 'Could not detect location. Using default location.');
      setLoading(false);
    }
  };

  // Comprehensive plant database
  const plants = [
    // Leafy Greens - Easy, cool season
    { name: 'Lettuce', daysToHarvest: 45, waterNeeds: 'high', spacing: 6, season: 'cool', zones: ['3a','11b'], category: 'leafy', images: PLANT_IMAGES['Lettuce'] },
    { name: 'Spinach', daysToHarvest: 40, waterNeeds: 'moderate', spacing: 4, season: 'cool', zones: ['3a','9b'], category: 'leafy', images: PLANT_IMAGES['Spinach'] },
    { name: 'Kale', daysToHarvest: 55, waterNeeds: 'moderate', spacing: 12, season: 'cool', zones: ['3a','11b'], category: 'leafy', images: PLANT_IMAGES['Kale'] },
    { name: 'Arugula', daysToHarvest: 30, waterNeeds: 'moderate', spacing: 4, season: 'cool', zones: ['3a','11b'], category: 'leafy', images: PLANT_IMAGES['Arugula'] },
    { name: 'Swiss Chard', daysToHarvest: 50, waterNeeds: 'moderate', spacing: 8, season: 'cool', zones: ['3a','11b'], category: 'leafy', images: PLANT_IMAGES['Swiss Chard'] },
    
    // Root Vegetables - Easy, direct sow
    { name: 'Carrots', daysToHarvest: 70, waterNeeds: 'moderate', spacing: 2, season: 'cool', zones: ['3a','11b'], category: 'root', images: PLANT_IMAGES['Carrots'] },
    { name: 'Radishes', daysToHarvest: 25, waterNeeds: 'moderate', spacing: 2, season: 'cool', zones: ['3a','11b'], category: 'root', images: PLANT_IMAGES['Radishes'] },
    { name: 'Beets', daysToHarvest: 55, waterNeeds: 'moderate', spacing: 3, season: 'cool', zones: ['3a','11b'], category: 'root', images: PLANT_IMAGES['Beets'] },
    { name: 'Turnips', daysToHarvest: 45, waterNeeds: 'moderate', spacing: 4, season: 'cool', zones: ['3a','10b'], category: 'root', images: PLANT_IMAGES['Turnips'] },
    
    // Warm Season Vegetables - Start indoors
    { name: 'Tomatoes', daysToHarvest: 75, waterNeeds: 'high', spacing: 24, season: 'warm', zones: ['5a','11b'], category: 'fruit', images: PLANT_IMAGES['Tomatoes'] },
    { name: 'Peppers', daysToHarvest: 75, waterNeeds: 'moderate', spacing: 18, season: 'warm', zones: ['5a','11b'], category: 'fruit', images: PLANT_IMAGES['Peppers'] },
    { name: 'Zucchini', daysToHarvest: 50, waterNeeds: 'high', spacing: 36, season: 'warm', zones: ['4a','11b'], category: 'fruit', images: PLANT_IMAGES['Zucchini'] },
    { name: 'Cucumber', daysToHarvest: 55, waterNeeds: 'high', spacing: 12, season: 'warm', zones: ['4a','11b'], category: 'fruit', images: PLANT_IMAGES['Cucumber'] },
    { name: 'Eggplant', daysToHarvest: 85, waterNeeds: 'moderate', spacing: 24, season: 'warm', zones: ['5a','11b'], category: 'fruit', images: PLANT_IMAGES['Eggplant'] },
    
    // Herbs - Easy, fragrant
    { name: 'Basil', daysToHarvest: 60, waterNeeds: 'moderate', spacing: 12, season: 'warm', zones: ['5a','11b'], category: 'herb', images: PLANT_IMAGES['Basil'] },
    { name: 'Cilantro', daysToHarvest: 45, waterNeeds: 'moderate', spacing: 6, season: 'cool', zones: ['3a','11b'], category: 'herb', images: PLANT_IMAGES['Cilantro'] },
    { name: 'Parsley', daysToHarvest: 70, waterNeeds: 'moderate', spacing: 8, season: 'cool', zones: ['3a','11b'], category: 'herb', images: PLANT_IMAGES['Parsley'] },
    { name: 'Rosemary', daysToHarvest: 90, waterNeeds: 'low', spacing: 24, season: 'warm', zones: ['6a','11b'], category: 'herb', images: PLANT_IMAGES['Rosemary'] },
    
    // Brassicas - Cool season, nutritious
    { name: 'Broccoli', daysToHarvest: 70, waterNeeds: 'high', spacing: 18, season: 'cool', zones: ['3a','10b'], category: 'brassica', images: PLANT_IMAGES['Broccoli'] },
    { name: 'Cauliflower', daysToHarvest: 75, waterNeeds: 'high', spacing: 18, season: 'cool', zones: ['3a','10b'], category: 'brassica', images: PLANT_IMAGES['Cauliflower'] },
    { name: 'Cabbage', daysToHarvest: 80, waterNeeds: 'high', spacing: 12, season: 'cool', zones: ['3a','9b'], category: 'brassica', images: PLANT_IMAGES['Cabbage'] },
    
    // Legumes - Nitrogen fixers
    { name: 'Green Beans', daysToHarvest: 55, waterNeeds: 'moderate', spacing: 6, season: 'warm', zones: ['4a','11b'], category: 'legume', images: PLANT_IMAGES['Green Beans'] },
    { name: 'Peas', daysToHarvest: 60, waterNeeds: 'moderate', spacing: 4, season: 'cool', zones: ['3a','8b'], category: 'legume', images: PLANT_IMAGES['Peas'] },
    
    // Alliums - Flavorful foundations
    { name: 'Onions', daysToHarvest: 100, waterNeeds: 'moderate', spacing: 4, season: 'cool', zones: ['3a','10b'], category: 'allium', images: PLANT_IMAGES['Onions'] },
    { name: 'Green Onions', daysToHarvest: 60, waterNeeds: 'moderate', spacing: 2, season: 'cool', zones: ['3a','11b'], category: 'allium', images: PLANT_IMAGES['Green Onions'] },
  ];

  // Filter plants based on search
  const filteredPlants = plants.filter(plant =>
    plant.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Categories for plant filtering
  const categories = ['All', 'Start indoors', 'Plant outside', 'Easy'];

  // Filter plants by category for display
  const categoryFilteredPlants = filteredPlants.filter(plant => {
    if (selectedCategory === 'All') return true;
    if (selectedCategory === 'Easy') return ['leafy', 'herb', 'root', 'allium'].includes(plant.category);
    if (selectedCategory === 'Start indoors') return ['fruit', 'brassica'].includes(plant.category);
    if (selectedCategory === 'Plant outside') return ['root', 'leafy', 'legume', 'allium'].includes(plant.category);
    return true;
  });

  // Garden management functions
  const addToGarden = (plant) => {
    if (!myGarden.find(p => p.name === plant.name)) {
      setMyGarden([...myGarden, { ...plant, addedDate: new Date().toISOString() }]);
      Alert.alert('Success!', `${plant.name} added to your garden`);
    } else {
      Alert.alert('Already in Garden', `${plant.name} is already in your garden`);
    }
    setShowAddModal(false);
  };

  const removeFromGarden = (plantName) => {
    setMyGarden(myGarden.filter(p => p.name !== plantName));
    Alert.alert('Removed', `${plantName} removed from your garden`);
  };

  // Camera and Plant Identification Functions
  const requestCameraPermission = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Camera permission is required to identify plants.');
      return false;
    }
    return true;
  };

  const takePhoto = async () => {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setIsIdentifying(true);
        const imageUri = result.assets[0].uri;
        await identifyPlant(imageUri);
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Error', 'Failed to take photo. Please try again.');
    }
  };

  const pickFromGallery = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setIsIdentifying(true);
        const imageUri = result.assets[0].uri;
        await identifyPlant(imageUri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  const identifyPlant = async (imageUri) => {
    try {
      // Create FormData for PlantNet API
      const formData = new FormData();
      formData.append('images', {
        uri: imageUri,
        type: 'image/jpeg',
        name: 'plant.jpg',
      });
      formData.append('organs', 'leaf');
      formData.append('modifiers', 'flower,fruit');
      formData.append('include-related-images', 'false');
      formData.append('no-reject', 'false');
      formData.append('lang', 'en');

      // PlantNet API call
      const response = await fetch(
        'https://my-api.plantnet.org/v1/identify/worldwide?api-key=2b10VhJE8nNEGRdKjz3L9JXVf',
        {
          method: 'POST',
          body: formData,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.results && data.results.length > 0) {
          const topResult = data.results[0];
          const plantName = topResult.species.scientificNameWithoutAuthor;
          const commonNames = topResult.species.commonNames;
          const confidence = Math.round(topResult.score * 100);
          
          setIdentificationResult({
            scientificName: plantName,
            commonName: commonNames?.[0] || plantName,
            confidence: confidence,
            image: imageUri,
            allResults: data.results.slice(0, 3) // Top 3 results
          });
        } else {
          Alert.alert('No Match', 'Could not identify this plant. Try a clearer photo with visible leaves or flowers.');
        }
      } else {
        throw new Error('API request failed');
      }
    } catch (error) {
      console.error('Plant identification error:', error);
      Alert.alert('Identification Failed', 'Could not identify the plant. Please check your internet connection and try again.');
    } finally {
      setIsIdentifying(false);
      setShowCameraModal(false);
    }
  };

  // Modal component for adding to garden
  const AddToGardenModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={showAddModal}
      onRequestClose={() => setShowAddModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {selectedPlant && (
            <>
              <Text style={styles.modalTitle}>Add to My Garden</Text>
              <Text style={styles.modalPlantName}>{selectedPlant.name}</Text>
              <Text style={styles.modalDescription}>
                {selectedPlant.season === 'cool' ? 'Cool season crop' : 'Warm season crop'} • 
                {selectedPlant.daysToHarvest} days to harvest
              </Text>
              <View style={styles.modalButtons}>
                <TouchableOpacity 
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => setShowAddModal(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.modalButton, styles.addButton]}
                  onPress={() => addToGarden(selectedPlant)}
                >
                  <Text style={styles.addButtonText}>Add to Garden</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </View>
    </Modal>
  );

  // Camera Modal Component
  const CameraModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={showCameraModal}
      onRequestClose={() => setShowCameraModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Identify Plant</Text>
          <Text style={styles.modalDescription}>
            Take a photo or choose from gallery to identify a plant
          </Text>
          <View style={styles.cameraButtons}>
            <TouchableOpacity 
              style={[styles.modalButton, styles.cameraButton]}
              onPress={takePhoto}
            >
              <Ionicons name="camera" size={24} color="white" />
              <Text style={styles.addButtonText}>Take Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.modalButton, styles.galleryButton]}
              onPress={pickFromGallery}
            >
              <Ionicons name="images" size={24} color="white" />
              <Text style={styles.addButtonText}>Gallery</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity 
            style={[styles.modalButton, styles.cancelButton]}
            onPress={() => setShowCameraModal(false)}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  // Plant Identification Result Modal
  const IdentificationModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={!!identificationResult}
      onRequestClose={() => setIdentificationResult(null)}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, styles.identificationModal]}>
          {identificationResult && (
            <>
              <Text style={styles.modalTitle}>Plant Identified!</Text>
              
              <Image 
                source={{ uri: identificationResult.image }}
                style={styles.identifiedImage}
                resizeMode="cover"
              />
              
              <Text style={styles.identifiedPlantName}>
                {identificationResult.commonName}
              </Text>
              <Text style={styles.scientificName}>
                {identificationResult.scientificName}
              </Text>
              <Text style={styles.confidenceText}>
                {identificationResult.confidence}% confidence
              </Text>
              
              {identificationResult.allResults?.length > 1 && (
                <View style={styles.alternativeResults}>
                  <Text style={styles.alternativeTitle}>Other possibilities:</Text>
                  {identificationResult.allResults.slice(1).map((result, index) => (
                    <Text key={index} style={styles.alternativeText}>
                      • {result.species.commonNames?.[0] || result.species.scientificNameWithoutAuthor} 
                      ({Math.round(result.score * 100)}%)
                    </Text>
                  ))}
                </View>
              )}
              
              <View style={styles.modalButtons}>
                <TouchableOpacity 
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => setIdentificationResult(null)}
                >
                  <Text style={styles.cancelButtonText}>Close</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.modalButton, styles.addButton]}
                  onPress={() => {
                    // Try to find matching plant in our database
                    const matchingPlant = plants.find(p => 
                      p.name.toLowerCase().includes(identificationResult.commonName.toLowerCase()) ||
                      identificationResult.commonName.toLowerCase().includes(p.name.toLowerCase())
                    );
                    
                    if (matchingPlant) {
                      setSelectedPlant(matchingPlant);
                      setIdentificationResult(null);
                      setShowAddModal(true);
                    } else {
                      Alert.alert(
                        'Plant Not in Database', 
                        `${identificationResult.commonName} was identified but is not in our growing database yet.`
                      );
                      setIdentificationResult(null);
                    }
                  }}
                >
                  <Text style={styles.addButtonText}>Add to Garden</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </View>
    </Modal>
  );

  // Loading Modal for Plant Identification
  const LoadingModal = () => (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isIdentifying}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.loadingModal}>
          <Text style={styles.loadingText}>Identifying plant...</Text>
          <Text style={styles.loadingSubtext}>This may take a few seconds</Text>
        </View>
      </View>
    </Modal>
  );

  // Smart Image Component with fallback system
  const SmartPlantImage = ({ plant, style, children }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [showFallback, setShowFallback] = useState(false);

    const handleImageError = () => {
      console.log(`Image failed for ${plant.name}, trying next image (${currentImageIndex + 1}/${plant.images?.length || 0})`);
      
      if (plant.images && currentImageIndex < plant.images.length - 1) {
        setCurrentImageIndex(currentImageIndex + 1);
      } else {
        console.log(`All images failed for ${plant.name}, showing fallback`);
        setShowFallback(true);
      }
    };

    const handleImageLoad = () => {
      console.log(`Image loaded successfully for ${plant.name}`);
    };

    if (showFallback || !plant.images || plant.images.length === 0) {
      return (
        <View style={[style, styles.fallbackContainer]}>
          <Text style={styles.fallbackText}>{plant.name}</Text>
          <Text style={styles.fallbackSubtext}>
            {plant.season === 'cool' ? '❄️' : '☀️'}
          </Text>
          {children}
        </View>
      );
    }

    return (
      <View style={style}>
        <Image 
          source={{ uri: plant.images[currentImageIndex] }}
          style={styles.plantImage}
          onError={handleImageError}
          onLoad={handleImageLoad}
          resizeMode="cover"
        />
        {children}
      </View>
    );
  };

  // Article Modal Component
  const ArticleModal = () => (
    <Modal
      animationType="slide"
      transparent={false}
      visible={showArticleModal}
      onRequestClose={() => setShowArticleModal(false)}
    >
      <SafeAreaView style={styles.articleModalContainer}>
        <View style={styles.articleModalHeader}>
          <TouchableOpacity 
            style={styles.closeButton}
            onPress={() => setShowArticleModal(false)}
          >
            <Ionicons name="close" size={24} color="#374151" />
          </TouchableOpacity>
          <Text style={styles.articleModalTitle}>Gardening Tips</Text>
          <View style={styles.placeholder} />
        </View>
        
        {selectedArticle && (
          <ScrollView style={styles.articleModalContent}>
            <Image 
              source={{ uri: selectedArticle.image }}
              style={styles.articleModalImage}
              resizeMode="cover"
            />
            <View style={styles.articleModalTextContent}>
              <Text style={styles.articleModalCategory}>{selectedArticle.category}</Text>
              <Text style={styles.articleModalTitleLarge}>{selectedArticle.title}</Text>
              <View style={styles.articleModalMeta}>
                <Text style={styles.articleModalSource}>{selectedArticle.source}</Text>
                <Text style={styles.articleModalReadTime}>{selectedArticle.readTime}</Text>
              </View>
              <Text style={styles.articleModalSummary}>{selectedArticle.summary}</Text>
              <Text style={styles.articleModalContentText}>{selectedArticle.content}</Text>
              
              <TouchableOpacity 
                style={styles.readMoreButton}
                onPress={() => {
                  // Open external URL
                  console.log('Opening:', selectedArticle.url);
                }}
              >
                <Text style={styles.readMoreButtonText}>Read Full Article</Text>
                <Ionicons name="open-outline" size={16} color="white" />
              </TouchableOpacity>
            </View>
          </ScrollView>
        )}
      </SafeAreaView>
    </Modal>
  );

  // Explore Component
  const ExploreView = () => (
    <ScrollView style={styles.content}>
      <View style={styles.exploreHeader}>
        <Text style={styles.exploreTitle}>Discover Gardening Wisdom</Text>
        <Text style={styles.exploreSubtitle}>
          Curated tips from the best gardening experts on the web
        </Text>
      </View>

      <View style={styles.categoryTabs}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {['All', 'Beginner', 'Advanced', 'Small Space', 'Seasonal'].map((category) => (
            <TouchableOpacity
              key={category}
              style={[styles.categoryTab, { backgroundColor: '#f3f4f6' }]}
            >
              <Text style={[styles.categoryText, { color: '#6b7280' }]}>
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.articlesContainer}>
        {gardeningArticles.map((article) => (
          <TouchableOpacity
            key={article.id}
            style={styles.articleCard}
            onPress={() => {
              setSelectedArticle(article);
              setShowArticleModal(true);
            }}
          >
            <Image 
              source={{ uri: article.image }}
              style={styles.articleImage}
              resizeMode="cover"
            />
            <View style={styles.articleContent}>
              <View style={styles.articleHeader}>
                <Text style={styles.articleCategory}>{article.category}</Text>
                <Text style={styles.articleReadTime}>{article.readTime}</Text>
              </View>
              <Text style={styles.articleTitle} numberOfLines={2}>
                {article.title}
              </Text>
              <Text style={styles.articleSummary} numberOfLines={2}>
                {article.summary}
              </Text>
              <Text style={styles.articleSource}>by {article.source}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );

  // My Garden component
  const MyGardenView = () => (
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

  const PlantCard = ({ plant }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageError, setImageError] = useState(false);
    const [showFallback, setShowFallback] = useState(false);

    const getDifficultyInfo = (category) => {
      if (['leafy', 'herb', 'root', 'allium', 'legume'].includes(category)) {
        return { label: 'Easy', color: '#22c55e', backgroundColor: '#dcfce7' };
      } else if (['fruit', 'brassica'].includes(category)) {
        return { label: 'Medium', color: '#eab308', backgroundColor: '#fef3c7' };
      } else {
        return { label: 'Hard', color: '#f97316', backgroundColor: '#fed7aa' };
      }
    };

    const difficulty = getDifficultyInfo(plant.category);

    const handleImageError = () => {
      console.log(`Image failed for ${plant.name}, trying next image (${currentImageIndex + 1}/${plant.images.length})`);
      
      if (currentImageIndex < plant.images.length - 1) {
        // Try next image
        setCurrentImageIndex(currentImageIndex + 1);
        setImageError(false);
      } else {
        // All images failed, show fallback
        console.log(`All images failed for ${plant.name}, showing fallback`);
        setShowFallback(true);
      }
    };

    const handleImageLoad = () => {
      console.log(`Image loaded successfully for ${plant.name}`);
      setImageLoaded(true);
      setImageError(false);
    };

    const getCurrentImageSource = () => {
      if (showFallback || !plant.images || plant.images.length === 0) {
        return null;
      }
      return { uri: plant.images[currentImageIndex] };
    };

    return (
      <TouchableOpacity 
        style={styles.plantCard} 
        onPress={() => {
          setSelectedPlant(plant);
          setShowAddModal(true);
        }}
      >
        <View style={styles.imageContainer}>
          {showFallback ? (
            // Fallback display with plant name and color
            <View style={styles.fallbackContainer}>
              <Text style={styles.fallbackText}>{plant.name}</Text>
              <Text style={styles.fallbackSubtext}>
                {plant.season === 'cool' ? '❄️' : '☀️'}
              </Text>
            </View>
          ) : (
            // Image display
            <Image 
              source={getCurrentImageSource()}
              style={styles.plantImage}
              onError={handleImageError}
              onLoad={handleImageLoad}
              resizeMode="cover"
            />
          )}
          
          <View style={[styles.difficultyBadge, { backgroundColor: difficulty.backgroundColor }]}>
            <Text style={[styles.difficultyText, { color: difficulty.color }]}>
              {difficulty.label}
            </Text>
          </View>
        </View>
        <View style={styles.cardContent}>
          <Text style={styles.plantName}>{plant.name}</Text>
          <Text style={styles.harvestInfo}>{plant.daysToHarvest} days to harvest</Text>
          <Text style={styles.plantDetails}>
            {plant.season === 'cool' ? 'Cool season crop' : 'Warm season crop'}. 
            Space {plant.spacing}" apart.
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={detectLocation}
          style={styles.locationButton}
          disabled={loading}
        >
          <Ionicons name="location-outline" size={16} color="#374151" />
          <View style={styles.locationTextContainer}>
            <Text style={styles.locationText}>{location}</Text>
            {zone && (
              <Text style={styles.zoneText}>Zone {zone}</Text>
            )}
          </View>
          <Ionicons name="chevron-forward" size={16} color="#22c55e" />
        </TouchableOpacity>
        <View style={styles.headerButtons}>
          <TouchableOpacity style={[styles.headerButton, styles.starButton]}>
            <Ionicons name="star" size={20} color="#eab308" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton}>
            <Ionicons name="settings-outline" size={20} color="#6b7280" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Conditional Content Based on Active Tab */}
      {activeTab === 'Home' ? (
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
              <PlantCard key={index} plant={plant} />
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
      ) : activeTab === 'My Garden' ? (
        <MyGardenView />
      ) : activeTab === 'Explore' ? (
        <ExploreView />
      ) : (
        <MyGardenView />
      )}

      {/* Modals */}
      <AddToGardenModal />
      <CameraModal />
      <IdentificationModal />
      <LoadingModal />
      <ArticleModal />

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => setActiveTab('Home')}
        >
          <Ionicons 
            name="home" 
            size={24} 
            color={activeTab === 'Home' ? "#22c55e" : "#9ca3af"} 
          />
          <Text style={[
            styles.navText, 
            activeTab === 'Home' && styles.activeNavText
          ]}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => setActiveTab('My Garden')}
        >
          <Ionicons 
            name={activeTab === 'My Garden' ? "leaf" : "leaf-outline"} 
            size={24} 
            color={activeTab === 'My Garden' ? "#22c55e" : "#9ca3af"} 
          />
          <Text style={[
            styles.navText, 
            activeTab === 'My Garden' && styles.activeNavText
          ]}>My Garden</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.addNavButton}
          onPress={() => setShowCameraModal(true)}
        >
          <Ionicons name="camera" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => setActiveTab('Explore')}
        >
          <Ionicons 
            name={activeTab === 'Explore' ? "bulb" : "bulb-outline"} 
            size={24} 
            color={activeTab === 'Explore' ? "#22c55e" : "#9ca3af"} 
          />
          <Text style={[
            styles.navText, 
            activeTab === 'Explore' && styles.activeNavText
          ]}>Explore</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="checkmark-circle-outline" size={24} color="#9ca3af" />
          <Text style={styles.navText}>Diagnose</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationTextContainer: {
    marginHorizontal: 4,
  },
  locationText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  zoneText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#22c55e',
    marginTop: 1,
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  headerButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
  },
  starButton: {
    backgroundColor: '#fef3c7',
  },
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
  plantCard: {
    width: (width - 48) / 2,
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
  plantImage: {
    width: '100%',
    height: '100%',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  fallbackContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  fallbackText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#475569',
    textAlign: 'center',
    marginBottom: 4,
  },
  fallbackSubtext: {
    fontSize: 24,
    textAlign: 'center',
  },
  difficultyBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  difficultyText: {
    fontSize: 12,
    fontWeight: '500',
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
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingHorizontal: 16,
    paddingVertical: 8,
    paddingBottom: 20,
  },
  navItem: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  navText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#9ca3af',
    marginTop: 4,
  },
  activeNavText: {
    color: '#22c55e',
  },
  addNavButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#22c55e',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    marginHorizontal: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  modalPlantName: {
    fontSize: 18,
    fontWeight: '500',
    color: '#22c55e',
    marginBottom: 8,
  },
  modalDescription: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: 100,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f3f4f6',
  },
  addButton: {
    backgroundColor: '#22c55e',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#6b7280',
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: 'white',
  },
  // Remove button for garden plants
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
  // Camera modal styles
  cameraButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  cameraButton: {
    backgroundColor: '#3b82f6',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
  },
  galleryButton: {
    backgroundColor: '#8b5cf6',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
  },
  // Plant identification modal styles
  identificationModal: {
    width: '90%',
    maxHeight: '80%',
  },
  identifiedImage: {
    width: 120,
    height: 120,
    borderRadius: 12,
    marginBottom: 16,
  },
  identifiedPlantName: {
    fontSize: 22,
    fontWeight: '600',
    color: '#22c55e',
    textAlign: 'center',
    marginBottom: 4,
  },
  scientificName: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 8,
  },
  confidenceText: {
    fontSize: 14,
    color: '#22c55e',
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 16,
  },
  alternativeResults: {
    alignSelf: 'stretch',
    marginBottom: 16,
  },
  alternativeTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  alternativeText: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
  },
  // Loading modal styles
  loadingModal: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  loadingText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  loadingSubtext: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
  // Explore page styles
  exploreHeader: {
    padding: 16,
    alignItems: 'center',
  },
  exploreTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
    textAlign: 'center',
  },
  exploreSubtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 22,
  },
  categoryTabs: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  articlesContainer: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  articleCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  articleImage: {
    width: '100%',
    height: 200,
  },
  articleContent: {
    padding: 16,
  },
  articleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  articleCategory: {
    fontSize: 12,
    fontWeight: '600',
    color: '#22c55e',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  articleReadTime: {
    fontSize: 12,
    color: '#9ca3af',
  },
  articleTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    lineHeight: 24,
    marginBottom: 8,
  },
  articleSummary: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
    marginBottom: 8,
  },
  articleSource: {
    fontSize: 12,
    color: '#9ca3af',
    fontStyle: 'italic',
  },
  // Article modal styles
  articleModalContainer: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  articleModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  closeButton: {
    padding: 8,
  },
  articleModalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  placeholder: {
    width: 40,
  },
  articleModalContent: {
    flex: 1,
  },
  articleModalImage: {
    width: '100%',
    height: 250,
  },
  articleModalTextContent: {
    padding: 20,
  },
  articleModalCategory: {
    fontSize: 14,
    fontWeight: '600',
    color: '#22c55e',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
  },
  articleModalTitleLarge: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    lineHeight: 32,
    marginBottom: 16,
  },
  articleModalMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  articleModalSource: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  articleModalReadTime: {
    fontSize: 14,
    color: '#9ca3af',
  },
  articleModalSummary: {
    fontSize: 16,
    color: '#6b7280',
    lineHeight: 24,
    marginBottom: 20,
    fontStyle: 'italic',
  },
  articleModalContentText: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 26,
    marginBottom: 30,
  },
  readMoreButton: {
    backgroundColor: '#22c55e',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  readMoreButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
});
