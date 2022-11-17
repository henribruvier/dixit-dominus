import {StackScreenProps} from '@react-navigation/stack';
import {Button} from '@rneui/base';
import {useAtom, useAtomValue} from 'jotai';
import React, {useEffect, useState} from 'react';
import {Text, View} from 'react-native';
import {delayAtom, localDataAtom} from '../atom';
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
		<View className='h-full w-full px-2'>
			<Text className='text-3xl pt-8 font-bold mx-auto pb-10'>
				Livres <Text className='text-indigo-500'>disponibles</Text>
			</Text>
			{books.map((book: FullBook) => (
				<View
					className='flex flex-row gap-2 justify-between pb-4'
					key={book.title}
				>
					<View className='flex gap-1'>
						<Text className='text-gray-700 text-xl'>📚 {book.title}</Text>
						<Text className='text-gray-400 text-lg'>
							Chapitres : {book.sections.length}
						</Text>
						<Text className='text-gray-400 text-lg'>
							Auteur : {book.author}
						</Text>
					</View>
					<View className='flex items-center justify-center px-4'>
						<Button onPress={() => onClickRead(book)}>Lire</Button>
					</View>
				</View>
			))}
			<Text className='text-3xl pt-20 font-bold mx-auto pb-10 text-center'>
				Livre <Text className='text-indigo-500'>en cours</Text>
			</Text>
			<View className='justify-center items-center flex align-middle px-4'>
				{localData?.book ? (
					<>
						<Text className='text-gray-700 text-xl text-center'>
							{localData?.book?.title}
						</Text>
						<Text className='text-indigo-500 text-xl text-center'>
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
		</View>
	);
};
