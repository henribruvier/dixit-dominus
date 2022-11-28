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
			badge: 1,
		},
		trigger: {seconds: delay ?? 60 * 20},
	});

export const removeAllPreviousNotifications = async () => {
	Notifications.cancelAllScheduledNotificationsAsync();
};

export const resetBadge = async () => {
	try {
		const resetAppBadgeCount = await Notifications.setBadgeCountAsync(0);
		console.log(`reset app badge count ${resetAppBadgeCount}`);
	} catch (err) {
		console.log('did not manage to reset notif app badge count!', err);
	}
};
