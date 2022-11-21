import {StackScreenProps} from '@react-navigation/stack';

import {useAtom, useAtomValue} from 'jotai';
import React, {useEffect, useState} from 'react';
import {ScrollView, Text, View} from 'react-native';
import {delayAtom, localDataAtom} from '../atom';
import {ButtonApp} from '../components/button';
import {RootStackParamList} from '../routes/stack';
import {FullBook} from '../types/api';
import {
	removeAllPreviousNotifications,
	schedulePushNotification,
} from '../utils/notifications';
import {Image} from '@rneui/themed';

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
			<View className='border-b border-gray-300'>
				<Text className='text-3xl pt-12 font-bold text-primary pb-4'>Home</Text>
			</View>
			<Text className='text-3xl pt-6 font-bold text-primary pb-10'>
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
			<Text className='text-3xl pt-12 font-bold text-primary pb-10'>
				Livres <Text className='text-secondary'>disponibles</Text>
			</Text>
			<ScrollView horizontal>
				{books.map((book: FullBook) => (
					<View
						key={book.title}
						className='flex flex-col w-1/3 px-2 gap-2 items-center'
					>
						<View className='w-28 h-44 bg-pink-300 rounded-md'>
							{book.image && (
								<Image
									containerStyle={{
										width: '100%',
										height: '100%',
										flex: 1,
										aspectRatio: 1,
									}}
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
