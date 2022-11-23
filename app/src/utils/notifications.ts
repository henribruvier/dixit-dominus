import * as Notifications from 'expo-notifications';

export const schedulePushNotification = async (
	title: string,
	body: string,
	delay?: number,
) =>
	Notifications.scheduleNotificationAsync({
		content: {
			title,
			body,
			data: {url: 'app://dixit-dominus/read'},
			sound: 'bells.wave',
		},
		trigger: {seconds: delay ?? 60 * 20},
	});

export const removeAllPreviousNotifications = async () => {
	Notifications.cancelAllScheduledNotificationsAsync();
};
