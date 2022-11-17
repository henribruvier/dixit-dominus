import {StackScreenProps} from '@react-navigation/stack';
import {Button, Icon} from '@rneui/base';
import {Dialog, Divider, Input} from '@rneui/themed';
import {useAtom, useAtomValue} from 'jotai';
import React, {useEffect, useState} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {delayAtom, localDataAtom} from '../atom';
import {RootStackParamList} from '../routes/stack';
import {FullBook} from '../types/api';

type Props = StackScreenProps<RootStackParamList, 'Settings'>;

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

	const onClickRead = (book: FullBook) => {
		setLocalData({book, currentSection: 0});
	};

	const [isDialogDelayVisible, setIsDialogDelayVisible] = useState(false);

	return (
		<View className='h-full w-full px-2'>
			<Text className='text-3xl pt-4 font-bold  pb-10'>Paramétres</Text>
			<Divider />
			<View className='flex flex-row pt-5  items-center gap-2'>
				<Text className='text-lg  border-t border border-gray-700  font-bold   '>
					Notifications :
				</Text>
				<Text className='text-lg border-t border border-gray-700  font-bold   '>
					{(delay ?? 1) / 60} minutes
				</Text>
				<TouchableOpacity
					className='flex items-center justify-center'
					onPress={() => setIsDialogDelayVisible(() => true)}
				>
					<Icon name={'edit'} type='feather' color={'#517fa4'} size={24} />
				</TouchableOpacity>
			</View>
			<Dialog isVisible={isDialogDelayVisible}>
				<Dialog.Title title='Choisir le délai entre les notifications' />
				<Input className='text-lg border-t border border-gray-700  font-bold   ' />
			</Dialog>
		</View>
	);
};
