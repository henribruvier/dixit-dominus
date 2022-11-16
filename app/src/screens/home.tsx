import {View, Text} from 'react-native';
import React, {useEffect, useState} from 'react';
import {RootStackParamList} from '../routes/stack';
import {StackScreenProps} from '@react-navigation/stack';
import {Book, Section} from '../../../db/prisma';
import {Button} from '@rneui/base';
import {schedulePushNotification} from '../../App';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Props = StackScreenProps<RootStackParamList, 'Home'>;

type FullBook = Book & {sections: Section[]};

type LocalData = {
	book: FullBook;
	currentSection: number;
};

export const HomeScreen = ({navigation}: Props) => {
	const [books, setBooks] = useState([]);
	const [currentData, setCurrentData] = useState<LocalData>();

	const storeData = async (value: LocalData) => {
		try {
			const jsonValue = JSON.stringify(value);
			await AsyncStorage.setItem('@local_data', jsonValue);
			setCurrentData(value);
		} catch (e) {
			// saving error
		}
	};

	const getData = async () => {
		try {
			const jsonValue = await AsyncStorage.getItem('@local_data');
			return jsonValue != null ? JSON.parse(jsonValue) : null;
		} catch (e) {
			// error reading value
		}
	};

	useEffect(() => {
		const setData = async () => {
			const data = await getData();
			setCurrentData(() => data);
		};
		setData();
	}, []);

	useEffect(() => {
		const getBooks = async () =>
			fetch('https://dixit-dominus.vercel.app/api/books');
		getBooks()
			.then(res => res.json())
			.then(res => setBooks(res));
	}, []);

	const onClickRead = (book: FullBook) => {
		storeData({book, currentSection: 0});
	};

	return (
		<View className='h-full w-full px-2'>
			<Text className='text-3xl pt-4 font-bold mx-auto pb-10 '>
				Livres <Text className='text-indigo-500 '>disponibles</Text>
			</Text>
			{books.map((book: FullBook) => (
				<View className='flex flex-row gap-2 justify-between'>
					<View className='flex gap-1'>
						<Text className='text-gray-700 text-xl'>📚 {book.title}</Text>
						<Text className='text-gray-400 text-lg'>
							Chapitres : {book.sections.length}
						</Text>
						<Text className='text-gray-400 text-lg'>
							Auteur : {book.author}
						</Text>
					</View>
					<View className='flex items-center justify-center'>
						<Button onPress={() => onClickRead(book)}>Lire</Button>
					</View>
				</View>
			))}
			{/* <Button
				onPress={async () => {
					console.log('cliack');
					await schedulePushNotification('Test', 'Body');
				}}
			>
				Send notification
			</Button>
			<Button
				onPress={async () => {
					await storeData(data);
				}}
			>
				Store Data
			</Button> */}
			<Text className='text-3xl pt-4 font-bold mx-auto pb-10 '>
				Livres <Text className='text-indigo-500 '>en cour</Text>
			</Text>
			<Text className='text-indigo-500 text-xl'>
				{currentData?.book?.title}
			</Text>
			<Text className='text-indigo-500 text-xl'>
				chapitre actuel : {currentData?.currentSection}
			</Text>
		</View>
	);
};
