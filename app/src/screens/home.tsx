import {StackScreenProps} from '@react-navigation/stack';
import {Button} from '@rneui/themed';

import {useAtom, useAtomValue} from 'jotai';
import React, {useEffect, useState} from 'react';
import {Text, View} from 'react-native';
import {delayAtom, localDataAtom} from '../atom';
import {ButtonApp} from '../components/button';
import {RootStackParamList} from '../routes/stack';
import {FullBook} from '../types/api';
import {
	removeAllPreviousNotifications,
	schedulePushNotification,
} from '../utils/notifications';

type Props = StackScreenProps<RootStackParamList, 'Home'>;

export const HomeScreen = ({navigation}: Props) => {
	const [books, setBooks] = useState([]);
	const [localData, setLocalData] = useAtom(localDataAtom);
	const delay = useAtomValue(delayAtom);

	useEffect(() => {
		const getBooks = async () =>
			fetch('https://dixit-dominus.vercel.app/api/books');

		getBooks()
			.then(res => res.json())
			.then(res => setBooks(res));
	}, []);

	const onClickRead = (book: FullBook) => {
		removeAllPreviousNotifications();
		setLocalData({book, currentSection: 0});
		schedulePushNotification(
			'Il est temps de lire',
			'Votre chapitre vous attend',
			delay,
		);
	};

	return (
		<View className='h-full w-full px-2 text-primary'>
			<Text className='text-3xl pt-8 font-bold  text-primary pb-10'>
				Mes lectures <Text className='text-secondary'>en cours</Text>
			</Text>
			<View className='justify-center items-center flex align-middle px-4'>
				{localData?.book ? (
					<>
						<Text className='text-gray-700 text-xl text-center'>
							{localData?.book?.title}
						</Text>
						<Text className='text-primary text-xl text-center'>
							Chapitre actuel : {localData?.currentSection} /{' '}
							{localData?.book.sections.length}
						</Text>
					</>
				) : (
					<Text className='text-xl text-center'>
						Aucun livre en cours pour le moment
					</Text>
				)}
			</View>
			<Text className='text-3xl pt-8 font-bold  text-primary pb-10'>
				Livres <Text className='text-secondary'>disponibles</Text>
			</Text>
			{books.map((book: FullBook) => (
				<View
					className='flex flex-row gap-2 justify-between pb-4'
					key={book.title}
				>
					<View className='flex gap-1'>
						<Text className=' text-xl font-bold'>{book.title}</Text>
						<Text className='text-gray-400 text-lg'>
							Chapitres : {book.sections.length}
						</Text>
						<Text className='text-gray-400 text-lg'>
							Auteur : {book.author}
						</Text>
					</View>
					<View className='flex items-center justify-center px-4'>
						<ButtonApp onPress={() => onClickRead(book)}>Lire</ButtonApp>
					</View>
				</View>
			))}
		</View>
	);
};
