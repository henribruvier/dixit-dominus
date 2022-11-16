import {SafeAreaProvider} from 'react-native-safe-area-context';
import {ThemeProvider, createTheme, Button} from '@rneui/themed';
import {NavigationContainer} from '@react-navigation/native';
import MyStack from './src/routes/stack';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import {Subscription} from 'expo-modules-core';
import {useEffect, useRef, useState} from 'react';
import {Platform} from 'react-native';

Notifications.setNotificationHandler({
	handleNotification: async () => ({
		shouldShowAlert: true,
		shouldPlaySound: true,
		shouldSetBadge: true,
	}),
});

const theme = createTheme({
	lightColors: {
		primary: '#e7e7e8',
	},
	darkColors: {
		primary: '#000',
	},
	mode: 'light',
});

export default function App() {
	const [expoPushToken, setExpoPushToken] = useState('');
	const [notification, setNotification] =
		useState<Notifications.Notification>();
	const notificationListener = useRef<Subscription>();
	const responseListener = useRef<Subscription>();

	console.log('notification', notification, expoPushToken);

	useEffect(() => {
		registerForPushNotificationsAsync().then(
			token => token && setExpoPushToken(token),
		);

		notificationListener.current =
			Notifications.addNotificationReceivedListener(notification => {
				notification && setNotification(notification);
			});

		responseListener.current =
			Notifications.addNotificationResponseReceivedListener(response => {
				console.log(response);
			});

		return () => {
			notificationListener.current &&
				Notifications.removeNotificationSubscription(
					notificationListener.current,
				);

			responseListener.current &&
				Notifications.removeNotificationSubscription(responseListener.current);
		};
	}, []);

	return (
		<SafeAreaProvider>
			<ThemeProvider theme={theme}>
				<NavigationContainer>
					<MyStack />
				</NavigationContainer>
			</ThemeProvider>
		</SafeAreaProvider>
	);
}

export const schedulePushNotification = async (title: string, body: string) => {
	await Notifications.scheduleNotificationAsync({
		content: {
			title,
			body,
			data: {data: 'goes here'},
		},
		trigger: {seconds: 1},
	});
};

async function registerForPushNotificationsAsync() {
	let token;

	if (Platform.OS === 'android') {
		await Notifications.setNotificationChannelAsync('default', {
			name: 'default',
			importance: Notifications.AndroidImportance.MAX,
			vibrationPattern: [0, 250, 250, 250],
			lightColor: '#FF231F7C',
		});
	}

	if (Device.isDevice) {
		const {status: existingStatus} = await Notifications.getPermissionsAsync();
		let finalStatus = existingStatus;
		if (existingStatus !== 'granted') {
			const {status} = await Notifications.requestPermissionsAsync();
			finalStatus = status;
		}
		if (finalStatus !== 'granted') {
			alert('Failed to get push token for push notification!');
			return;
		}
		token = (await Notifications.getExpoPushTokenAsync()).data;
		console.log(token);
	} else {
		alert('Must use physical device for Push Notifications');
	}

	return token;
}
