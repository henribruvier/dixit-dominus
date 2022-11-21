import {StackScreenProps} from '@react-navigation/stack';
import {Icon} from '@rneui/themed';
import {useAtom, useAtomValue} from 'jotai';
import React from 'react';
import {ScrollView, Text, View} from 'react-native';
import {delayAtom, localDataAtom} from '../atom';
import {ButtonApp} from '../components/button';
import {RootStackParamList} from '../routes/stack';
import {
	removeAllPreviousNotifications,
	schedulePushNotification,
} from '../utils/notifications';

type Props = StackScreenProps<RootStackParamList, 'Read'>;

export const ReadScreen = ({navigation}: Props) => {
	const [localData, setLocalData] = useAtom(localDataAtom);
	const delay = useAtomValue(delayAtom);
	const {book, currentSection} = localData;

	const onClickRead = () => {
		if (!book) return;
		removeAllPreviousNotifications();
		schedulePushNotification(
			'Il est temps de lire',
			'Votre chapitre vous attend',
			delay,
		);
		if (currentSection.get(book.id) === book.sections.length - 1) {
			setLocalData(prev => ({
				...localData,
				currentSection: prev.currentSection.set(book.id, 0),
			}));
			return;
		}
		setLocalData(prev => ({
			...localData,
			currentSection: prev.currentSection.set(
				book.id,
				prev.currentSection.get(book.id)! + 1,
			),
		}));
	};
	const orderedSections = localData?.book?.sections.sort(
		(a, b) => a.order - b.order,
	);

	if (!book) {
		return (
			<View className='h-full w-full px-2 relative pt-8'>
				<View className='align-middle justify-center items-center h-full px-6'>
					<Text className='text-3xl font-bold mx-auto pb-10 text-center'>
						Aucun livre en cours pour le moment
					</Text>
				</View>
			</View>
		);
	}

	const section = currentSection.get(book.id) ?? 0;

	const replacedText =
		currentSection !== undefined
			? orderedSections?.[section].content
					.replace(/\t/g, '')
					.replace(/\n/g, '\n\n')
			: '';

	return (
		<View className='h-full w-full px-2 relative pt-8'>
			<Text className='text-3xl pt-4 font-bold pb-4 px-12 text-center'>
				{book.title}
			</Text>
			<Text className='text-gray-400 text-xl text-center pb-2'>
				Chapitre {section + 1}
			</Text>
			<Text className='text-gray-400 text-xl text-center pb-4'>
				{orderedSections && orderedSections[section].title}
			</Text>

			<ScrollView>
				<Text className='text-xl pb-24 scroll-y-auto whitespace-pre '>
					{replacedText}
				</Text>
			</ScrollView>

			<View className='w-full flex items-center absolute bottom-4 left-0'>
				<ButtonApp onPress={() => onClickRead()}>
					<View className='flex flex-row gap-4 items-center justify-center'>
						<Text className='font-bold text-white text-lg'>Lu</Text>
						<Icon name='check' type='feather' color={'white'} />
					</View>
				</ButtonApp>
			</View>
		</View>
	);
};
