import {StackScreenProps} from '@react-navigation/stack';
import {Icon} from '@rneui/base';
import {Dialog, Divider, Input} from '@rneui/themed';
import {useAtom} from 'jotai';
import React, {useState} from 'react';
import {Linking, Text, TouchableOpacity, View} from 'react-native';
import {SelectList} from 'react-native-dropdown-select-list';
import {localDataAtom} from '../atom';
import {ButtonApp} from '../components/button';
import {RootStackParamList} from '../routes/stack';
import {
	removeAllPreviousNotifications,
	schedulePushNotification,
} from '../utils/notifications';

type Props = StackScreenProps<RootStackParamList, 'Settings'>;
type SelectDelay = {
	key: string;
	value: string;
};

const dataToSeconds = (selected: string) => {
	switch (selected) {
		case '20 min':
			return 1200;
		case '40 min':
			return 2400;
		case '1h':
			return 3600;
		case '1h30':
			return 5400;
		case '2h':
			return 7200;
		case '10 sec':
			return 10;
		default:
			return 1200;
	}
};

const secondsToData = (delay: number | undefined) => {
	switch (delay) {
		case 1200:
			return '20 min';
		case 2400:
			return '40 min';
		case 3600:
			return '1h';
		case 5400:
			return '1h30';
		case 7200:
			return '2h';
		case 10:
			return '10 sec';
		default:
			return '20 min';
	}
};

export const SettingsSection = ({navigation}: Props) => {
	const [localData, setLocalData] = useAtom(localDataAtom);
	const [isDialogDelayVisible, setIsDialogDelayVisible] = useState(false);
	const [selected, setSelected] = useState<string>(
		secondsToData(localData.delay),
	);

	const data = [
		{key: '1', value: '20 min'},
		{key: '2', value: '40 min'},
		{key: '3', value: '1h'},
		{key: '4', value: '1h30'},
		{key: '5', value: '2h'},
		{key: '6', value: '10 sec'},
	];

	const onChangeDelay = () => {
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
						<Icon name={'edit'} type='feather' color={'#517fa4'} size={24} />
					</TouchableOpacity>
				</View>
				<View className='flex w-full'>
					<Text className='text-lg border-t w-full border border-gray-700 '>
						Nous rejoindre
					</Text>
					<TouchableOpacity
						onPress={() => onPressDiscord()}
						className='flex flex-row items-center gap-2 justify-start'
					>
						<Icon name='discord' type='material-community' color={'black'} />
						<Text className='text-lg border-t underline  border border-gray-700 '>
							Channel Discord
						</Text>
					</TouchableOpacity>
					<View className='flex flex-row items-center gap-2 justify-start'>
						<Icon name='email' type='material-community' color={'black'} />
						<Text className='text-lg border-t underline  border border-gray-700 '>
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
					setSelected={(val: SelectDelay['value']) => setSelected(val)}
					data={data}
					save='value'
					defaultOption={{key: '1', value: selected}}
				/>
				<View className='py-4'>
					<ButtonApp onPress={() => onChangeDelay()}>Valider</ButtonApp>
				</View>
			</Dialog>
		</View>
	);
};
