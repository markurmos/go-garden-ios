// Web version of notification service - uses browser notifications
class NotificationService {
  constructor() {
    this.hasPermission = false;
  }

  async initialize() {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      this.hasPermission = permission === 'granted';
    }
    return this.hasPermission;
  }

  async scheduleNotification(title, body, trigger) {
    if (!this.hasPermission) {
      console.log('No notification permission');
      return null;
    }

    // For web, we'll use setTimeout for scheduling
    const delay = trigger.seconds ? trigger.seconds * 1000 : 0;
    
    setTimeout(() => {
      new Notification(title, {
        body,
        icon: '/assets/icon.png',
      });
    }, delay);

    return { id: Date.now().toString() };
  }

  async cancelNotification(notificationId) {
    // Web notifications can't be cancelled once scheduled with setTimeout
    console.log('Cancelling notification:', notificationId);
  }

  async cancelAllNotifications() {
    console.log('Cancelling all notifications');
  }

  async getAllScheduledNotifications() {
    // Web doesn't have a way to get scheduled notifications
    return [];
  }
}

export const notificationService = new NotificationService();

export const scheduleWateringReminder = async (plantName, nextWateringDate) => {
  const now = new Date();
  const wateringTime = new Date(nextWateringDate);
  wateringTime.setHours(9, 0, 0, 0);
  
  const secondsUntilWatering = Math.max(0, (wateringTime - now) / 1000);
  
  return await notificationService.scheduleNotification(
    `Time to water ${plantName}!`,
    'Your plant needs water to stay healthy and grow strong.',
    { seconds: secondsUntilWatering }
  );
};

export const scheduleHarvestReminder = async (plantName, harvestDate) => {
  const now = new Date();
  const harvestTime = new Date(harvestDate);
  harvestTime.setHours(10, 0, 0, 0);
  
  const secondsUntilHarvest = Math.max(0, (harvestTime - now) / 1000);
  
  return await notificationService.scheduleNotification(
    `${plantName} is ready to harvest!`,
    'Check your plant - it might be ready to harvest today.',
    { seconds: secondsUntilHarvest }
  );
};

export const scheduleDailyCheckReminder = async () => {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(8, 0, 0, 0);
  
  const secondsUntilTomorrow = Math.max(0, (tomorrow - now) / 1000);
  
  return await notificationService.scheduleNotification(
    'Check on your garden!',
    'Take a moment to check your plants for water, pests, or diseases.',
    { seconds: secondsUntilTomorrow }
  );
};

export const scheduleAllPlantReminders = async (userPlants) => {
  await notificationService.initialize();
  
  for (const plant of userPlants) {
    if (plant.nextWatering) {
      await scheduleWateringReminder(plant.name, plant.nextWatering);
    }
    
    if (plant.estimatedHarvest) {
      await scheduleHarvestReminder(plant.name, plant.estimatedHarvest);
    }
  }
  
  await scheduleDailyCheckReminder();
};