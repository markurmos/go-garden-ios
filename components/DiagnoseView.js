import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

const DiagnoseView = ({ myGarden, onTakePhoto, onPickFromGallery }) => {
  const [selectedSymptom, setSelectedSymptom] = useState(null);
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [customSymptoms, setCustomSymptoms] = useState('');
  const [showDiagnosisResult, setShowDiagnosisResult] = useState(false);

  // Common plant problems and symptoms
  const commonProblems = [
    {
      id: 1,
      name: 'Yellowing Leaves',
      icon: '🟡',
      causes: ['Overwatering', 'Nutrient deficiency', 'Natural aging', 'Poor drainage'],
      solutions: [
        'Check soil moisture - allow to dry between waterings',
        'Apply balanced fertilizer if nutrients are lacking',
        'Improve drainage with better soil mix',
        'Remove yellow leaves to prevent disease spread'
      ]
    },
    {
      id: 2,
      name: 'Brown/Black Spots',
      icon: '🟤',
      causes: ['Fungal disease', 'Bacterial infection', 'Sunburn', 'Chemical burn'],
      solutions: [
        'Remove affected leaves immediately',
        'Improve air circulation around plants',
        'Apply fungicide if fungal disease is suspected',
        'Avoid overhead watering'
      ]
    },
    {
      id: 3,
      name: 'Wilting',
      icon: '🥀',
      causes: ['Underwatering', 'Root rot', 'Heat stress', 'Transplant shock'],
      solutions: [
        'Check soil moisture and water if dry',
        'Inspect roots for rot - repot if necessary',
        'Provide shade during hot periods',
        'Give time to recover from transplanting'
      ]
    },
    {
      id: 4,
      name: 'Holes in Leaves',
      icon: '🕳️',
      causes: ['Insect pests', 'Caterpillars', 'Slugs/snails', 'Disease'],
      solutions: [
        'Inspect for pests and remove manually',
        'Apply organic insecticide if needed',
        'Use beer traps for slugs and snails',
        'Encourage beneficial insects'
      ]
    },
    {
      id: 5,
      name: 'Stunted Growth',
      icon: '📏',
      causes: ['Poor soil', 'Insufficient light', 'Root bound', 'Nutrient deficiency'],
      solutions: [
        'Test and improve soil quality',
        'Move to brighter location if possible',
        'Repot if roots are crowded',
        'Apply appropriate fertilizer'
      ]
    },
    {
      id: 6,
      name: 'White Powdery Coating',
      icon: '⚪',
      causes: ['Powdery mildew', 'High humidity', 'Poor air circulation'],
      solutions: [
        'Improve air circulation immediately',
        'Remove affected leaves',
        'Apply fungicide or baking soda spray',
        'Reduce humidity around plants'
      ]
    }
  ];

  // Plant-specific advice
  const getPlantSpecificAdvice = (plantName, problem) => {
    const advice = {
      'Tomatoes': {
        'Yellowing Leaves': 'Common in tomatoes - check for early blight or nutrient deficiency',
        'Brown/Black Spots': 'Likely blight - remove affected leaves and improve air circulation',
        'Wilting': 'Could be fusarium wilt - ensure consistent watering'
      },
      'Lettuce': {
        'Yellowing Leaves': 'Often due to heat stress - provide shade in hot weather',
        'Brown/Black Spots': 'Remove immediately to prevent spread',
        'Wilting': 'Lettuce is sensitive to heat - keep soil moist and cool'
      },
      'Basil': {
        'Yellowing Leaves': 'Usually overwatering - basil prefers slightly dry conditions',
        'Brown/Black Spots': 'Fusarium wilt is common - remove affected plants',
        'Wilting': 'Check for root rot if soil is wet'
      }
    };

    return advice[plantName]?.[problem] || null;
  };

  const handleDiagnosis = () => {
    if (!selectedSymptom) {
      Alert.alert('Select Symptoms', 'Please select the symptoms you\'re observing.');
      return;
    }

    setShowDiagnosisResult(true);
  };

  const handlePhotoCapture = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Camera permission is required to take photos.');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        Alert.alert(
          'Photo Analysis',
          'Photo captured! In a full version, this would be analyzed by AI to identify plant health issues.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Error', 'Failed to take photo. Please try again.');
    }
  };

  const DiagnosisResult = () => (
    <View style={styles.diagnosisResult}>
      <View style={styles.resultHeader}>
        <Text style={styles.resultTitle}>Diagnosis Results</Text>
        <TouchableOpacity 
          onPress={() => setShowDiagnosisResult(false)}
          style={styles.closeButton}
        >
          <Ionicons name="close" size={20} color="#6b7280" />
        </TouchableOpacity>
      </View>

      <View style={styles.problemSection}>
        <Text style={styles.problemTitle}>
          {selectedSymptom.icon} {selectedSymptom.name}
        </Text>
        
        <Text style={styles.sectionTitle}>Possible Causes:</Text>
        {selectedSymptom.causes.map((cause, index) => (
          <Text key={index} style={styles.listItem}>• {cause}</Text>
        ))}

        <Text style={styles.sectionTitle}>Recommended Solutions:</Text>
        {selectedSymptom.solutions.map((solution, index) => (
          <Text key={index} style={styles.listItem}>• {solution}</Text>
        ))}

        {selectedPlant && (
          <View style={styles.plantSpecificSection}>
            <Text style={styles.sectionTitle}>
              Specific Advice for {selectedPlant.name}:
            </Text>
            <Text style={styles.plantAdvice}>
              {getPlantSpecificAdvice(selectedPlant.name, selectedSymptom.name) || 
               'Follow the general solutions above. Monitor your plant closely for improvement.'}
            </Text>
          </View>
        )}

        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={styles.photoButton}
            onPress={handlePhotoCapture}
          >
            <Ionicons name="camera" size={16} color="white" />
            <Text style={styles.photoButtonText}>Take Photo for Analysis</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      {!showDiagnosisResult ? (
        <>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Plant Health Diagnosis</Text>
            <Text style={styles.subtitle}>
              Identify and solve plant health problems quickly
            </Text>
          </View>

          {/* Quick Photo Diagnosis */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📸 Quick Photo Diagnosis</Text>
            <Text style={styles.sectionDescription}>
              Take a photo of your plant for instant analysis
            </Text>
            <View style={styles.photoOptions}>
              <TouchableOpacity 
                style={styles.photoOptionButton}
                onPress={handlePhotoCapture}
              >
                <Ionicons name="camera" size={24} color="#22c55e" />
                <Text style={styles.photoOptionText}>Take Photo</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.photoOptionButton}
                onPress={() => Alert.alert('Gallery', 'Gallery selection would be implemented here')}
              >
                <Ionicons name="images" size={24} color="#22c55e" />
                <Text style={styles.photoOptionText}>From Gallery</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Manual Diagnosis */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🔍 Manual Diagnosis</Text>
            <Text style={styles.sectionDescription}>
              Select your plant and describe the symptoms
            </Text>

            {/* Plant Selection */}
            {myGarden.length > 0 && (
              <View style={styles.plantSelection}>
                <Text style={styles.inputLabel}>Select affected plant (optional):</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {myGarden.map((plant, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.plantOption,
                        selectedPlant?.name === plant.name && styles.selectedPlantOption
                      ]}
                      onPress={() => setSelectedPlant(plant)}
                    >
                      <Text style={[
                        styles.plantOptionText,
                        selectedPlant?.name === plant.name && styles.selectedPlantOptionText
                      ]}>
                        {plant.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}

            {/* Symptom Selection */}
            <View style={styles.symptomSelection}>
              <Text style={styles.inputLabel}>What symptoms do you see?</Text>
              <View style={styles.symptomsGrid}>
                {commonProblems.map((problem) => (
                  <TouchableOpacity
                    key={problem.id}
                    style={[
                      styles.symptomCard,
                      selectedSymptom?.id === problem.id && styles.selectedSymptomCard
                    ]}
                    onPress={() => setSelectedSymptom(problem)}
                  >
                    <Text style={styles.symptomIcon}>{problem.icon}</Text>
                    <Text style={[
                      styles.symptomText,
                      selectedSymptom?.id === problem.id && styles.selectedSymptomText
                    ]}>
                      {problem.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Custom Symptoms */}
            <View style={styles.customSymptoms}>
              <Text style={styles.inputLabel}>Additional symptoms or notes:</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Describe any other symptoms you've noticed..."
                value={customSymptoms}
                onChangeText={setCustomSymptoms}
                multiline
                numberOfLines={3}
                placeholderTextColor="#9ca3af"
              />
            </View>

            {/* Diagnose Button */}
            <TouchableOpacity 
              style={[
                styles.diagnoseButton,
                !selectedSymptom && styles.diagnoseButtonDisabled
              ]}
              onPress={handleDiagnosis}
              disabled={!selectedSymptom}
            >
              <Ionicons name="medical" size={20} color="white" />
              <Text style={styles.diagnoseButtonText}>Get Diagnosis</Text>
            </TouchableOpacity>
          </View>

          {/* Prevention Tips */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🛡️ Prevention Tips</Text>
            <View style={styles.tipsList}>
              <Text style={styles.tip}>• Water plants at soil level to prevent leaf diseases</Text>
              <Text style={styles.tip}>• Ensure good air circulation around plants</Text>
              <Text style={styles.tip}>• Remove dead or diseased plant material promptly</Text>
              <Text style={styles.tip}>• Rotate crops to prevent soil-borne diseases</Text>
              <Text style={styles.tip}>• Use clean tools when pruning or harvesting</Text>
              <Text style={styles.tip}>• Monitor plants regularly for early problem detection</Text>
            </View>
          </View>
        </>
      ) : (
        <DiagnosisResult />
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
  },
  section: {
    backgroundColor: 'white',
    margin: 16,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 16,
  },
  photoOptions: {
    flexDirection: 'row',
    gap: 12,
  },
  photoOptionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#f0fdf4',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#bbf7d0',
    gap: 8,
  },
  photoOptionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#22c55e',
  },
  plantSelection: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 12,
  },
  plantOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#f3f4f6',
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  selectedPlantOption: {
    backgroundColor: '#dcfce7',
    borderColor: '#22c55e',
  },
  plantOptionText: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  selectedPlantOptionText: {
    color: '#22c55e',
  },
  symptomSelection: {
    marginBottom: 20,
  },
  symptomsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  symptomCard: {
    width: '48%',
    padding: 16,
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    alignItems: 'center',
  },
  selectedSymptomCard: {
    backgroundColor: '#dcfce7',
    borderColor: '#22c55e',
  },
  symptomIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  symptomText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6b7280',
    textAlign: 'center',
  },
  selectedSymptomText: {
    color: '#22c55e',
  },
  customSymptoms: {
    marginBottom: 24,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: '#374151',
    backgroundColor: 'white',
    textAlignVertical: 'top',
  },
  diagnoseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#22c55e',
    padding: 16,
    borderRadius: 8,
    gap: 8,
  },
  diagnoseButtonDisabled: {
    backgroundColor: '#d1d5db',
  },
  diagnoseButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  tipsList: {
    gap: 8,
  },
  tip: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
  // Diagnosis Result Styles
  diagnosisResult: {
    backgroundColor: 'white',
    margin: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  resultTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  closeButton: {
    padding: 4,
  },
  problemSection: {
    padding: 20,
  },
  problemTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#22c55e',
    marginBottom: 20,
    textAlign: 'center',
  },
  listItem: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 8,
    lineHeight: 20,
  },
  plantSpecificSection: {
    marginTop: 20,
    padding: 16,
    backgroundColor: '#f0fdf4',
    borderRadius: 8,
  },
  plantAdvice: {
    fontSize: 14,
    color: '#166534',
    fontStyle: 'italic',
    lineHeight: 20,
  },
  actionButtons: {
    marginTop: 24,
    gap: 12,
  },
  photoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3b82f6',
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  photoButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: 'white',
  },
});

export default DiagnoseView; 