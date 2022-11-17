import {StackScreenProps} from '@react-navigation/stack';
import {Button, Icon} from '@rneui/base';
import {Dialog, Divider, Input} from '@rneui/themed';
import {useAtom, useAtomValue} from 'jotai';
import React, {useEffect, useState} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {SelectList} from 'react-native-dropdown-select-list';
import {
	removeAllPreviousNotifications,
	schedulePushNotification,
} from '../../App';
import {delayAtom, localDataAtom} from '../atom';
import {RootStackParamList} from '../routes/stack';
import {FullBook} from '../types/api';

type Props = StackScreenProps<RootStackParamList, 'Settings'>;
type SelectDelay = {
	key: string;
	value: string;
};

export const SettingsSection = ({navigation}: Props) => {
	const [books, setBooks] = useState([]);
	const [localData, setLocalData] = useAtom(localDataAtom);
	const [delay, setDelay] = useAtom(delayAtom);

	useEffect(() => {
		const getBooks = async () =>
			fetch('https://dixit-dominus.vercel.app/api/books');
		getBooks()
			.then(res => res.json())
			.then(res => setBooks(res));
	}, []);

	const [isDialogDelayVisible, setIsDialogDelayVisible] = useState(false);
	const dataToSeconde = () => {
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

	const secondeToData = () => {
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
	const [selected, setSelected] = useState<SelectDelay['value']>(
		secondeToData(),
	);
	console.log(selected);

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
		if (localData?.book)
			schedulePushNotification(
				"It's time to read",
				'You have a new chapter to read',
				dataToSeconde(),
			);
		setDelay(dataToSeconde());
		setIsDialogDelayVisible(false);
	};

	return (
		<View className='h-full w-full px-2'>
			<Text className='text-3xl pt-4 font-bold  pb-10'>Paramétres</Text>
			<Divider />
			<View className='flex flex-row pt-5  items-center gap-2'>
				<Text className='text-lg  border-t border border-gray-700  font-bold   '>
					Notifications :
				</Text>
				<Text className='text-lg border-t border border-gray-700  font-bold   '>
					{secondeToData()}
				</Text>
				<TouchableOpacity
					className='flex items-center justify-center'
					onPress={() => setIsDialogDelayVisible(() => true)}
				>
					<Icon name={'edit'} type='feather' color={'#517fa4'} size={24} />
				</TouchableOpacity>
			</View>
			<Dialog
				onBackdropPress={() => setIsDialogDelayVisible(value => !value)}
				isVisible={isDialogDelayVisible}
			>
				<Dialog.Title title='Choisir le délai entre les notifications' />
				<Input className='text-lg border-t border border-gray-700  font-bold   ' />
				<SelectList
					setSelected={(val: SelectDelay['value']) => setSelected(val)}
					data={data}
					save='value'
					defaultOption={{key: '1', value: selected}}
				/>
				<View className='py-4'>
					<Button onPress={() => onChangeDelay()}>Valider</Button>
				</View>
			</Dialog>
		</View>
	);
};
