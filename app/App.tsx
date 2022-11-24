import {NavigationContainer} from '@react-navigation/native';
import {createTheme, ThemeProvider} from '@rneui/themed';
import * as Device from 'expo-device';
import {Subscription} from 'expo-modules-core';
import * as Notifications from 'expo-notifications';
import {useEffect, useRef, useState} from 'react';
import {Linking, Platform} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import MyStack from './src/routes/stack';
import {schedulePushNotification} from './src/utils/notifications';
import * as Sentry from 'sentry-expo';
import {useAtom} from 'jotai';
import {localDataAtom} from './src/atom';
import AsyncStorage from '@react-native-async-storage/async-storage';

Sentry.init({
	dsn: 'https://8ab175fa7d01426c881b6251f6dff517@o4504214289186816.ingest.sentry.io/4504214292987904',
	enableInExpoDevelopment: true,
	debug: true, // If `true`, Sentry will try to print out useful debugging information if something goes wrong with sending the event. Set it to `false` in production
});

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
	const [localData, setLocalData] = useAtom(localDataAtom);

	useEffect(() => {
		const getData = async () => {
			try {
				const value = await AsyncStorage.getItem('localData');
				if (value !== null) {
					// value previously stored

					const parsed = JSON.parse(value);
					console.log('fist title', parsed.book.sections[0].title);
					console.log('sectionMap', parsed.sectionsMap);

					if (parsed.book) {
						setLocalData(prev => ({
							...prev,
							book: parsed.book,
							sectionsMap: new Map([[parsed.book.id, 0]]),
						}));
					}
					//setLocalData(JSON.parse(value));
				}
			} catch (e) {
				// error reading value
			}
		};
		getData();
	}, []);

	console.log('notification', notification, expoPushToken);

	useEffect(() => {
		registerForPushNotificationsAsync()
			.then(token => token && setExpoPushToken(token))
			.catch(err => Sentry.Native.captureException(err));

		notificationListener.current =
			Notifications.addNotificationReceivedListener(notification => {
				notification && setNotification(notification);
				Linking.openURL('app://dixit-dominus/read').catch(error => {
					console.log('error', error);
					Sentry.Native.captureException(error);
				});
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
				<NavigationContainer
					linking={{
						prefixes: ['app://dixit-dominus'],
						config: {
							screens: {Read: 'read', Settings: 'settings', Home: 'home'},
							// Configuration for linking
						},
						async getInitialURL() {
							// First, you may want to do the default deep link handling
							// Check if app was opened from a deep link
							let url = await Linking.getInitialURL().catch(error => {
								console.log('error', error);
								Sentry.Native.captureException(error);
							});

							if (url != null) {
								return url;
							}

							// Handle URL from expo push notifications
							const response =
								await Notifications.getLastNotificationResponseAsync().catch(
									error => {
										console.log('error', error);
										Sentry.Native.captureException(error);
									},
								);
							url = response?.notification.request.content.data.url as
								| string
								| null;

							return url;
						},
						subscribe(listener) {
							const onReceiveURL = ({url}: {url: string}) => listener(url);

							// Listen to incoming links from deep linking
							Linking.addEventListener('url', onReceiveURL);

							// Listen to expo push notifications
							const subscription =
								Notifications.addNotificationResponseReceivedListener(
									response => {
										const url: string | null = response.notification.request
											.content.data.url as string | null;
										//if (url) Linking.openURL(url).catch(console.error);
										schedulePushNotification(
											'Oh oh',
											"Vous n'avez pas lu votre chapitre",
											3600,
										);
										// Any custom logic to see whether the URL needs to be handled
										//...

										// Let React Navigation handle the URL
										if (url) listener(url);
									},
								);

							return () => {
								// Clean up the event listeners
								Linking.removeAllListeners('url');
								subscription.remove();
							};
						},
					}}
				>
					<MyStack />
				</NavigationContainer>
			</ThemeProvider>
		</SafeAreaProvider>
	);
}

async function registerForPushNotificationsAsync() {
	let token;

	if (Platform.OS === 'android') {
		await Notifications.setNotificationChannelAsync('default', {
			name: 'default',
			importance: Notifications.AndroidImportance.MAX,
			vibrationPattern: [0, 250, 250, 250],
			lightColor: '#FF231F7C',
		}).catch(error => {
			console.log('error', error);
			Sentry.Native.captureException(error);
		});
	}

	if (Device.isDevice) {
		const {status: existingStatus} = await Notifications.getPermissionsAsync();
		let finalStatus = existingStatus;
		if (existingStatus !== 'granted') {
			try {
				const {status} = await Notifications.requestPermissionsAsync();
				finalStatus = status;
				// your code
			} catch (error) {
				console.log('error', error);
				Sentry.Native.captureException(error);
			}
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
