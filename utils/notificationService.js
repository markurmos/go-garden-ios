import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import { PLANT_DATABASE } from '../data/plantDatabase';

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

class NotificationService {
  constructor() {
    this.notificationListener = null;
    this.responseListener = null;
  }

  // Initialize notification service
  async initialize() {
    try {
      // Request permissions
      const { status } = await this.requestPermissions();
      if (status !== 'granted') {
        console.log('Notification permissions not granted');
        return false;
      }

      // Setup notification listeners
      this.setupListeners();
      
      console.log('✅ Notification service initialized');
      return true;
    } catch (error) {
      console.error('Error initializing notifications:', error);
      return false;
    }
  }

  // Request notification permissions
  async requestPermissions() {
    let token;
    
    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      
      if (finalStatus !== 'granted') {
        console.log('Failed to get push token for push notification!');
        return { status: finalStatus };
      }
      
      // Get push token for remote notifications (optional)
      token = (await Notifications.getExpoPushTokenAsync()).data;
      console.log('Push token:', token);
    } else {
      console.log('Must use physical device for Push Notifications');
    }

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('plant-care', {
        name: 'Plant Care Reminders',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#4CAF50',
      });
    }

    return { status: 'granted', token };
  }

  // Setup notification listeners
  setupListeners() {
    // Handle notifications that are received while the app is foregrounded
    this.notificationListener = Notifications.addNotificationReceivedListener(notification => {
      console.log('Notification received:', notification);
    });

    // Handle notifications that are clicked
    this.responseListener = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('Notification clicked:', response);
      // Navigate to plant details or care instructions
      this.handleNotificationClick(response.notification.request.content.data);
    });
  }

  // Schedule watering reminder
  async scheduleWateringReminder(plant, plantedDate, gardenName = 'My Garden') {
    try {
      const plantInfo = PLANT_DATABASE[plant.id || plant.name];
      if (!plantInfo) {
        console.error('Plant not found in database:', plant.name);
        return;
      }

      // Cancel existing reminders for this plant
      await this.cancelPlantReminders(plant.id || plant.name);

      // Calculate next watering time
      const now = new Date();
      const nextWatering = new Date(now);
      nextWatering.setDate(nextWatering.getDate() + plantInfo.wateringFrequency);
      nextWatering.setHours(9, 0, 0, 0); // Set to 9:00 AM

      // Schedule the notification
      const identifier = await Notifications.scheduleNotificationAsync({
        content: {
          title: '💧 Time to Water!',
          body: `Your ${plant.name} in ${gardenName} needs watering today.`,
          data: { 
            plantId: plant.id || plant.name, 
            type: 'watering',
            gardenName 
          },
          sound: true,
          priority: 'high',
        },
        trigger: {
          date: nextWatering,
          repeats: false, // We'll reschedule after each watering
        },
      });

      console.log(`📅 Scheduled watering reminder for ${plant.name} at ${nextWatering}`);
      return identifier;
    } catch (error) {
      console.error('Error scheduling watering reminder:', error);
    }
  }

  // Schedule harvest reminder
  async scheduleHarvestReminder(plant, plantedDate, gardenName = 'My Garden') {
    try {
      const plantInfo = PLANT_DATABASE[plant.id || plant.name];
      if (!plantInfo) return;

      // Calculate harvest date
      const growthDays = parseInt(plantInfo.growthTime.split('-')[0]);
      const harvestDate = new Date(plantedDate);
      harvestDate.setDate(harvestDate.getDate() + growthDays);
      harvestDate.setHours(9, 0, 0, 0);

      // Schedule harvest notification
      const identifier = await Notifications.scheduleNotificationAsync({
        content: {
          title: '🌱 Ready to Harvest!',
          body: `Your ${plant.name} in ${gardenName} should be ready to harvest. Check if it's at the right size.`,
          data: { 
            plantId: plant.id || plant.name, 
            type: 'harvest',
            gardenName 
          },
          sound: true,
          priority: 'high',
        },
        trigger: {
          date: harvestDate,
        },
      });

      console.log(`📅 Scheduled harvest reminder for ${plant.name} at ${harvestDate}`);
      return identifier;
    } catch (error) {
      console.error('Error scheduling harvest reminder:', error);
    }
  }

  // Schedule care tips notification
  async scheduleCareTips(plant, dayAfterPlanting = 7) {
    try {
      const plantInfo = PLANT_DATABASE[plant.id || plant.name];
      if (!plantInfo) return;

      const tipDate = new Date();
      tipDate.setDate(tipDate.getDate() + dayAfterPlanting);
      tipDate.setHours(10, 0, 0, 0); // 10:00 AM

      const tips = plantInfo.tips || 'Check on your plant and ensure it\'s growing well!';
      
      const identifier = await Notifications.scheduleNotificationAsync({
        content: {
          title: '💡 Plant Care Tip',
          body: `${plant.name}: ${tips}`,
          data: { 
            plantId: plant.id || plant.name, 
            type: 'tips' 
          },
          sound: true,
        },
        trigger: {
          date: tipDate,
        },
      });

      console.log(`📅 Scheduled care tip for ${plant.name}`);
      return identifier;
    } catch (error) {
      console.error('Error scheduling care tips:', error);
    }
  }

  // Schedule daily garden check reminder
  async scheduleDailyGardenCheck() {
    try {
      // Schedule for tomorrow at 8:00 AM
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(8, 0, 0, 0);

      const identifier = await Notifications.scheduleNotificationAsync({
        content: {
          title: '🌻 Good Morning, Gardener!',
          body: 'Time for your daily garden check. See what needs attention today.',
          data: { type: 'daily_check' },
          sound: true,
        },
        trigger: {
          hour: 8,
          minute: 0,
          repeats: true,
        },
      });

      console.log('📅 Scheduled daily garden check reminder');
      return identifier;
    } catch (error) {
      console.error('Error scheduling daily check:', error);
    }
  }

  // Cancel all reminders for a specific plant
  async cancelPlantReminders(plantId) {
    try {
      const scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync();
      
      for (const notification of scheduledNotifications) {
        if (notification.content.data?.plantId === plantId) {
          await Notifications.cancelScheduledNotificationAsync(notification.identifier);
          console.log(`❌ Cancelled reminder for plant: ${plantId}`);
        }
      }
    } catch (error) {
      console.error('Error cancelling plant reminders:', error);
    }
  }

  // Cancel all notifications
  async cancelAllNotifications() {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
      console.log('❌ All notifications cancelled');
    } catch (error) {
      console.error('Error cancelling all notifications:', error);
    }
  }

  // Get all scheduled notifications
  async getScheduledNotifications() {
    try {
      const notifications = await Notifications.getAllScheduledNotificationsAsync();
      return notifications;
    } catch (error) {
      console.error('Error getting scheduled notifications:', error);
      return [];
    }
  }

  // Handle notification click
  handleNotificationClick(data) {
    if (!data) return;

    switch (data.type) {
      case 'watering':
        // Navigate to plant details or watering screen
        console.log('Navigate to watering for plant:', data.plantId);
        break;
      case 'harvest':
        // Navigate to harvest instructions
        console.log('Navigate to harvest info for plant:', data.plantId);
        break;
      case 'tips':
        // Show plant care tips
        console.log('Show care tips for plant:', data.plantId);
        break;
      case 'daily_check':
        // Navigate to garden overview
        console.log('Navigate to garden overview');
        break;
      default:
        break;
    }
  }

  // Clean up listeners
  cleanup() {
    if (this.notificationListener) {
      Notifications.removeNotificationSubscription(this.notificationListener);
    }
    if (this.responseListener) {
      Notifications.removeNotificationSubscription(this.responseListener);
    }
  }
}

// Create singleton instance
export const notificationService = new NotificationService();

// Helper function to schedule all reminders for a plant
export const scheduleAllPlantReminders = async (plant, plantedDate, gardenName) => {
  const reminders = [];
  
  // Schedule watering reminder
  const wateringId = await notificationService.scheduleWateringReminder(plant, plantedDate, gardenName);
  if (wateringId) reminders.push({ type: 'watering', id: wateringId });

  // Schedule harvest reminder
  const harvestId = await notificationService.scheduleHarvestReminder(plant, plantedDate, gardenName);
  if (harvestId) reminders.push({ type: 'harvest', id: harvestId });

  // Schedule care tips (7 days after planting)
  const tipsId = await notificationService.scheduleCareTips(plant, 7);
  if (tipsId) reminders.push({ type: 'tips', id: tipsId });

  return reminders;
};