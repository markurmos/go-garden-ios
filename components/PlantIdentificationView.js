import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Modal,
  Animated,
  Dimensions,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { plantIdentificationService, PLANT_ORGANS } from '../utils/plantIdentificationService';
import { PLANT_DATABASE } from '../data/plantDatabase';

const { width, height } = Dimensions.get('window');

const PlantIdentificationView = ({ onIdentified, onClose }) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [cameraType, setCameraType] = useState('back');
  const [capturedImage, setCapturedImage] = useState(null);
  const [isIdentifying, setIsIdentifying] = useState(false);
  const [identificationResult, setIdentificationResult] = useState(null);
  const [selectedOrgan, setSelectedOrgan] = useState(PLANT_ORGANS.LEAF);
  const [showTips, setShowTips] = useState(false);
  const cameraRef = useRef(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();

    // Fade in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, []);

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8,
          base64: false,
        });
        setCapturedImage(photo.uri);
        identifyPlant(photo.uri);
      } catch (error) {
        console.error('Error taking picture:', error);
        Alert.alert('Error', 'Failed to take picture');
      }
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setCapturedImage(result.assets[0].uri);
      identifyPlant(result.assets[0].uri);
    }
  };

  const identifyPlant = async (imageUri) => {
    setIsIdentifying(true);
    setIdentificationResult(null);

    try {
      const result = await plantIdentificationService.identifyPlant(imageUri, {
        organs: [selectedOrgan],
      });

      if (result.success) {
        setIdentificationResult(result);
        
        // Save to history
        await plantIdentificationService.saveIdentificationHistory({
          ...result,
          imageUri,
        });

        // If high confidence match in database, show add option
        if (result.primary?.matchedInDatabase && result.primary.confidence > 80) {
          setTimeout(() => {
            Alert.alert(
              'Plant Identified!',
              `${result.primary.commonName} (${result.primary.confidence}% confidence)`,
              [
                { text: 'Try Again', onPress: resetCamera },
                { 
                  text: 'Add to Garden', 
                  onPress: () => handleAddToGarden(result.primary)
                },
              ]
            );
          }, 500);
        }
      } else {
        Alert.alert('Identification Failed', result.error || 'Please try again');
      }
    } catch (error) {
      console.error('Identification error:', error);
      Alert.alert('Error', 'Failed to identify plant');
    } finally {
      setIsIdentifying(false);
    }
  };

  const handleAddToGarden = (plantData) => {
    if (plantData.matchedInDatabase) {
      onIdentified({
        name: plantData.databaseMatch.name,
        data: plantData.databaseMatch.data,
        identificationConfidence: plantData.confidence,
      });
    }
  };

  const resetCamera = () => {
    setCapturedImage(null);
    setIdentificationResult(null);
  };

  const renderOrganSelector = () => (
    <View style={styles.organSelector}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {Object.entries(PLANT_ORGANS).map(([key, value]) => (
          <TouchableOpacity
            key={key}
            style={[
              styles.organButton,
              selectedOrgan === value && styles.organButtonActive,
            ]}
            onPress={() => setSelectedOrgan(value)}
          >
            <Text style={[
              styles.organButtonText,
              selectedOrgan === value && styles.organButtonTextActive,
            ]}>
              {key.charAt(0) + key.slice(1).toLowerCase()}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderCamera = () => (
    <View style={styles.cameraContainer}>
      <Camera
        ref={cameraRef}
        style={styles.camera}
        type={cameraType}
        ratio="4:3"
      >
        <LinearGradient
          colors={['rgba(0,0,0,0.4)', 'transparent', 'transparent', 'rgba(0,0,0,0.4)']}
          style={styles.cameraGradient}
        >
          <View style={styles.cameraHeader}>
            <TouchableOpacity
              style={styles.cameraButton}
              onPress={onClose}
            >
              <Ionicons name="close" size={28} color="white" />
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.cameraButton}
              onPress={() => setShowTips(!showTips)}
            >
              <Ionicons name="help-circle-outline" size={28} color="white" />
            </TouchableOpacity>
          </View>

          {renderOrganSelector()}

          {showTips && (
            <View style={styles.tipsContainer}>
              <Text style={styles.tipsTitle}>Tips for {selectedOrgan}:</Text>
              {plantIdentificationService.getIdentificationTips(selectedOrgan).map((tip, index) => (
                <Text key={index} style={styles.tipText}>• {tip}</Text>
              ))}
            </View>
          )}

          <View style={styles.cameraControls}>
            <TouchableOpacity
              style={styles.galleryButton}
              onPress={pickImage}
            >
              <Ionicons name="images-outline" size={28} color="white" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.captureButton}
              onPress={takePicture}
            >
              <View style={styles.captureButtonInner} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.flipButton}
              onPress={() => {
                setCameraType(
                  cameraType === 'back' ? 'front' : 'back'
                );
              }}
            >
              <Ionicons name="camera-reverse-outline" size={28} color="white" />
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </Camera>
    </View>
  );

  const renderResults = () => (
    <ScrollView style={styles.resultsContainer} showsVerticalScrollIndicator={false}>
      {identificationResult?.primary && (
        <View style={styles.primaryResult}>
          <Image source={{ uri: capturedImage }} style={styles.capturedImage} />
          
          <View style={styles.resultHeader}>
            <Text style={styles.commonName}>{identificationResult.primary.commonName}</Text>
            <Text style={styles.scientificName}>{identificationResult.primary.scientificName}</Text>
            
            <View style={styles.confidenceContainer}>
              <View style={styles.confidenceBar}>
                <View 
                  style={[
                    styles.confidenceFill,
                    { 
                      width: `${identificationResult.primary.confidence}%`,
                      backgroundColor: identificationResult.primary.confidence > 70 ? '#22c55e' : '#f59e0b'
                    }
                  ]} 
                />
              </View>
              <Text style={styles.confidenceText}>
                {identificationResult.primary.confidence}% confidence
              </Text>
            </View>

            {identificationResult.primary.matchedInDatabase && (
              <View style={styles.matchBadge}>
                <Ionicons name="checkmark-circle" size={20} color="#22c55e" />
                <Text style={styles.matchText}>Available in Go Garden!</Text>
              </View>
            )}
          </View>

          {identificationResult.primary.careInfo && (
            <View style={styles.careInfo}>
              <Text style={styles.careTitle}>Quick Care Guide:</Text>
              {identificationResult.primary.careInfo.quickTips.map((tip, index) => (
                <View key={index} style={styles.careTip}>
                  <Ionicons name="leaf-outline" size={16} color="#22c55e" />
                  <Text style={styles.careTipText}>{tip}</Text>
                </View>
              ))}
            </View>
          )}

          {identificationResult.primary.images?.length > 0 && (
            <View style={styles.referenceImages}>
              <Text style={styles.referenceTitle}>Reference Images:</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {identificationResult.primary.images.map((imageUrl, index) => (
                  <Image
                    key={index}
                    source={{ uri: imageUrl }}
                    style={styles.referenceImage}
                  />
                ))}
              </ScrollView>
            </View>
          )}
        </View>
      )}

      {identificationResult?.alternatives?.length > 0 && (
        <View style={styles.alternatives}>
          <Text style={styles.alternativesTitle}>Other Possibilities:</Text>
          {identificationResult.alternatives.map((alt, index) => (
            <TouchableOpacity
              key={index}
              style={styles.alternativeItem}
              onPress={() => {
                Alert.alert(
                  alt.commonName,
                  `Scientific: ${alt.scientificName}\nFamily: ${alt.family}\nConfidence: ${alt.confidence}%`
                );
              }}
            >
              <Text style={styles.alternativeName}>{alt.commonName}</Text>
              <Text style={styles.alternativeConfidence}>{alt.confidence}%</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <View style={styles.resultActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={resetCamera}
        >
          <Ionicons name="camera-outline" size={20} color="#6b7280" />
          <Text style={styles.actionButtonText}>Try Again</Text>
        </TouchableOpacity>

        {identificationResult?.primary?.matchedInDatabase && (
          <TouchableOpacity
            style={[styles.actionButton, styles.primaryActionButton]}
            onPress={() => handleAddToGarden(identificationResult.primary)}
          >
            <Ionicons name="add-circle-outline" size={20} color="white" />
            <Text style={[styles.actionButtonText, styles.primaryActionText]}>
              Add to Garden
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );

  if (hasPermission === null) {
    return <View style={styles.container} />;
  }

  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text style={styles.noPermissionText}>No access to camera</Text>
        <TouchableOpacity style={styles.permissionButton} onPress={pickImage}>
          <Text style={styles.permissionButtonText}>Choose from Gallery</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={true}
      onRequestClose={onClose}
    >
      <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
        {!capturedImage && renderCamera()}
        
        {capturedImage && isIdentifying && (
          <View style={styles.loadingContainer}>
            <Image source={{ uri: capturedImage }} style={styles.loadingImage} />
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="large" color="white" />
              <Text style={styles.loadingText}>Identifying plant...</Text>
              <Text style={styles.loadingSubtext}>
                Analyzing {selectedOrgan} characteristics
              </Text>
            </View>
          </View>
        )}

        {capturedImage && !isIdentifying && identificationResult && renderResults()}
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  cameraContainer: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  cameraGradient: {
    flex: 1,
    justifyContent: 'space-between',
  },
  cameraHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  cameraButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  organSelector: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  organButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 10,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  organButtonActive: {
    backgroundColor: '#22c55e',
    borderColor: '#22c55e',
  },
  organButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  organButtonTextActive: {
    fontWeight: '600',
  },
  tipsContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    marginHorizontal: 20,
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  tipsTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  tipText: {
    color: 'white',
    fontSize: 14,
    marginBottom: 5,
  },
  cameraControls: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    paddingBottom: 30,
    paddingHorizontal: 40,
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'white',
    padding: 3,
  },
  captureButtonInner: {
    flex: 1,
    borderRadius: 32,
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#000',
  },
  galleryButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  flipButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  loadingImage: {
    width: '100%',
    height: '100%',
    opacity: 0.3,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    marginTop: 20,
  },
  loadingSubtext: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
    marginTop: 5,
  },
  resultsContainer: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  primaryResult: {
    backgroundColor: 'white',
  },
  capturedImage: {
    width: '100%',
    height: 300,
  },
  resultHeader: {
    padding: 20,
  },
  commonName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 5,
  },
  scientificName: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#6b7280',
    marginBottom: 15,
  },
  confidenceContainer: {
    marginBottom: 15,
  },
  confidenceBar: {
    height: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 5,
  },
  confidenceFill: {
    height: '100%',
    borderRadius: 4,
  },
  confidenceText: {
    fontSize: 14,
    color: '#6b7280',
  },
  matchBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0fdf4',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  matchText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#22c55e',
    marginLeft: 5,
  },
  careInfo: {
    backgroundColor: '#f9fafb',
    padding: 20,
    marginTop: 20,
  },
  careTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 15,
  },
  careTip: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  careTipText: {
    fontSize: 14,
    color: '#4b5563',
    marginLeft: 10,
  },
  referenceImages: {
    padding: 20,
  },
  referenceTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 10,
  },
  referenceImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginRight: 10,
  },
  alternatives: {
    padding: 20,
    backgroundColor: 'white',
    marginTop: 10,
  },
  alternativesTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 15,
  },
  alternativeItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  alternativeName: {
    fontSize: 14,
    color: '#374151',
  },
  alternativeConfidence: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  resultActions: {
    flexDirection: 'row',
    padding: 20,
    gap: 15,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: 'white',
  },
  primaryActionButton: {
    backgroundColor: '#22c55e',
    borderColor: '#22c55e',
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#6b7280',
    marginLeft: 8,
  },
  primaryActionText: {
    color: 'white',
  },
  noPermissionText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
  permissionButton: {
    backgroundColor: '#22c55e',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
  },
  permissionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default PlantIdentificationView;