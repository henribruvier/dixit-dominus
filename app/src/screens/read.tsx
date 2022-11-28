import {StackScreenProps} from '@react-navigation/stack';
import {Icon, useTheme} from '@rneui/themed';
import {useAtom} from 'jotai';
import React from 'react';
import {ScrollView, Text, View} from 'react-native';
import {localDataAtom} from '../atom';
import {ButtonApp} from '../components/button';
import {RootStackParamList} from '../routes/stack';
import {
	removeAllPreviousNotifications,
	schedulePushNotification,
} from '../utils/notifications';

type Props = StackScreenProps<RootStackParamList, 'Read'>;

export const ReadScreen = ({navigation}: Props) => {
	const {theme} = useTheme();
	const [localData, setLocalData] = useAtom(localDataAtom);
	const {book, sectionsMap} = localData;

	const onClickRead = () => {
		if (!book) return;
		removeAllPreviousNotifications();
		schedulePushNotification(
			'Il est temps de lire',
			'Votre chapitre vous attend',
			localData.delay,
		);
		if (sectionsMap[book.id] === book.sections.length - 1) {
			setLocalData(prev => ({
				...localData,
				sectionsMap: {...prev.sectionsMap, [book.id]: 0},
			}));

			return;
		}
		setLocalData(prev => ({
			...localData,
			sectionsMap: {
				...prev.sectionsMap,
				[book.id]: prev.sectionsMap[book.id] + 1,
			},
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

	const section = sectionsMap[book.id] ?? 0;

	const replacedText = orderedSections?.[section].content
		.replace(/\t/g, '')
		.replace(/\n/g, '\n\n');

	const onClickBack = () => {
		setLocalData(prev => ({
			...localData,
			sectionsMap: {
				...prev.sectionsMap,
				[book.id]:
					prev.sectionsMap[book.id] === 0
						? prev.sectionsMap[book.id]
						: prev.sectionsMap[book.id] - 1,
			},
		}));
	};

	return (
		<View
			className='h-full w-full px-2 relative pt-8'
			style={{backgroundColor: theme.colors.background}}
		>
			<Text
				className='text-3xl pt-4 font-bold pb-4 px-12 text-center'
				style={{color: theme.colors.primary}}
			>
				{book.title}
			</Text>
			<Text
				className='text-xl text-center pb-2'
				style={{color: theme.colors.grey2}}
			>
				Chapitre {section + 1}
			</Text>
			<Text
				className='text-xl text-center pb-4'
				style={{color: theme.colors.grey2}}
			>
				{orderedSections && orderedSections[section].title}
			</Text>

			<ScrollView>
				<Text
					className='text-xl pb-24 scroll-y-auto whitespace-pre'
					style={{color: theme.colors.black}}
				>
					{replacedText}
				</Text>
			</ScrollView>

			<View className='w-full flex-row justify-between flex items-center absolute bottom-4 left-0 mx-2'>
				<ButtonApp disabled={section === 0} onPress={() => onClickBack()}>
					<View className='flex flex-row gap-4 items-center justify-center'>
						<Icon name='arrow-left' type='feather' color={theme.colors.white} />
					</View>
				</ButtonApp>
				<ButtonApp onPress={() => onClickRead()}>
					<View className='flex flex-row gap-4 items-center justify-center'>
						<Text
							className='font-bold text-lg'
							style={{color: theme.colors.white}}
						>
							Lu
						</Text>
						<Icon name='check' type='feather' color={theme.colors.white} />
					</View>
				</ButtonApp>
			</View>
		</View>
	);
};
