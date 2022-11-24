import {StackScreenProps} from '@react-navigation/stack';

import AsyncStorage from '@react-native-async-storage/async-storage';
import {useAtom, useAtomValue} from 'jotai';
import React, {useEffect, useState} from 'react';
import {Image, ScrollView, Text, View} from 'react-native';
import * as Sentry from 'sentry-expo';
import {delayAtom, localDataAtom} from '../atom';
import {ButtonApp} from '../components/button';
import {RootStackParamList} from '../routes/stack';
import {FullBook} from '../types/api';
import {getData} from '../utils/local-storage';
import {
	removeAllPreviousNotifications,
	schedulePushNotification,
} from '../utils/notifications';

type Props = StackScreenProps<RootStackParamList, 'Home'>;

export const HomeScreen = ({navigation}: Props) => {
	const [books, setBooks] = useState([]);
	const [localData, setLocalData] = useAtom(localDataAtom);
	const delay = useAtomValue(delayAtom);

	const clearData = async () => {
		try {
			await AsyncStorage.setItem('localData', '');
		} catch (e) {
			// saving error
		}
	};

	//clearData();

	useEffect(() => {
		try {
			const getBooks = async () =>
				fetch('https://dixit-dominus.vercel.app/api/books');

			getBooks()
				.then(res => res.json())
				.then(res => setBooks(res));
		} catch (error) {
			console.log('error', error);
			Sentry.Native.captureException(error);
		}
	}, []);

	const onClickRead = (book: FullBook) => {
		removeAllPreviousNotifications();
		setLocalData(prev => ({
			book,
			sectionsMap: {
				...prev.sectionsMap,
				...(prev.sectionsMap[book.id]
					? {[book.id]: prev.sectionsMap[book.id]}
					: {[book.id]: 0}),
			},
		}));
		//storeData(JSON.stringify(localData));

		schedulePushNotification(
			'Il est temps de lire',
			'Votre chapitre vous attend',
			delay,
		);
		console.log(localData.sectionsMap);
		getData().then(res => console.log(res.sectionMap));
	};

	const {book, sectionsMap} = localData;

	return (
		<View className='h-full w-full px-2 text-primary'>
			<View className='border-b border-gray-300'>
				<Text className='text-3xl pt-12 font-bold text-primary pb-4'>Home</Text>
			</View>
			<Text className='text-3xl pt-6 font-bold text-primary pb-10'>
				Mon livre <Text className='text-secondary'>en cours</Text>
			</Text>
			<View className='justify-center items-center flex align-middle px-4'>
				{book ? (
					<View className='flex flex-row gap-4'>
						<View className=' h-20 w-16 overflow-hidden bg-pink-300 rounded-md'>
							{book.image && (
								<Image
									className='w-full h-full object-contain'
									source={{uri: book.image}}
								/>
							)}
						</View>
						<View className='flex flex-col'>
							<Text className='text-gray-700 font-bold text-xl '>
								{book?.title}
							</Text>
							<Text className='text-primary text-xl '>
								Chapitre actuel : {sectionsMap[book.id]} /{' '}
								{book.sections.length}
							</Text>
						</View>
					</View>
				) : (
					<Text className='text-xl text-center'>
						Aucun livre en cours pour le moment
					</Text>
				)}
			</View>
			<Text className='text-3xl pt-12 font-bold text-primary pb-10'>
				Livres <Text className='text-secondary'>disponibles</Text>
			</Text>
			<ScrollView horizontal>
				{books.map((book: FullBook) => (
					<View
						key={book.title}
						className='flex flex-col w-1/3 px-2 gap-2 items-center'
					>
						<View className='w-28 h-44 overflow-hidden bg-pink-300 rounded-md'>
							{book.image && (
								<Image
									className='w-full h-full object-contain'
									source={{uri: book.image}}
								/>
							)}
						</View>
						{!localData?.book || localData?.book?.title !== book.title ? (
							<View className='flex items-center justify-center px-4'>
								<ButtonApp onPress={() => onClickRead(book)}>Lire</ButtonApp>
							</View>
						) : null}
						<View className='flex flex-row gap-2 justify-between pb-4 text-left'>
							<View className='flex gap-1'>
								<Text className='text-lg font-bold text-primary'>
									{book.title}
								</Text>
								<Text className='text-gray-500 text-md'>{book.author}</Text>
							</View>
						</View>
					</View>
				))}
			</ScrollView>
		</View>
	);
};
