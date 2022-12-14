import AsyncStorage from '@react-native-async-storage/async-storage';
import {NavigationContainer} from '@react-navigation/native';
import {
	createTheme,
	Dialog,
	ThemeProvider,
	useTheme,
	useThemeMode,
} from '@rneui/themed';
import * as Device from 'expo-device';
import {Subscription} from 'expo-modules-core';
import * as Notifications from 'expo-notifications';
import {StatusBar} from 'expo-status-bar';
import {useAtom, useAtomValue} from 'jotai';
import React, {PropsWithChildren, useEffect, useRef, useState} from 'react';
import {Appearance, AppState, Linking, Platform, View} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import * as Sentry from 'sentry-expo';
import {localDataAtom} from './src/atom';
import {ButtonApp} from './src/components/button';
import MyStack from './src/routes/stack';
import {LocalData} from './src/types/local-storage';
import {resetBadge, schedulePushNotification} from './src/utils/notifications';

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

const theme_ = createTheme({
	lightColors: {
		primary: '#173052',
		secondary: '#80A6DB',
	},
	darkColors: {
		primary: '#567197',
		secondary: '#a9c9f5',
	},
	mode: 'light',
});

const ColorScheme = ({children}: PropsWithChildren) => {
	const {theme} = useTheme();
	const {setMode} = useThemeMode();
	const localData = useAtomValue(localDataAtom);

	useEffect(() => {
		setMode(localData.colorMode ?? 'light');
	}, [localData.colorMode]);

	return (
		<View
			className='h-full w-full flex'
			style={{backgroundColor: theme.colors.background}}
		>
			{children}
		</View>
	);
};

export default function App() {
	const notificationListener = useRef<Subscription>();
	const responseListener = useRef<Subscription>();
	const [localData, setLocalData] = useAtom(localDataAtom);
	const [showModalAllowNotifications, setShowModalAllowNotifications] =
		useState(false);

	async function registerForPushNotificationsAsync() {
		setShowModalAllowNotifications(() => false);
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
		console.log(Device.isDevice);

		if (Device.isDevice) {
			const {status: existingStatus} =
				await Notifications.getPermissionsAsync();
			console.log('existing status', existingStatus);
			let finalStatus = existingStatus;
			if (existingStatus !== 'granted') {
				try {
					const {status} = await Notifications.requestPermissionsAsync();
					console.log('request', status);
					finalStatus = status;
					// your code
				} catch (error) {
					console.log('error', error);
					console.log('you have to allow notification to use this app');
					Sentry.Native.captureException(error);
				}
			}
			if (finalStatus !== 'granted') {
				//	Linking.openURL('app-settings:');
				setShowModalAllowNotifications(() => true);
				return;
			}
			token = (await Notifications.getExpoPushTokenAsync()).data;
			console.log(token);
		} else {
			alert('Must use physical device for Push Notifications');
		}

		return token;
	}

	useEffect(() => {
		const getData = async () => {
			try {
				const value = await AsyncStorage.getItem('localData');
				if (value !== null) {
					const parsed = JSON.parse(value) as LocalData;
					if (parsed.book) {
						setLocalData(prev => ({
							...prev,
							delay: parsed.delay,
							book: parsed.book,
							sectionsMap: {...parsed.sectionsMap},
							colorMode: parsed.colorMode ?? 'light',
						}));
					}
				}
			} catch (e) {
				// error reading value
			}
		};
		getData();
	}, []);

	useEffect(() => {
		resetBadge();
	}, []);

	useEffect(() => {
		const check = async () => {
			console.log('change');
			await registerForPushNotificationsAsync();
		};
		const listener = AppState.addEventListener('change', check);

		return () => listener.remove();
	}, []);

	useEffect(() => {
		registerForPushNotificationsAsync().catch(err =>
			Sentry.Native.captureException(err),
		);

		notificationListener.current =
			Notifications.addNotificationReceivedListener(async notification => {
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

	useEffect(() => {
		const updateColorScheme: Appearance.AppearanceListener = ({
			colorScheme,
		}) => {
			if (colorScheme)
				setLocalData(prev => ({...prev, colorMode: colorScheme}));
		};

		Appearance.addChangeListener(updateColorScheme);
	}, []);

	return (
		<SafeAreaProvider>
			<ThemeProvider theme={theme_}>
				<NavigationContainer
					linking={{
						prefixes: ['app://dixit-dominus'],
						config: {
							screens: {Read: 'read', Settings: 'settings', Home: 'home'},
						},
						async getInitialURL() {
							let url = await Linking.getInitialURL().catch(error => {
								console.log('error', error);
								Sentry.Native.captureException(error);
							});

							if (url != null) return url;

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
							Linking.addEventListener('url', onReceiveURL);

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
										if (url) listener(url);
									},
								);

							return () => {
								Linking.removeAllListeners('url');
								subscription.remove();
							};
						},
					}}
				>
					<ColorScheme>
						<StatusBar
							style={localData.colorMode === 'light' ? 'auto' : 'light'}
						/>
						<MyStack />
						<Dialog
							isVisible={showModalAllowNotifications}
							overlayStyle={{backgroundColor: 'white'}}
						>
							<Dialog.Title title='Pour utiliser cette application vous devez autoriser les notifications' />

							<View className='py-4'>
								<ButtonApp
									onPress={() => {
										Linking.openURL('app-settings:');
									}}
								>
									Ouvir les param??tres
								</ButtonApp>
							</View>
						</Dialog>
					</ColorScheme>
				</NavigationContainer>
			</ThemeProvider>
		</SafeAreaProvider>
	);
}
