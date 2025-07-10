// Web version of notification service (stub implementation)
class NotificationServiceWeb {
  async initialize() {
    console.log('Web: Notifications not supported');
    return false;
  }

  async requestPermissions() {
    return { status: 'unavailable' };
  }

  setupListeners() {
    // No-op on web
  }

  async scheduleWateringReminder() {
    console.log('Web: Cannot schedule notifications');
    return null;
  }

  async scheduleHarvestReminder() {
    console.log('Web: Cannot schedule notifications');
    return null;
  }

  async scheduleCareTips() {
    console.log('Web: Cannot schedule notifications');
    return null;
  }

  async scheduleDailyGardenCheck() {
    console.log('Web: Cannot schedule notifications');
    return null;
  }

  async cancelPlantReminders() {
    // No-op on web
  }

  async cancelAllNotifications() {
    // No-op on web
  }

  async getScheduledNotifications() {
    return [];
  }

  handleNotificationClick() {
    // No-op on web
  }

  cleanup() {
    // No-op on web
  }
}

export const notificationService = new NotificationServiceWeb();

export const scheduleAllPlantReminders = async () => {
  console.log('Web: Plant reminders not available');
  return [];
};