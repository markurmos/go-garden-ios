import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  Switch,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { authService } from '../utils/authService';
import { storageService } from '../utils/storageService';
import { notificationService } from '../utils/notificationService';

const ProfileScreen = ({ user, onSignOut }) => {
  const [profile, setProfile] = useState(null);
  const [notificationSettings, setNotificationSettings] = useState({
    wateringReminders: true,
    harvestReminders: true,
    dailyCheck: true,
    careTips: true,
  });
  const [storageInfo, setStorageInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    try {
      // Load user profile
      if (user) {
        const { success, profile: userProfile } = await authService.getUserProfile();
        if (success) {
          setProfile(userProfile);
        }
      }

      // Load notification settings
      const settings = await storageService.loadNotificationSettings();
      setNotificationSettings(settings);

      // Get storage info
      const info = await storageService.getStorageInfo();
      setStorageInfo(info);
    } catch (error) {
      console.error('Error loading profile data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationToggle = async (key) => {
    const newSettings = {
      ...notificationSettings,
      [key]: !notificationSettings[key],
    };
    
    setNotificationSettings(newSettings);
    await storageService.saveNotificationSettings(newSettings);

    // Update notification schedules based on settings
    if (key === 'dailyCheck') {
      if (newSettings[key]) {
        await notificationService.scheduleDailyGardenCheck();
      } else {
        // Cancel daily check notifications
        const notifications = await notificationService.getScheduledNotifications();
        for (const notif of notifications) {
          if (notif.content.data?.type === 'daily_check') {
            await notificationService.cancelScheduledNotificationAsync(notif.identifier);
          }
        }
      }
    }
  };

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Sign Out', 
          style: 'destructive',
          onPress: async () => {
            await authService.signOut();
            onSignOut();
          }
        }
      ]
    );
  };

  const handleClearData = () => {
    Alert.alert(
      'Clear All Data',
      'This will delete all your local data including plants, notes, and settings. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Clear Data', 
          style: 'destructive',
          onPress: async () => {
            await storageService.clearAllData();
            Alert.alert('Success', 'All local data has been cleared');
            loadProfileData();
          }
        }
      ]
    );
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#22c55e" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {getInitials(profile?.full_name || user?.email)}
            </Text>
          </View>
        </View>
        <Text style={styles.name}>
          {profile?.full_name || 'Guest Gardener'}
        </Text>
        <Text style={styles.email}>{user?.email || 'Not signed in'}</Text>
        
        {profile && (
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>
                {profile.gardening_experience || 'Beginner'}
              </Text>
              <Text style={styles.statLabel}>Experience</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>
                Zone {profile.preferred_zone || 'N/A'}
              </Text>
              <Text style={styles.statLabel}>Garden Zone</Text>
            </View>
          </View>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notifications</Text>
        
        <View style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <Ionicons name="water-outline" size={24} color="#22c55e" />
            <View style={styles.settingText}>
              <Text style={styles.settingTitle}>Watering Reminders</Text>
              <Text style={styles.settingDescription}>
                Get notified when plants need water
              </Text>
            </View>
          </View>
          <Switch
            value={notificationSettings.wateringReminders}
            onValueChange={() => handleNotificationToggle('wateringReminders')}
            trackColor={{ false: '#e5e7eb', true: '#86efac' }}
            thumbColor={notificationSettings.wateringReminders ? '#22c55e' : '#f3f4f6'}
          />
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <Ionicons name="nutrition-outline" size={24} color="#22c55e" />
            <View style={styles.settingText}>
              <Text style={styles.settingTitle}>Harvest Reminders</Text>
              <Text style={styles.settingDescription}>
                Know when your plants are ready
              </Text>
            </View>
          </View>
          <Switch
            value={notificationSettings.harvestReminders}
            onValueChange={() => handleNotificationToggle('harvestReminders')}
            trackColor={{ false: '#e5e7eb', true: '#86efac' }}
            thumbColor={notificationSettings.harvestReminders ? '#22c55e' : '#f3f4f6'}
          />
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <Ionicons name="sunny-outline" size={24} color="#22c55e" />
            <View style={styles.settingText}>
              <Text style={styles.settingTitle}>Daily Garden Check</Text>
              <Text style={styles.settingDescription}>
                Morning reminder to check your garden
              </Text>
            </View>
          </View>
          <Switch
            value={notificationSettings.dailyCheck}
            onValueChange={() => handleNotificationToggle('dailyCheck')}
            trackColor={{ false: '#e5e7eb', true: '#86efac' }}
            thumbColor={notificationSettings.dailyCheck ? '#22c55e' : '#f3f4f6'}
          />
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <Ionicons name="bulb-outline" size={24} color="#22c55e" />
            <View style={styles.settingText}>
              <Text style={styles.settingTitle}>Care Tips</Text>
              <Text style={styles.settingDescription}>
                Helpful tips for your plants
              </Text>
            </View>
          </View>
          <Switch
            value={notificationSettings.careTips}
            onValueChange={() => handleNotificationToggle('careTips')}
            trackColor={{ false: '#e5e7eb', true: '#86efac' }}
            thumbColor={notificationSettings.careTips ? '#22c55e' : '#f3f4f6'}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Storage</Text>
        
        {storageInfo && (
          <View style={styles.storageInfo}>
            <Text style={styles.storageText}>
              Using {storageInfo.totalSize} across {storageInfo.itemCount} items
            </Text>
            <TouchableOpacity
              style={styles.clearButton}
              onPress={handleClearData}
            >
              <Text style={styles.clearButtonText}>Clear All Data</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <View style={styles.section}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => Alert.alert('Coming Soon', 'Account settings will be available soon')}
        >
          <Ionicons name="settings-outline" size={24} color="#374151" />
          <Text style={styles.actionButtonText}>Account Settings</Text>
          <Ionicons name="chevron-forward" size={24} color="#9ca3af" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => Alert.alert('Coming Soon', 'Help & support will be available soon')}
        >
          <Ionicons name="help-circle-outline" size={24} color="#374151" />
          <Text style={styles.actionButtonText}>Help & Support</Text>
          <Ionicons name="chevron-forward" size={24} color="#9ca3af" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => Alert.alert('About', 'Go Garden v1.0.0\n\nYour personal gardening companion')}
        >
          <Ionicons name="information-circle-outline" size={24} color="#374151" />
          <Text style={styles.actionButtonText}>About</Text>
          <Ionicons name="chevron-forward" size={24} color="#9ca3af" />
        </TouchableOpacity>

        {user && (
          <TouchableOpacity
            style={[styles.actionButton, styles.signOutButton]}
            onPress={handleSignOut}
          >
            <Ionicons name="log-out-outline" size={24} color="#ef4444" />
            <Text style={[styles.actionButtonText, styles.signOutText]}>Sign Out</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    paddingVertical: 32,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#22c55e',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: '600',
    color: '#22c55e',
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: '#e5e7eb',
  },
  section: {
    backgroundColor: 'white',
    marginTop: 16,
    paddingVertical: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingText: {
    marginLeft: 16,
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
  },
  settingDescription: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  storageInfo: {
    paddingHorizontal: 20,
  },
  storageText: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 12,
  },
  clearButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#fee2e2',
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  clearButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#ef4444',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  actionButtonText: {
    flex: 1,
    fontSize: 16,
    color: '#374151',
    marginLeft: 16,
  },
  signOutButton: {
    marginTop: 16,
    borderBottomWidth: 0,
  },
  signOutText: {
    color: '#ef4444',
  },
});

export default ProfileScreen;