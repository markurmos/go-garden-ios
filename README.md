# Go Garden iOS 🌱📱

A comprehensive garden planning app built with React Native and Expo, featuring AI-powered plant identification, curated gardening content, and personalized plant recommendations based on your location and hardiness zone.

## ✨ Features

### 🏠 Plant Browser
- **25+ Vegetables & Herbs** with high-quality images
- **Smart Image Loading** from Supabase Storage with CDN fallbacks
- **Search & Filter** by category (Easy, Start Indoors, Plant Outside)
- **Plant Details** including days to harvest, spacing, and growing tips

### 🌱 My Garden
- **Personal Plant Collection** with add/remove functionality
- **Date Tracking** shows when plants were added
- **Smart Image System** with robust fallback handling
- **Garden Management** with intuitive interface

### 📷 AI Plant Identification
- **Camera Integration** for real-time plant photography
- **Gallery Selection** for existing photos
- **PlantNet API** for professional plant identification
- **Smart Matching** to app's plant database
- **Confidence Scoring** with alternative suggestions

### 📚 Explore - Curated Content
- **8 Expert Articles** from top gardening websites
- **Professional Sources**: Epic Gardening, Better Homes & Gardens, USDA
- **Categories**: Beginner, Advanced, Small Space, Seasonal, Sustainability
- **Magazine-Style Layout** with beautiful typography
- **Full-Screen Reading** experience

### 📍 Location Intelligence
- **Automatic Location Detection** using device GPS
- **Hardiness Zone Mapping** based on geographic coordinates
- **Zone-Specific Recommendations** for optimal plant selection
- **Current Location Display** with zone information

## 🛠 Technology Stack

- **Framework**: React Native with Expo (~53.0.12)
- **Language**: JavaScript/JSX
- **Database**: Supabase (PostgreSQL)
- **Storage**: Supabase Storage for plant images
- **AI**: PlantNet API for plant identification
- **Location**: expo-location for GPS functionality
- **Camera**: expo-image-picker for photo capture
- **Icons**: @expo/vector-icons (Ionicons)

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager
- Expo CLI (`npm install -g @expo/cli`)
- iOS Simulator (Xcode) or Android Studio
- Expo Go app for device testing

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/markurmos/go-garden-ios.git
cd go-garden-ios
```

2. **Install dependencies**
```bash
npm install
```

3. **Start the development server**
```bash
npm start
# or
expo start
```

4. **Run on device/simulator**
```bash
# iOS Simulator
npm run ios

# Android Simulator  
npm run android

# Web Browser
npm run web

# Scan QR code with Expo Go app for device testing
```

## 📱 Device Testing

### Using Expo Go
1. Install **Expo Go** from App Store/Google Play
2. Run `expo start` in terminal
3. Scan QR code with Expo Go app
4. App loads directly on your device

### Features that work better on real devices:
- **Camera functionality** (simulator limitation)
- **GPS location detection** 
- **Real plant photography** for identification

## 🗃 Database Setup

### Supabase Configuration
The app uses Supabase for backend services:

1. **Plant Images Storage**
   - Bucket: `plant-images`
   - 25 high-quality plant photos
   - Multi-format support (.jpg, .png, .jpeg)

2. **Database Tables**
   - Users and authentication
   - Plant information and growing data
   - Garden collections
   - Location and zone data

3. **Setup Instructions**
   - See `supabase-setup.md` for detailed configuration
   - Update Supabase URL and keys in `App.js`

## 🌍 Environment Variables

The app now uses a centralized configuration system for better security and maintainability.

### Configuration Files
- **`config.js`** - Main configuration file with fallback values
- **`.env.local`** - Local environment variables (git-ignored)
- **`babel.config.js`** - Babel configuration for environment variable support

### Setting Up Environment Variables

1. **Install dependencies** (already included):
```bash
npm install react-native-dotenv
```

2. **Create `.env.local`** file in the root directory:
```env
# Supabase Configuration
SUPABASE_URL=your_supabase_url_here
SUPABASE_ANON_KEY=your_supabase_anon_key_here

# PlantNet API Configuration
PLANTNET_API_KEY=your_plantnet_api_key_here
```

3. **Configuration is automatically loaded** from `config.js` with environment variable overrides

### Security Benefits
- ✅ API keys no longer hardcoded in source code
- ✅ `.env.local` files are git-ignored
- ✅ Fallback values for development
- ✅ Easy deployment configuration

## 📐 Architecture

### Component Structure
```
App.js (Main Component)
├── SmartPlantImage (Reusable image component)
├── PlantCard (Individual plant display)
├── MyGardenView (Garden management)
├── ExploreView (Curated content)
├── AddToGardenModal (Plant addition)
├── CameraModal (Photo selection)
├── IdentificationModal (AI results)
└── ArticleModal (Content reading)
```

### Key Features
- **Smart Image Loading**: Multi-source fallback system
- **Modal System**: Clean overlay interactions
- **State Management**: React hooks for app state
- **Navigation**: Bottom tab navigation
- **Responsive Design**: Works on all screen sizes

## 🎨 Design System

### Color Palette
- **Primary Green**: #22c55e (buttons, active states)
- **Text Dark**: #111827 (headings)
- **Text Medium**: #6b7280 (body text)
- **Text Light**: #9ca3af (meta information)
- **Background**: #f9fafb (app background)
- **Cards**: #ffffff (card backgrounds)

### Typography
- **Headings**: 600-700 font weight
- **Body**: 400-500 font weight
- **Meta**: 12-14px font size
- **Titles**: 16-24px font size

## 🧪 Testing

### Manual Testing Checklist
- [ ] Plant browsing and search
- [ ] Add/remove plants from garden
- [ ] Camera functionality (device only)
- [ ] Plant identification accuracy
- [ ] Article reading experience
- [ ] Location detection
- [ ] Image loading and fallbacks

### Known Limitations
- Camera unavailable in iOS Simulator
- Location detection requires device permissions
- PlantNet API requires internet connection

## 🚀 Deployment

### Expo Build
```bash
# Build for iOS
expo build:ios

# Build for Android
expo build:android

# Web deployment
expo build:web
```

### App Store Deployment
1. Configure `app.json` with proper bundle identifier
2. Set up Apple Developer account
3. Use Expo's build service or EAS Build
4. Submit through App Store Connect

## 📖 Learning Resources

### Plant Growing Information
- **Epic Gardening**: Comprehensive growing guides
- **Better Homes & Gardens**: Seasonal gardening tips
- **USDA Extension**: Scientific growing data
- **Old Farmer's Almanac**: Traditional gardening wisdom

### Technical Resources
- **Expo Documentation**: Framework guides
- **React Native Docs**: Component references
- **Supabase Docs**: Backend integration
- **PlantNet API**: Plant identification service

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **PlantNet** for plant identification API
- **Supabase** for backend infrastructure
- **Expo** for React Native framework
- **Unsplash** for high-quality plant photography
- **Gardening Community** for expert knowledge and tips

## 📞 Support

For questions or support:
- Create an issue in this repository
- Check existing documentation
- Review troubleshooting guides

---

**Happy Gardening!** 🌱✨

*Built with ❤️ for gardeners everywhere*