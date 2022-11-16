import {View, Text} from 'react-native';
import React, {useEffect, useState} from 'react';
import {RootStackParamList} from '../routes/stack';
import {StackScreenProps} from '@react-navigation/stack';
import {Book} from '../../../db/prisma';

type Props = StackScreenProps<RootStackParamList, 'Home'>;

export const HomeScreen = ({navigation}: Props) => {
	const [books, setBooks] = useState([]);

	useEffect(() => {
		const getBooks = async () =>
			fetch('https://dixit-dominus.vercel.app/api/books');
		getBooks()
			.then(res => res.json())
			.then(res => setBooks(res));
	});

	return (
		<View className='h-full w-full px-2'>
			<Text className='text-5xl font-bold mx-auto pb-10 '>
				Livres <Text className='text-indigo-500 text-6xl'>disponibles</Text>
			</Text>
			{books.map((book: Book) => (
				<View className='flex gap-2'>
					<Text className='text-indigo-500 text-xl'>{book.title}</Text>
					<Text className='text-indigo-500 text-xl'>{book.}</Text>
				</View>
			))}
		</View>
	);
};
