import {View, Text} from 'react-native';
import React, {useEffect, useState} from 'react';
import {RootStackParamList} from '../routes/stack';
import {StackScreenProps} from '@react-navigation/stack';
import {Button, Icon} from '@rneui/base';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {LocalData} from '../types/local-storage';
import {FullBook} from '../types/api';
import {useLocalStorage} from '../hooks/use-local-storage';
import {localDataAtom} from '../atom';
import {useAtom} from 'jotai';

type Props = StackScreenProps<RootStackParamList, 'Home'>;

export const HomeScreen = ({navigation}: Props) => {
	const [books, setBooks] = useState([]);
	//const {storeData, currentData, refresh} = useLocalStorage();
	const [localData, setLocalData] = useAtom(localDataAtom);

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
						<Button onPress={() => onClickRead(book)}> Lire</Button>
					</View>
					<Icon name='sc-telegram' type='evilicon' color='#517fa4' size={24} />
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
				Livres <Text className='text-indigo-500 '>en cours</Text>
			</Text>
			<Text className='text-indigo-500 text-xl'>{localData?.book?.title}</Text>
			<Text className='text-indigo-500 text-xl'>
				chapitre actuel : {localData?.currentSection}
			</Text>
		</View>
	);
};
