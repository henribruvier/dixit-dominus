import {StackScreenProps} from '@react-navigation/stack';
import {Icon} from '@rneui/base';
import {Dialog, Divider} from '@rneui/themed';
import {useAtom} from 'jotai';
import React, {useState} from 'react';
import {Linking, Text, TouchableOpacity, View} from 'react-native';
import {SelectList} from 'react-native-dropdown-select-list';
import {localDataAtom} from '../atom';
import {ButtonApp} from '../components/button';
import {delayParser, settingsData} from '../data/settings';
import {RootStackParamList} from '../routes/stack';
import {
	removeAllPreviousNotifications,
	schedulePushNotification,
} from '../utils/notifications';
import {getKeyByValue} from '../utils/index';

type Props = StackScreenProps<RootStackParamList, 'Settings'>;

const dataToSeconds = (selected: keyof typeof delayParser) =>
	delayParser[selected];

const secondsToData = (delay: number | undefined) =>
	getKeyByValue(delayParser, delay);

export const SettingsSection = ({navigation}: Props) => {
	const [localData, setLocalData] = useAtom(localDataAtom);
	const [isDialogDelayVisible, setIsDialogDelayVisible] = useState(false);
	const [selected, setSelected] = useState(secondsToData(localData.delay));

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
		<View className='h-full w-full px-2'>
			<View className='border-b border-gray-300'>
				<Text className='text-3xl pt-12 font-bold text-primary pb-4'>
					Paramètres
				</Text>
			</View>
			<Divider />
			<View className='flex  pt-5 px-2 justify-between pb-28 h-full  items-center gap-2'>
				<View className='flex w-full flex-row'>
					<Text className='text-lg  border-t border border-gray-700 '>
						Fréquence des notifications :
					</Text>
					<Text className='text-lg border-t border border-gray-700 font-bold'>
						{secondsToData(localData.delay)}
					</Text>
					<TouchableOpacity
						className='flex pl-2 items-center justify-center'
						onPress={() => setIsDialogDelayVisible(() => true)}
					>
						<Icon name='edit' type='feather' color='#517fa4' size={24} />
					</TouchableOpacity>
				</View>
				<View className='flex w-full flex-col gap-1 justify-start items-start'>
					<Text className='text-lg border-t w-full border border-gray-700 text-gray-600'>
						Nous rejoindre
					</Text>
					<TouchableOpacity
						onPress={() => onPressDiscord()}
						className='flex flex-row items-center gap-2 justify-start'
					>
						<Icon name='discord' type='material-community' color='#4b5563' />
						<Text className='text-lg border-t underline  border border-gray-700 text-gray-600'>
							Channel Discord
						</Text>
					</TouchableOpacity>
					<View className='flex flex-row items-center gap-2 justify-start'>
						<Icon name='email' type='material-community' color='#4b5563' />
						<Text className='text-lg border-t underline border border-gray-700 text-gray-600'>
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
