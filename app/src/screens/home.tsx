import {StackScreenProps} from '@react-navigation/stack';
import {useTheme} from '@rneui/themed';
import {useAtom} from 'jotai';
import React, {useEffect, useState} from 'react';
import {Image, ScrollView, Text, View} from 'react-native';
import * as Sentry from 'sentry-expo';
import {localDataAtom} from '../atom';
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
	const {theme} = useTheme();
	const {book, sectionsMap} = localData;

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
			...prev,
			book,
			sectionsMap: {
				...prev.sectionsMap,
				...(prev?.sectionsMap?.[book.id]
					? {[book.id]: prev.sectionsMap[book.id]}
					: {[book.id]: 0}),
			},
		}));

		schedulePushNotification(
			'Il est temps de lire',
			'Votre chapitre vous attend',
			localData.delay,
		);

		getData().then(res => console.log(res.sectionMap));
	};

	return (
		<ScrollView
			className='h-full w-full px-2'
			style={{backgroundColor: theme.colors.background}}
		>
			<View className='border-b border-gray-300'>
				<Text
					className='text-3xl pt-12 font-bold pb-4'
					style={{color: theme.colors.primary}}
				>
					Home
				</Text>
			</View>
			<Text
				className='text-3xl pt-6 font-bold pb-10'
				style={{color: theme.colors.primary}}
			>
				Mon livre <Text style={{color: theme.colors.secondary}}>en cours</Text>
			</Text>
			<View className='justify-center items-center flex align-middle px-4'>
				{book ? (
					<View className='flex flex-row gap-4'>
						<View className='h-20 w-16 overflow-hidden rounded-md'>
							{book.image && (
								<Image
									className='w-full h-full object-contain'
									source={{uri: book.image}}
								/>
							)}
						</View>
						<View className='flex flex-col w-4/5'>
							<Text
								className='font-bold text-xl'
								style={{color: theme.colors.grey0}}
							>
								{book?.title}
							</Text>
							<Text className='text-xl' style={{color: theme.colors.primary}}>
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
			<Text
				className='text-3xl pt-12 font-bold  pb-10'
				style={{color: theme.colors.primary}}
			>
				Livres <Text style={{color: theme.colors.secondary}}>disponibles</Text>
			</Text>
			<ScrollView className='gap-2' horizontal>
				{books.map((book: FullBook) => (
					<View
						key={book.title}
						className='flex flex-col w-36 px-2 gap-2 items-center'
					>
						<View className='w-28 h-44 overflow-hidden rounded-md'>
							{book.image && (
								<Image
									className='w-full h-full object-contain'
									source={{uri: book.image}}
								/>
							)}
						</View>

						<View className='flex flex-col text-left w-full h-full justify-start items-start p-0'>
							<Text
								className='text-lg font-bold pb-1'
								style={{color: theme.colors.primary}}
							>
								{book.title}
							</Text>
							<Text className='text-gray-500 text-md'>{book.author}</Text>
							{!localData?.book || localData?.book?.title !== book.title ? (
								<View className='flex pt-2 items-center justify-center px-4 w-full'>
									<ButtonApp onPress={() => onClickRead(book)}>
										<Text
											className='font-bold text-lg'
											style={{color: theme.colors.white}}
										>
											Lire
										</Text>
									</ButtonApp>
								</View>
							) : null}
						</View>
					</View>
				))}
			</ScrollView>
		</ScrollView>
	);
};
