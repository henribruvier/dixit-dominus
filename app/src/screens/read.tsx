import {StackScreenProps} from '@react-navigation/stack';
import {Button, Icon} from '@rneui/themed';
import {useAtom, useAtomValue} from 'jotai';
import React from 'react';
import {Text, View} from 'react-native';
import {schedulePushNotification} from '../../App';
import {delayAtom, localDataAtom} from '../atom';
import {RootStackParamList} from '../routes/stack';

type Props = StackScreenProps<RootStackParamList, 'Read'>;

export const ReadScreen = ({navigation}: Props) => {
	const [localData, setLocalData] = useAtom(localDataAtom);
	const delay = useAtomValue(delayAtom);

	const onClickRead = () => {
		if (!localData) return;
		schedulePushNotification(
			"It's time to read",
			'You have a new chapter to read',
			delay,
		);
		if (localData?.currentSection === localData?.book.sections.length - 1) {
			setLocalData({...localData, currentSection: 0});
			return;
		}
		setLocalData({
			...localData,
			currentSection: localData.currentSection + 1,
		});
	};

	return (
		<View className='h-full w-full px-2 relative'>
			{localData && (
				<>
					<Text className='text-2xl pt-4 font-bold pb-2'>
						{localData?.book.title}
					</Text>
					<Text className='text-gray-400 text-xl'>
						chapitre actuel : {localData?.currentSection + 1}
					</Text>

					<Text className='text-indigo-500 text-xl'>
						{localData?.book?.sections[localData.currentSection].content}
					</Text>
					<View className='w-full flex items-center absolute bottom-4 left-0'>
						<Button
							onPress={() => onClickRead()}
							buttonStyle={{
								backgroundColor: 'rgba(78, 116, 289, 1)',
								borderRadius: 3,
							}}
							containerStyle={{
								width: 150,
							}}
						>
							<View className='flex flex-row gap-4 items-center justify-center'>
								<Text className='font-bold text-white text-lg'>Lu</Text>
								<Icon name='check' type='feather' color={'white'} />
							</View>
						</Button>
					</View>
				</>
			)}
		</View>
	);
};
