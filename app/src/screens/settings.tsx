import {StackScreenProps} from '@react-navigation/stack';
import {Icon} from '@rneui/base';
import {Dialog, Divider, useTheme, useThemeMode} from '@rneui/themed';
import {useAtom} from 'jotai';
import React, {useState} from 'react';
import {Linking, Switch, Text, TouchableOpacity, View} from 'react-native';
import {SelectList} from 'react-native-dropdown-select-list';
import {localDataAtom} from '../atom';
import {ButtonApp} from '../components/button';
import {delayParser, settingsData} from '../data/settings';
import {RootStackParamList} from '../routes/stack';
import {getKeyByValue} from '../utils/index';
import {
	removeAllPreviousNotifications,
	schedulePushNotification,
} from '../utils/notifications';

type Props = StackScreenProps<RootStackParamList, 'Settings'>;

const dataToSeconds = (selected: keyof typeof delayParser) =>
	delayParser[selected];

const secondsToData = (delay: number | undefined) =>
	getKeyByValue(delayParser, delay);

export const SettingsSection = ({navigation}: Props) => {
	const [localData, setLocalData] = useAtom(localDataAtom);
	const [isDialogDelayVisible, setIsDialogDelayVisible] = useState(false);
	const [selected, setSelected] = useState(secondsToData(localData.delay));
	const [isDarkMode, setIsDarkMode] = useState(false);
	const {setMode} = useThemeMode();
	const {theme} = useTheme();

	const toggleSwitch = () => {
		const newValue = !isDarkMode;
		const newMode = newValue ? 'dark' : 'light';
		setIsDarkMode(() => newValue);
		setMode(newMode);
		setLocalData(prev => ({
			...prev,
			colorMode: newMode,
		}));
	};

	const onChangeDelay = () => {
		if (!selected) return;
		removeAllPreviousNotifications();
		const newDelay = dataToSeconds(selected);
		if (localData?.book)
			schedulePushNotification(
				'Il est temps de lire',
				'Votre chapitre vous attend',
				newDelay,
			);
		setLocalData(prev => ({...prev, delay: newDelay}));
		setIsDialogDelayVisible(false);
	};

	const onPressDiscord = () =>
		Linking.canOpenURL('https://discord.gg/qp7yrpdz').then(() => {
			Linking.openURL('https://discord.gg/qp7yrpdz');
		});

	return (
		<View
			className='h-full w-full px-2'
			style={{backgroundColor: theme.colors.background}}
		>
			<View className='border-b border-gray-300'>
				<Text
					className='text-3xl pt-12 font-bold pb-4'
					style={{color: theme.colors.primary}}
				>
					Paramètres
				</Text>
			</View>
			<Divider />
			<View className='flex pt-5 px-2 justify-between pb-28 h-full items-center gap-2'>
				<View className='w-full flex flex-col gap-4 justify-center items-center'>
					<View className='flex w-full flex-row justify-between mx-2'>
						<Text
							className='text-lg'
							style={{
								color: theme.colors.black,
							}}
						>
							Fréquence des notifications :
						</Text>
						<Text
							className='text-lg font-bold'
							style={{
								color: theme.colors.black,
							}}
						>
							{secondsToData(localData.delay)}
						</Text>
						<TouchableOpacity
							className='flex pl-2 items-center justify-center'
							onPress={() => setIsDialogDelayVisible(() => true)}
						>
							<Icon name='edit' type='feather' color='#517fa4' size={24} />
						</TouchableOpacity>
					</View>
					<View className='flex w-full flex-row justify-between mx-2'>
						<Text
							className='text-lg'
							style={{
								color: theme.colors.black,
							}}
						>
							Mode sombre :
						</Text>
						<Switch
							trackColor={{false: '#767577', true: '#81b0ff'}}
							thumbColor={isDarkMode ? '#f5dd4b' : '#f4f3f4'}
							ios_backgroundColor='#3e3e3e'
							onValueChange={toggleSwitch}
							value={isDarkMode}
						/>
					</View>
				</View>

				<View className='flex w-full flex-col gap-1 justify-start items-start'>
					<Text
						className='text-lg w-full'
						style={{
							color: theme.colors.grey2,
						}}
					>
						Nous rejoindre
					</Text>
					<TouchableOpacity
						onPress={() => onPressDiscord()}
						className='flex flex-row items-center gap-2 justify-start'
					>
						<Icon
							name='discord'
							type='material-community'
							color={theme.colors.grey2}
						/>
						<Text
							className='text-lg underline'
							style={{
								color: theme.colors.grey2,
							}}
						>
							Channel Discord
						</Text>
					</TouchableOpacity>
					<View className='flex flex-row items-center gap-2 justify-start'>
						<Icon
							name='email'
							type='material-community'
							color={theme.colors.grey2}
						/>
						<Text
							className='text-lg underline'
							style={{
								color: theme.colors.grey2,
							}}
						>
							dixit.dominus.app@gmail.com
						</Text>
					</View>
				</View>
			</View>
			<Dialog
				onBackdropPress={() => setIsDialogDelayVisible(value => !value)}
				isVisible={isDialogDelayVisible}
			>
				<Dialog.Title title='Choisir le délai entre les notifications' />
				<SelectList
					setSelected={(val: keyof typeof delayParser) => setSelected(val)}
					data={settingsData}
					save='value'
					search={false}
					defaultOption={{key: '1', value: selected}}
				/>
				<View className='py-4'>
					<ButtonApp onPress={() => onChangeDelay()}>Valider</ButtonApp>
				</View>
			</Dialog>
		</View>
	);
};
